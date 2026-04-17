import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Pagination, Stack } from "@mui/material";
import { useSelector } from "react-redux";

import styles from "./table.module.scss";

import "bootstrap/dist/css/bootstrap.min.css";
import type { RootState } from "@/shell/redux/store";
import type { ButtonProps } from "@/libs/types/button.type";
import ButtonComponent from "../button";
import type { BaseTableColumn } from "@/libs/types/table.type";
import { BUTTON, CHECKBOX, STRING } from "@/libs/constants/form.constant";
import { NUMERICAL_ORDER } from "@/libs/constants/table.constant";
import type { ProfileUser } from "@/modules/auth/shell/auth.type";

type TableRow = Record<string, unknown>;

interface BaseTableProps {
  tableConfig: BaseTableColumn[];
  btnGroup?: ButtonProps[];
  reducer: keyof RootState;
  state: string;
  handleCellAction?: (row: TableRow, key?: string) => void;
  handlePageChange?: (_: React.ChangeEvent<unknown>, page: number) => void;
  handlers?: Record<string, (e?: React.MouseEvent) => void>;
  showButton?: (
    refShow: string[],
    action: string,
    row: TableRow,
    user?: ProfileUser | null,
  ) => boolean;
  colorCell?: (refColor: string[], row: TableRow) => string;
  btnGroupClassName?: string;
  onSelectionChange?: (ids: string[]) => void;
  isRowSelectable?: (row: TableRow) => boolean;
}

export const BaseTableComponent: React.FC<BaseTableProps> = (props) => {
  const {
    tableConfig,
    reducer,
    state,
    handleCellAction,
    btnGroup,
    handlers,
    btnGroupClassName,
    handlePageChange,
    showButton,
    colorCell,
    onSelectionChange,
    isRowSelectable,
  } = props;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const user = useSelector((state: RootState) => state.auth.user) ?? null;
  const dataTable = useSelector(
    (store: RootState) =>
      store[reducer][state as keyof (typeof store)[typeof reducer]],
  );
  const {
    content = [],
    totalElements = 0,
    totalPages = 0,
    page = 0,
    size = 0,
  } = dataTable as {
    content?: TableRow[];
    totalElements?: number;
    totalPages?: number;
    page?: number;
    size?: number;
  };

  useEffect(() => {
    setSelectedIds(new Set());
    onSelectionChange?.([]);
  }, [content]);

  const hasCheckbox = tableConfig.some((col) => col.type === CHECKBOX);

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      onSelectionChange?.([...next]);
      return next;
    });
  };

  const selectableRows = isRowSelectable
    ? content.filter(isRowSelectable)
    : content;

  const toggleAll = () => {
    const selectableIds = selectableRows.map((row) => String(row.id));
    const allChecked = selectableIds.every((id) => selectedIds.has(id));
    const next = allChecked
      ? new Set<string>()
      : new Set<string>(selectableIds);
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  };

  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((row) => selectedIds.has(String(row.id)));
  const someSelected =
    !allSelected &&
    selectableRows.some((row) => selectedIds.has(String(row.id)));

  return (
    <React.Fragment>
      <div className={clsx(styles["table-btn-group"], btnGroupClassName)}>
        {btnGroup?.map((btn: ButtonProps, index: number) => {
          const onClickHandler = handlers?.[btn.action];
          return (
            <ButtonComponent
              key={`table-btn-group-${index}-Mgs6rJRW`}
              type={btn.type}
              disabled={btn.disabled}
              className="me-2"
              style={btn?.style || {}}
              onClick={() => {
                if (typeof onClickHandler === "function") {
                  onClickHandler();
                }
              }}
              title={btn.title}
              action={btn.action}
            />
          );
        })}
      </div>

      <div className={styles["total-records"]}>
        Tổng bản ghi: <span>{totalElements}</span>
      </div>

      <Table bordered responsive className={styles["table-container"]}>
        <thead>
          <tr>
            {tableConfig.map((col, index) => {
              if (col.type === CHECKBOX) {
                return (
                  <th
                    key={`head-${index}-TaR55kUr`}
                    style={{ width: 40, textAlign: "center", ...col.style }}
                  >
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleAll}
                    />
                  </th>
                );
              }
              return (
                <th key={`head-${index}-TaR55kUr`} style={col.style ?? {}}>
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {content.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={
                hasCheckbox && selectedIds.has(String(row.id))
                  ? styles["row-selected"]
                  : undefined
              }
            >
              {tableConfig.map((col, colIndex) => {
                if (col.type === CHECKBOX) {
                  const selectable = isRowSelectable
                    ? isRowSelectable(row)
                    : true;
                  return (
                    <td
                      key={`cell-${colIndex}-chk`}
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <input
                        type="checkbox"
                        disabled={!selectable}
                        checked={selectable && selectedIds.has(String(row.id))}
                        onChange={() => selectable && toggleRow(String(row.id))}
                        style={
                          !selectable
                            ? { cursor: "not-allowed", opacity: 0.3 }
                            : undefined
                        }
                      />
                    </td>
                  );
                }

                if (col.type === NUMERICAL_ORDER) {
                  let styleCell: React.CSSProperties = col.styleCell ?? {};
                  if (col.colorCustom) {
                    const color =
                      col.colorCustom[String(row[col.name])] ?? "unset";
                    styleCell = { ...styleCell, color };
                  }
                  return (
                    <td
                      key={`cell-${colIndex}-FAxa8j11`}
                      style={{ textAlign: "center", ...styleCell }}
                      className="align-middle"
                    >
                      {rowIndex + 1 + size * (page - 1)}
                    </td>
                  );
                }

                if (col.type === STRING) {
                  let styleCell: React.CSSProperties = col.styleCell ?? {};
                  if (Array.isArray(col?.refColor)) {
                    const color = colorCell?.(col?.refColor, row) ?? "unset";
                    styleCell = { ...styleCell, color };
                  }
                  return (
                    <td
                      key={`cell-${colIndex}-FAxa8j44`}
                      style={styleCell}
                      className="align-middle"
                    >
                      {String(row[col.name] ?? "")}
                    </td>
                  );
                }

                if (col.type === BUTTON) {
                  return (
                    <td
                      key={`cell-${colIndex}-3p5fNDpT`}
                      className={styles["btn-group"]}
                      style={col.styleCell ?? {}}
                    >
                      {(col.btnGroup ?? []).map((btn, btnIndex) => {
                        if (Array.isArray(btn?.refShow)) {
                          const isShowBtn = showButton?.(
                            btn.refShow,
                            btn.action,
                            row,
                            user,
                          );
                          if (!isShowBtn)
                            return (
                              <span
                                key={`cell-btn-${btnIndex}-95fxkyAB`}
                                style={{ visibility: "hidden" }}
                              >
                                &nbsp;
                              </span>
                            );
                        }
                        return (
                          <ButtonComponent
                            key={`cell-btn-${btnIndex}-95fxkyPJ`}
                            type={btn.type}
                            disabled={btn.disabled}
                            className="me-2"
                            style={btn.style ?? {}}
                            action={btn.action}
                            onClick={() => handleCellAction?.(row, btn.action)}
                            title={btn.title}
                          />
                        );
                      })}
                    </td>
                  );
                }
                return null;
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ py: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Stack>
      )}
    </React.Fragment>
  );
};

export default BaseTableComponent;
