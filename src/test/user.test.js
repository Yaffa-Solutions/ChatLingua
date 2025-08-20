const app = require('../../app');
const request = require('supertest');

let cookie;
let cookie2;
describe('Auth Endpoints', () => {
  test('SIGNUP user', () => {
    return request(app)
      .post('/register')
      .send({ username: 'nada', password: 'pass123' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty(
          'message',
          'user registered successfully '
        );
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('username', 'nada');
        cookie = res.headers['set-cookie'];
      });
  });

  test('SIGNUP user2 that is receiver messages', () => {
    return request(app)
      .post('/register')
      .send({ username: 'aysha', password: 'pass123' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty(
          'message',
          'user registered successfully '
        );
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('username', 'aysha');
        cookie2=res.headers['set-cookie'];
      });
  });

  test('SIGNUP USER DUPLICATE', () => {
    return request(app)
      .post('/register')
      .send({ username: 'nada', password: 'pass123' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty(
          'error',
          'duplicate key value violates unique constraint "users_username_key"'
        );
      });
  });

  test('LOGIN user', async () => {
    return request(app)
      .post('/login')
      .send({ username: 'nada', password: 'pass123' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
          'message',
          'user logged in successfully '
        );
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
      });
  });

  test('LOGIN WITH WRONG PASSWORD FAIL', () => {
    return request(app)
      .post('/login')
      .send({ username: 'nada', password: 'wrongPassword' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
      });
  });

  test('LOGIN with non-existing user should fail', () => {
    return request(app)
      .post('/login')
      .send({ username: 'nadasalha', password: 'pass123' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
      });
  });
});

describe('Chat Controller', () => {
  test('POST /chat - should add chat', () => {
    return request(app)
      .post('/chat')
      .set('Cookie', cookie)
      .send({ name: 'My Friend' })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty(
          'message',
          'the chat is added successfully'
        );
        expect(res.body.data.chat).toHaveProperty('name', 'My Friend');
      });
  });

  test('POST /profile - should add message', () => {
    return request(app)
      .post('/profile')
      .set('Cookie', cookie)
      .send({
        native_language_id: 1,
        learning_language_id: 2,
        image:
          'https://images.pexels.com/photos/32007821/pexels-photo-32007821.jpeg',
      })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Profile created successfully!');
        expect(res.body.data).toMatchObject({
        native_language_id: 1,
        learning_language_id: 2,
        image:
          'https://images.pexels.com/photos/32007821/pexels-photo-32007821.jpeg',
      });
      });
  });

  test('POST /profile - should add message', () => {
    return request(app)
      .post('/profile')
      .set('Cookie', cookie2)
      .send({
        native_language_id: 1,
        learning_language_id: 2,
        image:
          'https://images.pexels.com/photos/32007821/pexels-photo-32007821.jpeg',
      })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Profile created successfully!');
        expect(res.body.data).toMatchObject({
        native_language_id: 1,
        learning_language_id: 2,
        image:
          'https://images.pexels.com/photos/32007821/pexels-photo-32007821.jpeg',
      });
      });
  });

  test('POST /chat/message - should add message', () => {
    return request(app)
      .post('/chat/message')
      .set('Cookie', cookie)
      .send({
        chat_id: 1,
        content: 'HI IAM NADA SALHA',
        sender_id: 1,
        receiver_id: 2,
      })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('the message is added successfully');
        expect(res.body.status).toBe(201);
        expect(res.body.data.messages).toMatchObject({
          chat_id: 1,
          content: 'HI IAM NADA SALHA',
          sender_id: 1,
          receiver_id: 2,
        });
      });
  });

  test('GET /chat/profiles/:id - should return profiles ', () => {
    return request(app)
      .get('/chat/profiles/2')
      .set('Cookie', cookie)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data.profiles)).toBe(true);
        expect(res.body.message).toBe(
          'this is the profiles about your learning language'
        );
      });
  });

  test('GET /chat/messages/:chat_id - should return messages', () => {
    return request(app)
      .get('/chat/messages/1')
      .set('Cookie', cookie)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('these is all messages for this chat 1');
        expect(Array.isArray(res.body.data.messages)).toBe(true);
      });
  });

  test('DELETE /chat/:id - should delete chat', () => {
    return request(app)
      .delete('/chat/1')
      .set('Cookie', cookie)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Chat deleted successfully');
        expect(res.body.data.chat).toHaveProperty('name', 'My Friend');
      });
  });


//////////////////////////////////////Failed
test('POST /chat - should add chat', () => {
    return request(app)
      .post('/chat')
      .set('Cookie', cookie)
      .send({})
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message','the chat is added successfully');
        expect(res.body.data.chat).toHaveProperty('name','Chat');
      });
  });

  test('POST /profile - should add message Failed', () => {
    return request(app)
      .post('/profile')
      .set('Cookie', cookie)
      .send({
        native_language_id: 3,
        learning_language_id: 2,
        image:
          'https://images.pexels.com/photos/32007821/pexels-photo-32007821.jpeg',
      })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('you have already profile');
      });
  });

  test('POST /profile - should add message Failed', () => {
    return request(app)
      .post('/profile')
      .set('Cookie', cookie2)
      .send({
        native_language_id: 1,
        learning_language_id: 2,
        image:
          'https://images.pexels.com/photos/32007821/pexels-photo-32007821.jpeg',
      })
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('you have already profile');
      });
  });

  test('POST /chat/message - should add message Failed', () => {
    return request(app)
      .post('/chat/message')
      .set('Cookie', cookie)
      .send({
        chat_id: 4,
        content: 'HI IAM NADA SALHA',
        sender_id: 1,
        receiver_id: 2,
      })
      .expect('Content-Type', /json/)
      .then((res) => {
       expect(res.status).toBe(404);
        expect(res.body.error).toBe('Chat with id=4 not found');
      });
  });

  test('GET /chat/profiles/:id - should return profiles ', () => {
    return request(app)
      .get('/chat/profiles/8')
      .set('Cookie', cookie)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe(
          'not found any profiles about this language'
        );
      });
  });

  test('GET /chat/messages/:chat_id - should return messages', () => {
    return request(app)
      .get('/chat/messages/4')
      .set('Cookie', cookie)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Chat with id=4 not found');
      });
  });


  test('DELETE /chat/:id -should delete chat that id not found ', () => {
    return request(app)
    .delete('/chat/4')
    .set('Cookie',cookie)
    .expect('Content-Type',/json/)
    .then((res)=>{
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error','Chat not found');
    })
  });


  
});
