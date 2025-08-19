const app = require('../../app');
const request = require('supertest');

describe('Auth Endpoints', () => {
  test('SIGNUP user',  () => {
  return  request(app)
      .post('/register')
      .send({ username: 'nada', password: 'pass123' })
      .expect('Content-Type', /json/)
      .then((res)=>{
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty('message', 'user registered successfully ');
          expect(res.body).toHaveProperty('token');
          expect(typeof res.body.token).toBe('string');
         expect(res.body).toHaveProperty('data');
         expect(res.body.data).toHaveProperty('username', 'nada');
      })
     });


     test('SIGNUP USER DUPLICATE', () => {

      return request(app)
      .post('/register')
      .send({ username: 'nada', password: 'pass123' })
      .expect('Content-Type',/json/)
      .then((res)=>{
          expect(res.status).toBe(500);         
          expect(res.body).toHaveProperty('error', 'duplicate key value violates unique constraint \"users_username_key\"');        
      })
     });
         
  test('LOGIN user', async () => {
    return request(app)
      .post('/login')
      .send({ username: 'nada', password: 'pass123' })
      .expect('Content-Type', /json/)
    .then((res)=>{
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'user logged in successfully ');
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    })
   
  });

  test('LOGIN WITH WRONG PASSWORD FAIL', () => {
    return request(app)
    .post('/login')
    .send({username:'nada',password:'wrongPassword'})
    .expect('Content-Type',/json/)
    .then((res)=>{
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    })
  })
  
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
