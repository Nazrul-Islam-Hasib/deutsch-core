import request from 'supertest';
import app from '../index';
import prisma from '../utils/prisma';

describe('Auth API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    // Clean up test user if exists
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should not register a user with an existing email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('EMAIL_ALREADY_EXISTS');
    });

    it('should return 400 with invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 with short password', async () => {
      const res = await request(app)
        .post('/auth/register')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          email: 'another@example.com',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(testUser);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('Session Lifecycle', () => {
    let accessToken: string;
    let refreshTokenCookie: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(testUser);
      accessToken = res.body.data.accessToken;
      refreshTokenCookie = res.headers['set-cookie'][0];
    });

    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('should refresh access token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Cookie', [refreshTokenCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should list active sessions', async () => {
      const res = await request(app)
        .get('/auth/sessions')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should logout and revoke session', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify token is now invalid
      const resMe = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(resMe.status).toBe(401);
    });

    it('should detect and revoke session on refresh token reuse', async () => {
      // 1. Login to get tokens
      const loginRes = await request(app)
        .post('/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send(testUser);
      
      const firstAccessToken = loginRes.body.data.accessToken;
      const firstCookie = loginRes.headers['set-cookie'][0];

      // 2. Perform first refresh (consumes firstCookie)
      const refreshRes1 = await request(app)
        .post('/auth/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Cookie', [firstCookie]);
      
      expect(refreshRes1.status).toBe(200);
      const secondCookie = refreshRes1.headers['set-cookie'][0];

      // 3. Attempt to reuse firstCookie
      const reuseRes = await request(app)
        .post('/auth/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Cookie', [firstCookie]);
      
      expect(reuseRes.status).toBe(401);
      expect(reuseRes.body.error).toBe('REFRESH_TOKEN_REUSE_DETECTED');

      // 4. Verify the session is now revoked (even secondCookie should fail)
      const refreshRes2 = await request(app)
        .post('/auth/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Cookie', [secondCookie]);
      expect(refreshRes2.status).toBe(401);
      expect(refreshRes2.body.error).toBe('SESSION_REVOKED');
      
      const meRes = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${firstAccessToken}`);
      expect(meRes.status).toBe(401);
    });

    it('should reject state-changing requests without CSRF headers', async () => {
      const res = await request(app)
        .post('/auth/logout')
        // Missing X-Requested-With
        .set('Authorization', `Bearer ${accessToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('CSRF');
    });
  });
});
