// permissionsConfig.js
module.exports = {
  /**
   * Defines permissions for each role within the platform.
   * 
   * - student: Basic user, able to view and access course materials and update progress.
   * - teacher: Content creator, with access to course and class management tools.
   * - admin: Superuser with full management permissions over users, courses, and privileges.
   */
  roles: {
      student: {
          permissions: [
              'view_courses',
              'access_course_material',
              'make_payments',
              'update_progress'
          ]
      },
      teacher: {
          permissions: [
              'create_courses',
              'update_courses',
              'manage_classes',
              'view_student_progress'
          ]
      },
      admin: {
          permissions: [
              'manage_all_courses',
              'manage_users',
              'manage_privileges'
          ]
      }
  }
};
