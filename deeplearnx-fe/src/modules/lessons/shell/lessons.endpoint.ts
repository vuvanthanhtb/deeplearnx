const LESSONS_ENDPOINT = {
  LESSONS_BY_COURSE_SLUG: "/api/courses/{courseSlug}/lessons",
  CREATE_LESSON: "/api/lessons",
  UPDATE_LESSON: "/api/lessons/{id}",
  DELETE_LESSON: "/api/lessons/{id}",
  LESSONS_IMPORT: "/api/lessons/import",
  LESSONS_IMPORT_TEMPLATE: "/api/lessons/import/template",
};

export default LESSONS_ENDPOINT;
