describe('Auth Endpoints', () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!'
    };
  
    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const res = await request
          .post('/api/auth/register')
          .send(userData);
  
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toBe(userData.email);
      });
  
      it('should prevent duplicate email registration', async () => {
        const res = await request
          .post('/api/auth/register')
          .send(userData);
  
        expect(res.status).toBe(409);
      });
    });
  
    describe('POST /api/auth/login', () => {
      it('should login with valid credentials', async () => {
        const res = await request
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          });
  
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('token');
      });
    });
  });