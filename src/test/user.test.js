const app = require('../../app');
const request = require('supertest');

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

// describe('Chat Controller', () => {
//   test('POST /chat - should add chat', () => {
//     return request(app)
//       .post('/chat')
//       .send({ name: 'My Friend' })
//       .expect('Content-Type', /json/)
//       .then((res) => {
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty('message','the chat is added successfully');
//         expect(res.body.data.chat).toHaveProperty('name', 'My Friend');
//       });
//   });

//   test('DELETE /chat/:id - should delete chat', () => {
//     return request(app)
//       .delete('/chat/1')
//       .expect('Content-Type', /json/)
//       .then((res) => {
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty('message','Chat deleted successfully');
//         expect(res.body.data.chat).toHaveProperty('name', 'My Friend');
//       });
//   });

//   test('POST /chat/message - should add message', () => {
//     return request(app)
//     .post('/chat/message')
//     .send({chat_id:2, content:"HI IAM NADA SALHA",sender_id:2,receiver_id :3})
//     .expect('Content-Type',/json/)
//     .then((res)=>{
//       expect(res.status).toBe(201);
//       expect(res.body.message).toBe('the message is added successfully');
//       expect(res.body.status).toBe(201);
//       expect(res.body.data.messages).toMatchObject({chat_id:2, content:"HI IAM NADA SALHA",sender_id:2,receiver_id :3});
//     });    
//   });


//   test('GET /chat/profiles/:id - should return profiles ', () => {
//     return request(app)
//     .get('/chat/profiles/1')
//     .expect('Content-Type',/json/)
//     .then((res)=>{
//       expect(res.status).toBe(200);
//       expect(Array.isArray(res.body.data.profiles)).toBe(tr);
//       expect(res.body.message).toBe('this is the profiles about your learning language');
//     })
//   });


//   test('GET /chat/messages/:chat_id - should return messages', () => {
//     return request(app)
//     .get('/chat/messages/1')
//     .expect('Content-Type',/json/)
//     .then((res)=>{
//      expect(res.status).toBe(200);
//      expect(res.body.message).toBe('these is all messages for this chat 1');  
//      expect(Array.isArray(res.body.data.messages)).toBe(true);
//     })
//   })
// });



