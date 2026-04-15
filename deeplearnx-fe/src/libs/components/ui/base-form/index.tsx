import clsx from "clsx";
import { lazy, Suspense, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import { FaRegTrashAlt } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik, FieldArray, FormikProvider } from "formik";

import ButtonComponent from "../button";
import styles from "./base-form.module.scss";

import {
  TEXT,
  SELECT,
  BUTTON,
  EDITOR,
  ARRAY,
  DATE,
} from "@/libs/constants/form.constant";

import type { ButtonProps } from "@/libs/types/button.type";
import type {
  BaseFormComponentProps,
  IField,
} from "@/libs/types/config-form.type";

import "bootstrap/dist/css/bootstrap.min.css";

const EditorComponent = lazy(() => import("../editor"));

const BaseFormComponent: React.FC<BaseFormComponentProps> = (props) => {
  const {
    formConfig,
    validationSchema,
    values,
    onChange = () => {},
    options,
    handlers,
    handleBlur,
  } = props;

  const [disabledButtons, setDisabledButtons] = useState<
    Record<string, boolean>
  >({});

  const handleButtonDelay = (key: string) => {
    setDisabledButtons((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setDisabledButtons((prev) => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const handleButtonClick = async (buttonKey: string, child: ButtonProps) => {
    handleButtonDelay(buttonKey);

    const handler = child.action ? handlers?.[child.action] : undefined;

    if (handler) {
      const result = await handler(formik.values, {
        submit: formik.submitForm,
        setFieldValue: formik.setFieldValue,
      });

      if (result === false) return;
    }

    if (!handler && child.type === "submit") {
      await formik.submitForm();
    }
  };

  const formik = useFormik({
    initialValues: (values as Record<string, unknown>) ?? {},
    validationSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {},
  });

  const isFieldVisible = (field: IField) => {
    if (!field.visibleWhen) return true;
    try {
      return field.visibleWhen(formik.values);
    } catch {
      return true;
    }
  };

  return (
    <div className={styles["form-container"]}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit} noValidate>
            <Row>
              {formConfig.fields.map((field: IField, index: number) => {
                if (!isFieldVisible(field)) return null;

                if (field.type === ARRAY) {
                  return (
                    <FieldArray
                      key={`form-${index}-array`}
                      name={field.name ?? ""}
                      render={(arrayHelpers) => (
                        <Col md={field.size} xs={12} className="mb-3">
                          {(
                            (formik.values[field.name ?? ""] as any[]) || []
                          ).map((item, arrayIndex) => (
                            <div
                              key={arrayIndex}
                              className={clsx("mb-3", styles["array-field"])}
                            >
                              <Button
                                type="button"
                                variant="outline-danger"
                                size="sm"
                                onClick={() => arrayHelpers.remove(arrayIndex)}
                                className={styles["array-field__remove-btn"]}
                              >
                                <FaRegTrashAlt />
                              </Button>

                              <Row>
                                {field.childFields?.map((childField, i) => {
                                  const childName = `${field.name}.${arrayIndex}.${childField.name}`;

                                  return (
                                    <Col key={i} md={childField.size} xs={12}>
                                      <Form.Group controlId={childName}>
                                        <Form.Label>
                                          {childField.label}
                                        </Form.Label>
                                        <Form.Control
                                          value={
                                            (item?.[
                                              childField.name ?? ""
                                            ] as string) || ""
                                          }
                                          onChange={(e) => {
                                            formik.setFieldValue(
                                              childName,
                                              e.target.value,
                                            );
                                          }}
                                        />
                                      </Form.Group>
                                    </Col>
                                  );
                                })}
                              </Row>
                            </div>
                          ))}

                          <Button
                            type="button"
                            onClick={() => arrayHelpers.push({})}
                          >
                            {field.buttonLabel || "Thêm mới"}
                          </Button>
                        </Col>
                      )}
                    />
                  );
                }

                if (field.type === TEXT) {
                  const name = field.name ?? "";
                  const error = formik.errors[name] as string;
                  const touched =
                    formik.touched[name] || formik.submitCount > 0;

                  return (
                    <Col key={index} md={field.size} xs={12} className="mb-3">
                      <Form.Group controlId={name}>
                        <Form.Label>
                          {field.label}
                          {field?.required && (
                            <span className={styles["form-required"]}>*</span>
                          )}
                        </Form.Label>

                        <Form.Control
                          className="shadow-none"
                          type={
                            field?.isPassword
                              ? "password"
                              : (field.inputType ?? "text")
                          }
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          isInvalid={touched && !!error}
                          value={String(formik.values[name] ?? "")}
                          onChange={(e) => {
                            formik.setFieldValue(name, e.target.value);
                            onChange({
                              ...formik.values,
                              [name]: e.target.value,
                            });
                          }}
                          onBlur={(e) => {
                            formik.handleBlur(e);
                            handleBlur?.({ [name]: e.target.value });
                          }}
                        />

                        <Form.Control.Feedback type="invalid">
                          {error}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  );
                }

                if (field.type === SELECT) {
                  const name = field.name ?? "";
                  const error = formik.errors[name] as string;
                  const touched =
                    formik.touched[name] || formik.submitCount > 0;

                  return (
                    <Col
                      key={index}
                      md={field.size}
                      xs={12}
                      className="mb-3"
                      style={field?.style || {}}
                    >
                      <Form.Group controlId={name}>
                        <Form.Label>
                          {field.label}
                          {field?.required && (
                            <span className={styles["form-required"]}>*</span>
                          )}
                        </Form.Label>

                        <Select
                          options={(options?.[field.option ?? ""] as []) || []}
                          placeholder={field.placeholder}
                          isDisabled={field.disabled}
                          isMulti={field?.isMulti || false}
                          value={formik.values[name] ?? null}
                          onChange={(val) => {
                            formik.setFieldValue(name, val);
                            onChange({
                              ...formik.values,
                              [name]: val,
                            });
                          }}
                          className={clsx({
                            "is-invalid": touched && !!error,
                          })}
                        />

                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
                          {touched && error}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  );
                }

                if (field.type === EDITOR) {
                  const name = field.name ?? "";
                  const error = formik.errors[name] as string | undefined;
                  const touched =
                    formik.touched[name] || formik.submitCount > 0;
                  return (
                    <Col
                      md={field.size}
                      xs={12}
                      className="mb-3"
                      style={field?.style || {}}
                      key={`form-${index}-4MtGPaQa`}
                    >
                      <Form.Group controlId={name}>
                        <Form.Label>
                          {field.label}
                          {field?.required && (
                            <span className={styles["form-required"]}>*</span>
                          )}
                        </Form.Label>

                        <Suspense
                          fallback={
                            <div
                              style={{
                                padding: "20px",
                                textAlign: "center",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            >
                              Đang tải trình soạn thảo...
                            </div>
                          }
                        >
                          <EditorComponent
                            value={String(formik.values[name] ?? "")}
                            name={name}
                            disabled={field.disabled}
                            onChange={(content) => {
                              formik.setFieldValue(name, content);
                              onChange({ ...formik.values, [name]: content });
                            }}
                          />
                        </Suspense>
                        {touched && error && (
                          <div className="invalid-feedback d-block">
                            {error}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  );
                }

                if (field.type === BUTTON) {
                  return (
                    <Col
                      key={index}
                      md={field.size}
                      xs={12}
                      className={clsx("mb-3", styles["form-btn-container"])}
                      style={field?.style || {}}
                    >
                      {field.childs?.map((child, i) => {
                        const keyBtn = `btn-${index}-${i}`;
                        const isLoading = disabledButtons[keyBtn];

                        return (
                          <ButtonComponent
                            key={i}
                            type="button"
                            isLoading={isLoading}
                            disabled={child.disabled || isLoading}
                            title={child.title}
                            action={child.action}
                            className="me-2"
                            style={child?.style || {}}
                            onClick={(e) => {
                              e.preventDefault();
                              handleButtonClick(keyBtn, child);
                            }}
                          />
                        );
                      })}
                    </Col>
                  );
                }

                if (field.type === DATE) {
                  const name = field.name ?? "";
                  const error = formik.errors[name] as string;
                  const touched =
                    formik.touched[name] || formik.submitCount > 0;

                  return (
                    <Col
                      key={index}
                      md={field.size}
                      xs={12}
                      className="mb-3"
                      style={field?.style || {}}
                    >
                      <Form.Group controlId={name}>
                        <Form.Label>
                          {field.label}
                          {field?.required && (
                            <span className={styles["form-required"]}>*</span>
                          )}
                        </Form.Label>

                        <DatePicker
                          value={
                            formik.values[name]
                              ? dayjs(String(formik.values[name] ?? ""))
                              : null
                          }
                          onChange={(val) => {
                            formik.setFieldValue(
                              name,
                              val ? val.format("YYYY-MM-DD") : null,
                            );
                            onChange({
                              ...formik.values,
                              [name]: val ? val.format("YYYY-MM-DD") : null,
                            });
                          }}
                          disabled={field.disabled}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              error: touched && !!error,
                              helperText: touched && error,
                            },
                          }}
                        />
                      </Form.Group>
                    </Col>
                  );
                }

                return null;
              })}
            </Row>
          </Form>
        </FormikProvider>
      </LocalizationProvider>
    </div>
  );
};

export default BaseFormComponent;
