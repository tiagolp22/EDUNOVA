describe('Enrollment Endpoints', () => {
    let studentToken, courseId;
  
    beforeAll(async () => {
      studentToken = await getAuthToken('student');
      // Create test course
      const course = await createTestCourse();
      courseId = course.id;
    });
  
    describe('POST /api/enrollments', () => {
      it('should enroll student in course', async () => {
        const res = await request
          .post('/api/enrollments')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: courseId });
  
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('id');
      });
  
      it('should prevent duplicate enrollment', async () => {
        const res = await request
          .post('/api/enrollments')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: courseId });
  
        expect(res.status).toBe(409);
      });
    });
  });