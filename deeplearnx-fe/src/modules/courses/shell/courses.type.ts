export interface CourseResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface CourseRequest {
  name: string;
  slug: string;
  description: string;
}

export interface CourseQuery {
  name?: string;
  page?: number;
  size?: number;
}

export interface CoursePage {
  content: CourseResponse[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
