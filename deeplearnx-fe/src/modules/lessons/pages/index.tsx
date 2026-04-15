import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { useConfirm } from "@/libs/components/ui/confirm-dialog";
import {
  getLessonsByCourseSlug,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../shell/lessons.slice";
import type { LessonResponse } from "../shell/lessons.type";
import { COURSES_PATH } from "@/modules/courses/shell/courses.route";
import BaseDrawerComponent from "@/libs/components/ui/base-drawer";
import BaseFormComponent from "@/libs/components/ui/base-form";
import { lessonConfig, lessonInitialValues } from "./lesson.config";
import { lessonValidation } from "./lesson.validation";
import styles from "./lesson.module.scss";
import ButtonComponent from "@/libs/components/ui/button";
import VideoPlayer from "./VideoPlayer";
import { ADMIN, SUPERADMIN } from "@/libs/constants/roles.constant";

const LessonListPage = () => {
  const { courseSlug = "" } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const lessons = useAppSelector((state) => state.lessons.lessons);
  const courses = useAppSelector((state) => state.courses.courseTable.content);
  const isAdmin = useAppSelector((state) =>
    [SUPERADMIN, ADMIN].some((r) => state.auth.roles.includes(r)),
  );
  const confirm = useConfirm();

  const [activeLesson, setActiveLesson] = useState<LessonResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selected, setSelected] = useState<LessonResponse | null>(null);
  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(lessonInitialValues);

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

  // Auto-select first lesson
  useEffect(() => {
    if (courseLessons.length > 0 && !activeLesson) {
      setActiveLesson(courseLessons[0]);
    }
  }, [courseLessons]);

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

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Tooltip title="Quay lại" arrow>
            <IconButton
              size="small"
              onClick={() => navigate(COURSES_PATH.BASE)}
              sx={{ color: "#9ea3a8", "&:hover": { color: "#fff" } }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <MenuBookIcon sx={{ color: "#1a73e8", fontSize: 20 }} />
          <span className={styles.courseTitle}>
            {course?.name ?? courseSlug}
          </span>
        </div>

        {isAdmin && (
          <ButtonComponent
            type="button"
            title="+ Tạo bài học"
            action="create"
            onClick={openCreate}
          />
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* ── Video panel ── */}
        <div className={styles.videoPanel}>
          {activeLesson?.videoUrl ? (
            <div className={styles.videoWrapper}>
              <VideoPlayer url={activeLesson.videoUrl} />
            </div>
          ) : (
            <div className={styles.noVideo}>
              <PlayCircleOutlineIcon sx={{ fontSize: 64 }} />
              <p>
                {activeLesson
                  ? "Bài học này chưa có video."
                  : "Chọn một bài học để bắt đầu."}
              </p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Nội dung khóa học</h3>
            <p>{courseLessons.length} bài học</p>
          </div>

          {courseLessons.length === 0 ? (
            <div className={styles.empty}>
              <MenuBookIcon sx={{ fontSize: 48, color: "#3e4143" }} />
              <p>Chưa có bài học nào.</p>
            </div>
          ) : (
            <ul className={styles.lessonList}>
              {courseLessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`${styles.lessonItem} ${activeLesson?.id === lesson.id ? styles.active : ""}`}
                  onClick={() => setActiveLesson(lesson)}
                >
                  <span className={styles.lessonItemBadge}>
                    {lesson.position}
                  </span>
                  <div className={styles.lessonItemInfo}>
                    <p className={styles.lessonItemTitle}>{lesson.title}</p>
                  </div>
                  {isAdmin && (
                    <div className={styles.lessonItemActions}>
                      <Tooltip title="Sửa" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => openUpdate(lesson, e)}
                          sx={{
                            color: "#9ea3a8",
                            "&:hover": { color: "#1a73e8" },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(lesson, e)}
                          sx={{
                            color: "#9ea3a8",
                            "&:hover": { color: "#d93025" },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Drawer ── */}
      <BaseDrawerComponent
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={mode === "create" ? "Thêm bài học mới" : "Cập nhật bài học"}
      >
        <BaseFormComponent
          formConfig={lessonConfig}
          validationSchema={lessonValidation}
          values={formValues}
          onChange={setFormValues}
          handlers={{
            close: () => setDrawerOpen(false),
            save: handleSave,
          }}
        />
      </BaseDrawerComponent>
    </div>
  );
};

export default LessonListPage;
