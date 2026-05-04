import request from 'supertest';
import app from '../index';
import prisma from '../utils/prisma';

describe('Word API', () => {
  beforeAll(async () => {
    // Clean up DB before tests
    await prisma.word.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /words', () => {
    it('should create a new word with valid data', async () => {
      const res = await request(app).post('/words').send({
        germanWord: 'Katze',
        translation: 'Cat',
        article: 'die',
        wordType: 'Noun',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.germanWord).toBe('Katze');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 with invalid data (missing germanWord)', async () => {
      const res = await request(app).post('/words').send({
        translation: 'Cat',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 when trying to create a duplicate word', async () => {
      await request(app).post('/words').send({
        germanWord: 'Hund',
        translation: 'Dog',
      });

      const res = await request(app).post('/words').send({
        germanWord: 'Hund',
        translation: 'Another Dog',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('WORD_ALREADY_EXISTS');
    });
  });

  describe('GET /words', () => {
    it('should return all words', async () => {
      const res = await request(app).get('/words');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /words/:id', () => {
    it('should return a word by id', async () => {
      const allWords = await request(app).get('/words');
      const id = allWords.body.data[0].id;

      const res = await request(app).get(`/words/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(id);
    });
  });

  describe('PUT /words/:id', () => {
    it('should update a word correctly', async () => {
      const allWords = await request(app).get('/words');
      const id = allWords.body.data[0].id;

      const res = await request(app).put(`/words/${id}`).send({
        translation: 'Kitty',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.translation).toBe('Kitty');
    });
  });

  describe('DELETE /words/:id', () => {
    it('should delete a word correctly', async () => {
      const allWords = await request(app).get('/words');
      const id = allWords.body.data[0].id;

      const res = await request(app).delete(`/words/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get(`/words/${id}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
