import { useRef, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { useConfirm } from "@/libs/components/ui/confirm-dialog";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  exportCourses,
  importCourses,
  downloadCourseImportTemplate,
} from "../shell/courses.slice";
import BaseDrawerComponent from "@/libs/components/ui/base-drawer";
import BaseFormComponent from "@/libs/components/ui/base-form";
import BaseTableComponent from "@/libs/components/ui/base-table";
import ButtonComponent from "@/libs/components/ui/button";
import { courseConfig, courseInitialValues } from "./course.config";
import { courseSchema } from "./course.validation";
import {
  buildCourseSearchConfig,
  courseSearchInitialValues,
  parsePayloadSearch,
} from "./course-search.config";
import { SUPERADMIN, ADMIN } from "@/libs/constants/roles.constant";
import { LESSONS_PATH } from "@/modules/lessons/shell/lessons.route";
import styles from "./course.module.scss";
import { buildCourseTableConfig } from "./course-table.config";
import {
  BTN_CLOSE,
  BTN_CREATE,
  BTN_DELETE,
  BTN_EDIT,
  BTN_LESSONS,
  BTN_REFRESH,
  BTN_SAVE,
  BTN_SEARCH,
} from "@/libs/constants/button.constant";

const CourseListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.courses.query);
  const roles = useAppSelector((state) => state.auth.roles);
  const isAdmin = [SUPERADMIN, ADMIN].some((r) => roles.includes(r));
  const confirm = useConfirm();

  useEffect(() => {
    document.title = "Khóa học";
  }, []);

  const importInputRef = useRef<HTMLInputElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(courseInitialValues);
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>(
    courseSearchInitialValues,
  );

  const openCreate = () => {
    setMode("create");
    setSelectedId(null);
    setFormValues(courseInitialValues);
    setDrawerOpen(true);
  };

  const handleCellAction = async (
    row: Record<string, unknown>,
    key?: string,
  ) => {
    const id = Number(row.id);
    if (key === BTN_LESSONS) {
      navigate(LESSONS_PATH.of(String(row.slug ?? id)));
      return;
    }
    if (key === BTN_EDIT) {
      setMode("update");
      setSelectedId(id);
      setFormValues({
        name: String(row.name ?? ""),
        slug: String(row.slug ?? ""),
        description: String(row.description ?? ""),
      });
      setDrawerOpen(true);
      return;
    }
    if (key === BTN_DELETE) {
      const ok = await confirm(`Bạn có chắc muốn xóa khóa học "${row.name}"?`, {
        title: "Xóa khóa học",
        confirmText: "Xóa",
        danger: true,
      });
      if (!ok) return;
      dispatch(deleteCourse(id));
    }
  };

  const handleSearch = (data: Record<string, unknown>) => {
    dispatch(getCourses(parsePayloadSearch(data)));
    setSearchValues(data);
  };

  const handleRefresh = () => {
    dispatch(getCourses(parsePayloadSearch(courseSearchInitialValues)));
    setSearchValues(courseSearchInitialValues);
  };

  const handleExport = () => {
    dispatch(exportCourses(parsePayloadSearch(searchValues)));
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(importCourses(file));
    e.target.value = "";
  };

  const handleDownloadTemplate = () => {
    dispatch(downloadCourseImportTemplate());
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(getCourses({ ...query, page }));
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      name: String(data.name ?? ""),
      slug: String(data.slug ?? ""),
      description: String(data.description ?? ""),
    };
    let result;
    if (mode === "create") {
      result = await dispatch(createCourse(payload));
      if (createCourse.fulfilled.match(result)) setDrawerOpen(false);
    } else if (selectedId !== null) {
      result = await dispatch(updateCourse({ id: selectedId, data: payload }));
      if (updateCourse.fulfilled.match(result)) setDrawerOpen(false);
    }
  };

  const tableConfig = useMemo(() => buildCourseTableConfig(isAdmin), [isAdmin]);

  return (
    <div className={styles.wrapper}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SchoolIcon sx={{ color: "#1a73e8", fontSize: 28 }} />
          <span className={styles.title}>Khóa học</span>
        </div>
        <div className={styles.headerActions}>
          {isAdmin && (
            <>
              <ButtonComponent
                type="button"
                title="Tải template"
                action="template"
                onClick={handleDownloadTemplate}
                style={{
                  background: "#f1f3f4",
                  color: "#3c4043",
                  border: "1px solid #dadce0",
                  fontSize: 13,
                }}
              />
              <ButtonComponent
                type="button"
                title="Nhập Excel"
                action="import"
                onClick={handleImportClick}
                style={{
                  background: "#e6f4ea",
                  color: "#1e8e3e",
                  border: "1px solid #1e8e3e",
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
            </>
          )}
          <ButtonComponent
            type="button"
            title="Xuất Excel"
            action="export"
            onClick={handleExport}
            style={{
              background: "#e8f0fe",
              color: "#1a73e8",
              border: "1px solid #1a73e8",
              fontSize: 13,
            }}
          />
          {isAdmin && (
            <ButtonComponent
              type="button"
              title="+ Tạo khóa học"
              action={BTN_CREATE}
              onClick={openCreate}
            />
          )}
        </div>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchBar}>
        <BaseFormComponent
          formConfig={buildCourseSearchConfig(isAdmin)}
          values={searchValues}
          onChange={setSearchValues}
          handlers={{
            [BTN_REFRESH]: handleRefresh,
            [BTN_SEARCH]: handleSearch,
          }}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrapper}>
        <BaseTableComponent
          tableConfig={tableConfig}
          reducer="courses"
          state="courseTable"
          handleCellAction={handleCellAction}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* ── Drawer ── */}
      {isAdmin && (
        <BaseDrawerComponent
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={mode === "create" ? "Tạo khóa học mới" : "Cập nhật khóa học"}
        >
          <BaseFormComponent
            formConfig={courseConfig}
            validationSchema={courseSchema}
            values={formValues}
            onChange={setFormValues}
            handlers={{
              [BTN_SAVE]: handleSave,
              [BTN_CLOSE]: () => setDrawerOpen(false),
            }}
          />
        </BaseDrawerComponent>
      )}
    </div>
  );
};

export default CourseListPage;
