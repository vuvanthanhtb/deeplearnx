import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { useConfirm } from "@/libs/components/ui/confirm-dialog";
import { PAGE_CURRENT, PAGE_SIZE } from "@/libs/constants/table.constant";
import {
  defaultSelectOption,
  roleOptions,
  roleSuperAdminOption,
  statusUserApproveOptions,
} from "@/libs/constants/options.constant";
import { SUPERADMIN, ADMIN } from "@/libs/constants/roles.constant";
import { buildPendingTableConfig } from "./account-pending.config";
import {
  buildAccountSearchConfig,
  accountSearchInitialValues,
  buildQuery,
} from "../../account-search.config";
import {
  approveAccount,
  bulkApproveAccounts,
  bulkRejectAccounts,
  getAccounts,
  getPendingAccounts,
  rejectAccount,
} from "../../../shell/account.slice";
import { BTN_APPROVE, BTN_REJECT } from "@/libs/constants/button.constant";

export const useAccountPending = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.auth.roles);
  const confirm = useConfirm();

  const [searchValues, setSearchValues] = useState<Record<string, unknown>>(
    accountSearchInitialValues,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    dispatch(getPendingAccounts(buildQuery(accountSearchInitialValues)));
  }, [dispatch]);

  const handleCellAction = async (
    row: Record<string, unknown>,
    key?: string,
  ) => {
    const id = Number(row.id);
    if (key === BTN_APPROVE) {
      const ok = await confirm(
        `Bạn có chắc muốn phê duyệt tài khoản "${row.username}"?`,
        { title: "Phê duyệt tài khoản", confirmText: "Phê duyệt" },
      );
      if (!ok) return;
      dispatch(approveAccount(id)).then(() => {
        dispatch(getPendingAccounts(buildQuery(searchValues)));
        dispatch(getAccounts(buildQuery(accountSearchInitialValues)));
      });
    } else if (key === BTN_REJECT) {
      const ok = await confirm(
        `Bạn có chắc muốn từ chối tài khoản "${row.username}"?`,
        { title: "Từ chối tài khoản", confirmText: "Từ chối", danger: true },
      );
      if (!ok) return;
      dispatch(rejectAccount(id)).then(() => {
        dispatch(getPendingAccounts(buildQuery(searchValues)));
        dispatch(getAccounts(buildQuery(accountSearchInitialValues)));
      });
    }
  };

  const handleSearch = (data: Record<string, unknown>) => {
    const query = { ...data, page: PAGE_CURRENT, size: PAGE_SIZE };
    dispatch(getPendingAccounts(buildQuery(query)));
    setSearchValues(query);
  };

  const handleRefresh = () => {
    dispatch(getPendingAccounts(buildQuery(accountSearchInitialValues)));
    setSearchValues(accountSearchInitialValues);
    return false;
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(getPendingAccounts(buildQuery({ ...searchValues, page })));
    setSearchValues((prev) => ({ ...prev, page }));
  };

  const handleBulkApprove = async () => {
    if (!selectedIds.length) return;
    const ok = await confirm(
      `Bạn có chắc muốn phê duyệt ${selectedIds.length} tài khoản đã chọn?`,
      { title: "Phê duyệt hàng loạt", confirmText: "Phê duyệt" },
    );
    if (!ok) return;
    dispatch(bulkApproveAccounts(selectedIds)).then(() => {
      setSelectedIds([]);
      dispatch(getPendingAccounts(buildQuery(searchValues)));
      dispatch(getAccounts(buildQuery(accountSearchInitialValues)));
    });
  };

  const handleBulkReject = async () => {
    if (!selectedIds.length) return;
    const ok = await confirm(
      `Bạn có chắc muốn từ chối ${selectedIds.length} tài khoản đã chọn?`,
      { title: "Từ chối hàng loạt", confirmText: "Từ chối", danger: true },
    );
    if (!ok) return;
    dispatch(bulkRejectAccounts(selectedIds)).then(() => {
      setSelectedIds([]);
      dispatch(getPendingAccounts(buildQuery(searchValues)));
      dispatch(getAccounts(buildQuery(accountSearchInitialValues)));
    });
  };

  const tableConfig = useMemo(() => buildPendingTableConfig(roles), [roles]);

  const isAdmin = roles.includes(SUPERADMIN) || roles.includes(ADMIN);
  const accountSearchConfig = useMemo(
    () => buildAccountSearchConfig(isAdmin),
    [isAdmin],
  );

  const searchOptions = {
    roleOptions: [defaultSelectOption, ...roleOptions, roleSuperAdminOption],
    statusOptions: [defaultSelectOption, ...statusUserApproveOptions],
  };

  return {
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
  };
};
