import * as yup from "yup";

export const scheduleSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Tiêu đề là bắt buộc")
    .max(200, "Tiêu đề tối đa 200 ký tự"),
  scheduledAt: yup
    .string()
    .required("Thời gian là bắt buộc"),
  content: yup.string().optional(),
});
