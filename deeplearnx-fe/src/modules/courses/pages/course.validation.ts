import * as yup from "yup";

export const courseSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Tên khóa học là bắt buộc")
    .max(200, "Tên khóa học không được vượt quá 200 ký tự"),
  description: yup.string().optional(),
});
