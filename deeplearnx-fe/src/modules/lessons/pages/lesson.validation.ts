import * as yup from "yup";

export const lessonValidation = yup.object({
  title: yup
    .string()
    .trim()
    .required("Tên bài học là bắt buộc")
    .max(200, "Tên bài học không được vượt quá 200 ký tự"),
  position: yup.number().min(1, "Vị trí phải lớn hơn 0").optional(),
  slug: yup
    .string()
    .trim()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ gồm chữ thường, số và dấu gạch ngang",
    )
    .optional(),
  videoUrl: yup.string().url("URL video không hợp lệ").optional(),
});
