export interface LessonResponse {
  id: number;
  title: string;
  courseId: number;
  videoUrl: string;
  position: number;
  slug: string;
}

export interface LessonRequest {
  title: string;
  courseSlug: string;
  videoUrl: string;
  position: number;
}

export interface LessonImportResult {
  total: number;
  success: number;
  failed: number;
}
