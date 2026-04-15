import BaseDrawerComponent from "@/libs/components/ui/base-drawer";
import BaseFormComponent from "@/libs/components/ui/base-form";
import BaseTableComponent from "@/libs/components/ui/base-table";
import ButtonComponent from "@/libs/components/ui/button";
import { colorCell } from "../../account-table.config";
import {
  accountConfig,
  showButtons,
} from "./account-list.config";
import { accountSchema, accountUpdateSchema } from "./account-list.validation";
import styles from "../../account.module.scss";
import { useAccountList } from "./useAccountList";
import {
  BTN_CLOSE,
  BTN_CREATE,
  BTN_EXPORT,
  BTN_REFRESH,
  BTN_SEARCH,
  BTN_SUBMIT,
} from "@/libs/constants/button.constant";

const AccountListTab = () => {
  const {
    drawerOpen,
    setDrawerOpen,
    mode,
    formValues,
    setFormValues,
    searchValues,
    setSearchValues,
    tableConfig,
    isAdmin,
    searchOptions,
    drawerOptions,
    accountSearchConfig,
    accountUpdateConfig,
    openCreate,
    handleCellAction,
    handleSearch,
    handleExport,
    handleRefresh,
    handlePageChange,
    handleSubmit,
  } = useAccountList();

  return (
    <>
      {isAdmin && (
        <div className={styles.tabToolbar}>
          <ButtonComponent
            type="button"
            title="+ Tạo tài khoản"
            action={BTN_CREATE}
            onClick={openCreate}
          />
        </div>
      )}

      <div className={styles.searchBar}>
        <BaseFormComponent
          formConfig={accountSearchConfig}
          values={searchValues}
          onChange={setSearchValues}
          handlers={{
            [BTN_SEARCH]: handleSearch,
            [BTN_EXPORT]: handleExport,
            [BTN_REFRESH]: handleRefresh,
          }}
          options={searchOptions}
        />
      </div>

      <div className={styles.tableWrapper}>
        <BaseTableComponent
          tableConfig={tableConfig}
          reducer="accounts"
          state="accountTable"
          handleCellAction={handleCellAction}
          handlePageChange={handlePageChange}
          showButton={showButtons}
          colorCell={colorCell}
        />
      </div>

      {isAdmin && (
        <BaseDrawerComponent
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={mode === "create" ? "Tạo tài khoản mới" : "Cập nhật tài khoản"}
        >
          <BaseFormComponent
            formConfig={mode === "create" ? accountConfig : accountUpdateConfig}
            validationSchema={
              mode === "create" ? accountSchema : accountUpdateSchema
            }
            options={drawerOptions}
            values={formValues}
            onChange={setFormValues}
            handlers={{
              [BTN_SUBMIT]: handleSubmit,
              [BTN_CLOSE]: () => setDrawerOpen(false),
            }}
          />
        </BaseDrawerComponent>
      )}
    </>
  );
};

export default AccountListTab;
