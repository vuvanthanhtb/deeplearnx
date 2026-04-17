import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { useConfirm } from "@/libs/components/ui/confirm-dialog";
import {
  getLessonsByCourseSlug,
  createLesson,
  updateLesson,
  deleteLesson,
  importLessons,
  downloadLessonImportTemplate,
} from "../shell/lessons.slice";
import type { LessonResponse } from "../shell/lessons.type";
import { lessonInitialValues } from "./lesson.config";
import { ADMIN, SUPERADMIN } from "@/libs/constants/roles.constant";

const useLesson = () => {
  const { courseSlug = "" } = useParams<{ courseSlug: string }>();
  const dispatch = useAppDispatch();

  const lessons = useAppSelector((state) => state.lessons.lessons);
  const courses = useAppSelector((state) => state.courses.courseTable.content);
  const isAdmin = useAppSelector((state) =>
    [SUPERADMIN, ADMIN].some((r) => state.auth.roles.includes(r)),
  );
  const confirm = useConfirm();

  const importInputRef = useRef<HTMLInputElement>(null);

  const [activeLesson, setActiveLesson] = useState<LessonResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selected, setSelected] = useState<LessonResponse | null>(null);
  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(lessonInitialValues);

  useEffect(() => {
    document.title = "Bài học";
  }, []);

  useEffect(() => {
    if (courseSlug) dispatch(getLessonsByCourseSlug(courseSlug));
  }, [dispatch, courseSlug]);

  const course = useMemo(
    () => courses.find((c) => c.slug === courseSlug),
    [courses, courseSlug],
  );

  const courseLessons = useMemo(
    () => [...lessons].sort((a, b) => a.position - b.position),
    [lessons],
  );

  useEffect(() => {
    if (courseLessons.length > 0 && !activeLesson) {
      setActiveLesson(courseLessons[0]);
    }
  }, [courseLessons, activeLesson]);

  const handleImportClick = () => importInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(importLessons({ file, courseSlug }));
    e.target.value = "";
  };

  const handleDownloadTemplate = () => {
    dispatch(downloadLessonImportTemplate());
  };

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setFormValues(lessonInitialValues);
    setDrawerOpen(true);
  };

  const openUpdate = (lesson: LessonResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setMode("update");
    setSelected(lesson);
    setFormValues({
      title: lesson.title,
      position: lesson.position,
      slug: lesson.slug,
      videoUrl: lesson.videoUrl,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (lesson: LessonResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirm(
      `Bạn có chắc muốn xóa bài học "${lesson.title}"?`,
      { title: "Xóa bài học", confirmText: "Xóa", danger: true },
    );
    if (!ok) return;
    if (activeLesson?.id === lesson.id) setActiveLesson(null);
    dispatch(deleteLesson({ id: lesson.id, courseSlug }));
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      title: String(data.title ?? ""),
      videoUrl: String(data.videoUrl ?? ""),
      position: Number(data.position) || 1,
      slug: String(data.slug ?? ""),
      courseSlug,
    };
    let result;
    if (mode === "create") {
      result = await dispatch(createLesson(payload));
      if (createLesson.fulfilled.match(result)) setDrawerOpen(false);
    } else if (selected) {
      result = await dispatch(updateLesson({ id: selected.id, data: payload }));
      if (updateLesson.fulfilled.match(result)) setDrawerOpen(false);
    }
  };

  return {
    courseSlug,
    isAdmin,
    course,
    courseLessons,
    activeLesson,
    setActiveLesson,
    drawerOpen,
    setDrawerOpen,
    mode: mode === "create" ? "Thêm bài học mới" : "Cập nhật bài học",
    formValues,
    setFormValues,
    handleDownloadTemplate,
    handleImportClick,
    importInputRef,
    handleImportFile,
    openCreate,
    openUpdate,
    handleDelete,
    handleSave,
  };
};

export default useLesson;
