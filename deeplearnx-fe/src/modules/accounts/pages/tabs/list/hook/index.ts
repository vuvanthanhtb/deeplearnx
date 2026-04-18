import { useEffect, useMemo, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { useConfirm } from "@/libs/components/ui/confirm-dialog";
import { PAGE_CURRENT, PAGE_SIZE } from "@/libs/constants/table.constant";
import {
  defaultSelectOption,
  roleOptions,
  roleSuperAdminOption,
  statusUserOptions,
} from "@/libs/constants/options.constant";
import { SUPERADMIN, ADMIN } from "@/libs/constants/roles.constant";
import { buildAccountTableConfig, getAccountUpdateConfig } from "../config";
import {
  createAccount,
  deleteAccount,
  downloadAccountImportTemplate,
  exportAccounts,
  getAccounts,
  importAccounts,
  lockAccount,
  unlockAccount,
  updateAccount,
} from "../../../../shell/account.slice";
import { accountInitialValues } from "../config";
import {
  BTN_DELETE,
  BTN_EDIT,
  BTN_LOCK,
  BTN_UNLOCK,
} from "@/libs/constants/button.constant";
import { AccountSearchConfig } from "../../../config";

export const useAccountList = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.auth.roles);
  const currentUsername = useAppSelector((state) => state.auth.user?.username);
  const confirm = useConfirm();

  const importInputRef = useRef<HTMLInputElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [isEditingSelf, setIsEditingSelf] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(accountInitialValues);
  const [searchValues, setSearchValues] = useState<Record<string, unknown>>(
    AccountSearchConfig.accountSearchInitialValues,
  );

  useEffect(() => {
    dispatch(
      getAccounts(
        AccountSearchConfig.buildQuery(
          AccountSearchConfig.accountSearchInitialValues,
        ),
      ),
    );
  }, [dispatch]);

  const openCreate = () => {
    setMode("create");
    setSelectedId(null);
    setFormValues(accountInitialValues);
    setDrawerOpen(true);
  };

  const handleCellAction = async (
    row: Record<string, unknown>,
    key?: string,
  ) => {
    const id = String(row.id);
    if (key === BTN_EDIT) {
      setMode("update");
      setSelectedId(id);
      const rowRoles = Array.isArray(row.roles) ? row.roles : [];
      setIsEditingSelf(String(row.username) === currentUsername);
      setFormValues({
        username: String(row.username ?? ""),
        email: String(row.email ?? ""),
        fullName: String(row.fullName ?? ""),
        role: roleOptions.filter((option) => rowRoles.includes(option.value)),
        status: statusUserOptions.find((option) => option.value === row.status),
      });
      setDrawerOpen(true);
      return;
    }
    if (key === BTN_DELETE) {
      const ok = await confirm(
        `Bạn có chắc muốn xóa tài khoản "${row.username}"?`,
        { title: "Xóa tài khoản", confirmText: "Xóa", danger: true },
      );
      if (!ok) return;
      dispatch(deleteAccount(id)).then(() =>
        dispatch(getAccounts(AccountSearchConfig.buildQuery(searchValues))),
      );
    } else if (key === BTN_LOCK) {
      const ok = await confirm(
        `Bạn có chắc muốn khóa tài khoản "${row.username}"?`,
        { title: "Khóa tài khoản", confirmText: "Khóa", danger: true },
      );
      if (!ok) return;
      dispatch(lockAccount(id)).then(() =>
        dispatch(getAccounts(AccountSearchConfig.buildQuery(searchValues))),
      );
    } else if (key === BTN_UNLOCK) {
      const ok = await confirm(
        `Bạn có chắc muốn mở khóa tài khoản "${row.username}"?`,
        { title: "Mở khóa tài khoản", confirmText: "Mở khóa" },
      );
      if (!ok) return;
      dispatch(unlockAccount(id)).then(() =>
        dispatch(getAccounts(AccountSearchConfig.buildQuery(searchValues))),
      );
    }
  };

  const handleSearch = (data: Record<string, unknown>) => {
    const query = { ...data, page: PAGE_CURRENT, size: PAGE_SIZE };
    dispatch(getAccounts(AccountSearchConfig.buildQuery(query)));
    setSearchValues(query);
  };

  const handleExport = async (data: Record<string, unknown>) => {
    await dispatch(exportAccounts(AccountSearchConfig.buildQuery(data, true)));
    return false;
  };

  const handleRefresh = () => {
    dispatch(
      getAccounts(
        AccountSearchConfig.buildQuery(
          AccountSearchConfig.accountSearchInitialValues,
        ),
      ),
    );
    setSearchValues(AccountSearchConfig.accountSearchInitialValues);
    return false;
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(importAccounts(file));
    e.target.value = "";
  };

  const handleDownloadTemplate = () => {
    dispatch(downloadAccountImportTemplate());
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(
      getAccounts(AccountSearchConfig.buildQuery({ ...searchValues, page })),
    );
    setSearchValues((prev) => ({ ...prev, page }));
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    let result;
    const toRoles = (val: unknown): string[] => {
      if (Array.isArray(val))
        return val.map((o: any) => o.value).filter(Boolean);
      if (val && typeof val === "object" && "value" in (val as object))
        return [(val as any).value];
      return [];
    };

    if (mode === "create") {
      const payload = {
        fullName: String(data.fullName ?? ""),
        username: String(data.username ?? ""),
        email: String(data.email ?? ""),
        password: String(data.password ?? ""),
        confirmPassword: String(data.confirmPassword ?? ""),
        roles: toRoles(data.role),
      };
      result = await dispatch(createAccount(payload));
      if (createAccount.fulfilled.match(result)) setDrawerOpen(false);
    } else if (selectedId !== null) {
      const payload = {
        fullName: String(data.fullName ?? ""),
        email: String(data.email ?? ""),
        roles: toRoles(data.role),
      };
      result = await dispatch(updateAccount({ id: selectedId, data: payload }));
      if (updateAccount.fulfilled.match(result)) setDrawerOpen(false);
    }
    await dispatch(getAccounts(AccountSearchConfig.buildQuery(searchValues)));
  };

  const tableConfig = useMemo(() => buildAccountTableConfig(roles), [roles]);
  const accountUpdateConfig = useMemo(
    () => getAccountUpdateConfig(isEditingSelf),
    [isEditingSelf],
  );

  const isAdmin = [SUPERADMIN, ADMIN].some((r) => roles.includes(r));

  const accountSearchConfig = useMemo(
    () => AccountSearchConfig.buildAccountSearchConfig(isAdmin),
    [isAdmin],
  );

  const searchOptions = {
    roleOptions: [defaultSelectOption, ...roleOptions, roleSuperAdminOption],
    statusOptions: [defaultSelectOption, ...statusUserOptions],
  };

  const drawerRoleOptions = useMemo(() => {
    if (roles.includes(SUPERADMIN)) {
      // SUPERADMIN: chọn tất cả trừ SUPERADMIN
      return roleOptions;
    }
    // ADMIN: chọn tất cả trừ SUPERADMIN và ADMIN
    return roleOptions.filter((opt) => opt.value !== ADMIN);
  }, [roles]);

  const drawerOptions = { statusUserOptions, roleOptions: drawerRoleOptions };

  return {
    roles,
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
    importInputRef,
    openCreate,
    handleCellAction,
    handleSearch,
    handleExport,
    handleRefresh,
    handlePageChange,
    handleSubmit,
    handleImportClick,
    handleImportFile,
    handleDownloadTemplate,
  };
};
