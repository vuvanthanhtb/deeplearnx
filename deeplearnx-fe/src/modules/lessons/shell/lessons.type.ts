export interface LessonResponse {
  id: string;
  title: string;
  courseId: string;
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
