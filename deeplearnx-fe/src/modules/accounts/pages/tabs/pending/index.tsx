import BaseFormComponent from "@/libs/components/ui/base-form";
import BaseTableComponent from "@/libs/components/ui/base-table";
import ButtonComponent from "@/libs/components/ui/button";
import { colorCell } from "../../account-table.config";
import styles from "../../account.module.scss";
import { useAccountPending } from "./useAccountPending";
import { showButtons } from "./account-pending.config";
import {
  BTN_APPROVE,
  BTN_REJECT,
  BTN_SEARCH,
  BTN_REFRESH,
} from "@/libs/constants/button.constant";
import { APPROVING } from "@/libs/constants/status.constant";

const AccountPendingTab = () => {
  const {
    tableConfig,
    searchValues,
    setSearchValues,
    searchOptions,
    accountSearchConfig,
    selectedIds,
    setSelectedIds,
    handleCellAction,
    handleSearch,
    handleRefresh,
    handlePageChange,
    handleBulkApprove,
    handleBulkReject,
  } = useAccountPending();

  return (
    <>
      <div className={styles.searchBar}>
        <BaseFormComponent
          formConfig={accountSearchConfig}
          values={searchValues}
          onChange={setSearchValues}
          handlers={{
            [BTN_SEARCH]: handleSearch,
            [BTN_REFRESH]: handleRefresh,
          }}
          options={searchOptions}
        />
      </div>

      {selectedIds.length > 0 && (
        <div className={styles.bulkToolbar}>
          <span className={styles.bulkCount}>
            Đã chọn {selectedIds.length} tài khoản
          </span>
          <ButtonComponent
            type="button"
            title="Phê duyệt"
            action={BTN_APPROVE}
            onClick={handleBulkApprove}
            style={{
              background: "#e8f0fe",
              color: "#1a73e8",
              border: "1px solid #1a73e8",
            }}
          />
          <ButtonComponent
            type="button"
            title="Từ chối"
            action={BTN_REJECT}
            onClick={handleBulkReject}
            style={{
              background: "#fce8e6",
              color: "#d93025",
              border: "1px solid #d93025",
            }}
          />
        </div>
      )}

      <div className={styles.tableWrapper}>
        <BaseTableComponent
          tableConfig={tableConfig}
          reducer="accounts"
          state="pendingTable"
          handleCellAction={handleCellAction}
          handlePageChange={handlePageChange}
          showButton={showButtons}
          colorCell={colorCell}
          onSelectionChange={setSelectedIds}
          isRowSelectable={(row) => row.status === APPROVING}
        />
      </div>
    </>
  );
};

export default AccountPendingTab;
