import type { AxiosResponse } from "axios";

import type { ResponseBase } from "@/libs/interceptor/types";
import http from "@/libs/interceptor";

import type { CourseQuery, CoursePage, CourseRequest, CourseResponse } from "./courses.type";
import COURSES_ENDPOINT from "./courses.endpoint";

interface ICoursesRepository {
  getCourses(params?: CourseQuery): Promise<AxiosResponse<ResponseBase<CoursePage>>>;
  createCourse(
    data: CourseRequest,
  ): Promise<AxiosResponse<ResponseBase<CourseResponse>>>;
  updateCourse(
    id: number,
    data: CourseRequest,
  ): Promise<AxiosResponse<ResponseBase<CourseResponse>>>;
  deleteCourse(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<CourseResponse>>>;
}

class CoursesRepository implements ICoursesRepository {
  private static instance: CoursesRepository;

  private constructor() {}

  static getInstance(): CoursesRepository {
    if (!CoursesRepository.instance) {
      CoursesRepository.instance = new CoursesRepository();
    }
    return CoursesRepository.instance;
  }

  getCourses(params?: CourseQuery) {
    return http.call<CoursePage>({
      url: COURSES_ENDPOINT.COURSES,
      method: "GET",
      params,
    });
  }

  createCourse(data: CourseRequest) {
    return http.call<CourseResponse>({
      url: COURSES_ENDPOINT.COURSES,
      method: "POST",
      data,
    });
  }

  updateCourse(id: number, data: CourseRequest) {
    return http.call<CourseResponse>({
      url: `${COURSES_ENDPOINT.COURSES}/${id}`,
      method: "PUT",
      data,
    });
  }

  deleteCourse(id: number) {
    return http.call<CourseResponse>({
      url: `${COURSES_ENDPOINT.COURSES}/${id}`,
      method: "DELETE",
    });
  }
}

export const coursesService: ICoursesRepository =
  CoursesRepository.getInstance();
