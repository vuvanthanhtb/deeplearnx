import type { AxiosResponse } from "axios";

import type { ResponseBase } from "@/libs/interceptor/types";

import type { ScheduleRequest, ScheduleResponse } from "./schedule.type";
import http from "@/libs/interceptor";
import SCHEDULE_ENDPOINT from "./schedule.endpoint";

interface IScheduleRepository {
  getSchedules(): Promise<AxiosResponse<ResponseBase<ScheduleResponse>>>;
  createSchedule(
    data: ScheduleRequest,
  ): Promise<AxiosResponse<ResponseBase<ScheduleResponse>>>;
  updateSchedule(
    id: string,
    data: ScheduleRequest,
  ): Promise<AxiosResponse<ResponseBase<ScheduleResponse>>>;
  deleteSchedule(
    id: string,
  ): Promise<AxiosResponse<ResponseBase<ScheduleResponse>>>;
}

class ScheduleRepository implements IScheduleRepository {
  private static instance: ScheduleRepository;

  private constructor() {}

  static getInstance(): ScheduleRepository {
    if (!ScheduleRepository.instance) {
      ScheduleRepository.instance = new ScheduleRepository();
    }
    return ScheduleRepository.instance;
  }

  getSchedules() {
    return http.call<ScheduleResponse>({
      url: SCHEDULE_ENDPOINT.SCHEDULES,
      method: "GET",
    });
  }

  createSchedule(data: ScheduleRequest) {
    return http.call<ScheduleResponse>({
      url: SCHEDULE_ENDPOINT.SCHEDULES,
      method: "POST",
      data,
    });
  }

  updateSchedule(id: string, data: ScheduleRequest) {
    return http.call<ScheduleResponse>({
      url: `${SCHEDULE_ENDPOINT.SCHEDULES}/${id}`,
      method: "PUT",
      data,
    });
  }

  deleteSchedule(id: string) {
    return http.call<ScheduleResponse>({
      url: `${SCHEDULE_ENDPOINT.SCHEDULES}/${id}`,
      method: "DELETE",
    });
  }
}

export const scheduleService: IScheduleRepository =
  ScheduleRepository.getInstance();
