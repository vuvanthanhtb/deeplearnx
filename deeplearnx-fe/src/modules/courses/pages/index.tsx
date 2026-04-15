import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { useConfirm } from "@/libs/components/ui/confirm-dialog";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
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
  BTN_SAVE,
} from "@/libs/constants/button.constant";

const CourseListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.courses.query);
  const roles = useAppSelector((state) => state.auth.roles);
  const isAdmin = [SUPERADMIN, ADMIN].some((r) => roles.includes(r));
  const confirm = useConfirm();

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
    dispatch(getCourses(courseSearchInitialValues));
    setSearchValues(courseSearchInitialValues);
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            refresh: handleRefresh,
            submit: handleSearch,
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
