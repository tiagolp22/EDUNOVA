describe('Course Endpoints', () => {
    let adminToken, teacherToken, studentToken;
    let courseId;
  
    beforeAll(async () => {
      // Setup test users and get tokens
      adminToken = await getAuthToken('admin');
      teacherToken = await getAuthToken('teacher');
      studentToken = await getAuthToken('student');
    });
  
    describe('POST /api/courses', () => {
      const courseData = {
        title: { en: 'Test Course', pt: 'Curso Teste' },
        description: { en: 'Description', pt: 'Descrição' },
        price: 99.99
      };
  
      it('should create course as admin', async () => {
        const res = await request
          .post('/api/courses')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(courseData);
  
        expect(res.status).toBe(201);
        courseId = res.body.data.id;
      });
  
      it('should prevent student from creating course', async () => {
        const res = await request
          .post('/api/courses')
          .set('Authorization', `Bearer ${studentToken}`)
          .send(courseData);
  
        expect(res.status).toBe(403);
      });
    });
  });