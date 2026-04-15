import type { AxiosResponse } from "axios";

import type { ResponseBase } from "@/libs/interceptor/types";
import http from "@/libs/interceptor";

import type { LessonRequest, LessonResponse } from "./lessons.type";
import LESSONS_ENDPOINT from "./lessons.endpoint";

interface ILessonsRepository {
  getLessonsByCourseSlug(
    courseSlug: string,
  ): Promise<AxiosResponse<ResponseBase<LessonResponse[]>>>;
  createLesson(
    data: LessonRequest,
  ): Promise<AxiosResponse<ResponseBase<LessonResponse>>>;
  updateLesson(
    id: number,
    data: LessonRequest,
  ): Promise<AxiosResponse<ResponseBase<LessonResponse>>>;
  deleteLesson(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<LessonResponse>>>;
}

class LessonsRepository implements ILessonsRepository {
  private static instance: LessonsRepository;

  private constructor() {}

  static getInstance(): LessonsRepository {
    if (!LessonsRepository.instance) {
      LessonsRepository.instance = new LessonsRepository();
    }
    return LessonsRepository.instance;
  }

  getLessonsByCourseSlug(courseSlug: string) {
    return http.call<LessonResponse[]>({
      url: LESSONS_ENDPOINT.LESSONS_BY_COURSE_SLUG.replace(
        "{courseSlug}",
        courseSlug,
      ),
      method: "GET",
    });
  }

  createLesson(data: LessonRequest) {
    return http.call<LessonResponse>({
      url: LESSONS_ENDPOINT.CREATE_LESSON,
      method: "POST",
      data,
    });
  }

  updateLesson(id: number, data: LessonRequest) {
    return http.call<LessonResponse>({
      url: `${LESSONS_ENDPOINT.UPDATE_LESSON}/${id}`,
      method: "PUT",
      data,
    });
  }

  deleteLesson(id: number) {
    return http.call<LessonResponse>({
      url: `${LESSONS_ENDPOINT.DELETE_LESSON}/${id}`,
      method: "DELETE",
    });
  }
}

export const lessonsService: ILessonsRepository =
  LessonsRepository.getInstance();
