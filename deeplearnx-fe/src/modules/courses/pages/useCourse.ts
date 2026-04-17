import { useRef, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { courseInitialValues } from "./course.config";
import {
  courseSearchInitialValues,
  parsePayloadSearch,
} from "./course-search.config";
import { SUPERADMIN, ADMIN } from "@/libs/constants/roles.constant";
import { LESSONS_PATH } from "@/modules/lessons/shell/lessons.route";
import { buildCourseTableConfig } from "./course-table.config";
import {
  BTN_DELETE,
  BTN_EDIT,
  BTN_LESSONS,
} from "@/libs/constants/button.constant";

const useCourse = () => {
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
    const id = String(row.id);
    if (key === BTN_LESSONS) {
      navigate(LESSONS_PATH.of(String(row.slug ?? id)));
      return;
    }
    if (key === BTN_EDIT) {
      setMode("update");
      setSelectedId(id);
      setFormValues({
        name: String(row.name ?? ""),
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
    dispatch(exportCourses(parsePayloadSearch(searchValues, true)));
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

  const handleFormChange = (values: Record<string, unknown>) => {
    setFormValues(values);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      name: String(data.name ?? ""),
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

  return {
    formValues,
    tableConfig,
    isAdmin,
    handleDownloadTemplate,
    handleImportClick,
    importInputRef,
    handleImportFile,
    openCreate,
    searchValues,
    setSearchValues,
    handleRefresh,
    handleSearch,
    handleExport,
    handleCellAction,
    handlePageChange,
    setDrawerOpen,
    drawerOpen,
    mode: mode === "create" ? "Tạo khóa học mới" : "Cập nhật khóa học",
    handleFormChange,
    handleSave,
  };
};

export default useCourse;
