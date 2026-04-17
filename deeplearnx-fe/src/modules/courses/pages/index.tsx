import SchoolIcon from "@mui/icons-material/School";
import BaseDrawerComponent from "@/libs/components/ui/base-drawer";
import BaseFormComponent from "@/libs/components/ui/base-form";
import BaseTableComponent from "@/libs/components/ui/base-table";
import ButtonComponent from "@/libs/components/ui/button";
import { courseConfig } from "./course.config";
import { courseSchema } from "./course.validation";
import { buildCourseSearchConfig } from "./course-search.config";
import styles from "./course.module.scss";
import {
  BTN_CLOSE,
  BTN_CREATE,
  BTN_EXPORT,
  BTN_REFRESH,
  BTN_SAVE,
  BTN_SEARCH,
} from "@/libs/constants/button.constant";
import useCourse from "./useCourse";

const CourseListPage = () => {
  const {
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
    mode,
    handleFormChange,
    handleSave,
  } = useCourse();

  return (
    <div className={styles.wrapper}>
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
              <ButtonComponent
                type="button"
                title="Tạo khóa học"
                action={BTN_CREATE}
                onClick={openCreate}
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.searchBar}>
        <BaseFormComponent
          formConfig={buildCourseSearchConfig(isAdmin)}
          values={searchValues}
          onChange={setSearchValues}
          handlers={{
            [BTN_REFRESH]: handleRefresh,
            [BTN_SEARCH]: handleSearch,
            [BTN_EXPORT]: handleExport,
          }}
        />
      </div>

      <div className={styles.tableWrapper}>
        <BaseTableComponent
          tableConfig={tableConfig}
          reducer="courses"
          state="courseTable"
          handleCellAction={handleCellAction}
          handlePageChange={handlePageChange}
        />
      </div>
      {isAdmin && (
        <BaseDrawerComponent
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={mode}
        >
          <BaseFormComponent
            formConfig={courseConfig}
            validationSchema={courseSchema}
            values={formValues}
            onChange={handleFormChange}
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
