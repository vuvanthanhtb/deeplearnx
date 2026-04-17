import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { COURSES_PATH } from "@/modules/courses/shell/courses.route";
import styles from "./lesson.module.scss";
import ButtonComponent from "@/libs/components/ui/button";
import VideoPlayer from "./VideoPlayer";
import useLesson from "./useLesson";
import BaseDrawerComponent from "@/libs/components/ui/base-drawer";
import BaseFormComponent from "@/libs/components/ui/base-form";
import { lessonConfig } from "./lesson.config";
import { lessonValidation } from "./lesson.validation";
import clsx from "clsx";

const LessonListPage = () => {
  const navigate = useNavigate();
  const {
    isAdmin,
    courseSlug,
    course,
    courseLessons,
    activeLesson,
    setActiveLesson,
    drawerOpen,
    setDrawerOpen,
    mode,
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
  } = useLesson();

  return (
    <div className={styles.page}>
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
          <div className={styles.headerActions}>
            <ButtonComponent
              type="button"
              title="Tải template"
              action="template"
              onClick={handleDownloadTemplate}
              style={{
                background: "#2d2f31",
                color: "#9ea3a8",
                border: "1px solid #3e4143",
                fontSize: 13,
              }}
            />
            <ButtonComponent
              type="button"
              title="Nhập Excel"
              action="import"
              onClick={handleImportClick}
              style={{
                background: "#1a3a2a",
                color: "#34a853",
                border: "1px solid #34a853",
                fontSize: 13,
              }}
            />
            <input
              ref={importInputRef}
              type="file"
              accept=".xlsx"
              style={{ display: "none" }}
              onChange={handleImportFile}
            />
            <ButtonComponent
              type="button"
              title="Tạo bài học"
              action="create"
              onClick={openCreate}
            />
          </div>
        )}
      </div>
      <div className={styles.body}>
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
                  className={clsx(styles.lessonItem, {
                    [styles.active]: activeLesson?.id === lesson.id,
                  })}
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
      <BaseDrawerComponent
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={mode}
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
