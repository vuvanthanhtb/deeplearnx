import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { loginUser } from "@/modules/auth/shell/auth.slice";
import Avatar from "@/assets/avatar.jpeg";
import BackgroundLogin from "@/assets/background-login.jpg";
import styles from "./login.module.scss";
import BaseFormComponent from "@/libs/components/ui/base-form";
import type { LoginRequest } from "../../shell/auth.type";
import { initialValues, loginConfig } from "./login.config";
import { loginValidation } from "./login.validation";
import { HOME_PATH } from "@/modules/home/shell/home.route";
import { AUTH_PATH } from "../../shell/auth.route";
import { BTN_SUBMIT } from "@/libs/constants/button.constant";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(initialValues);

  const onChange = (data: Record<string, unknown>) => {
    setFormValues((prev) => ({ ...prev, ...data }));
  };

  const handleLogin = async (data: Record<string, unknown>) => {
    const result = await dispatch(loginUser(data as unknown as LoginRequest));
    if (loginUser.fulfilled.match(result)) {
      navigate(HOME_PATH.BASE, { replace: true });
    }
  };

  if (isAuthenticated) {
    return <Navigate to={HOME_PATH.BASE} replace />;
  }

  return (
    <div className={styles["login-container"]}>
      <img src={BackgroundLogin} alt="login" />
      <div className={styles["form-login"]}>
        <img className="image-avatar" src={Avatar} alt="login" />
        <label className={styles["form-login__title"]}>DeepLearnX</label>
        <BaseFormComponent
          formConfig={loginConfig}
          validationSchema={loginValidation}
          values={formValues}
          onChange={onChange}
          handlers={{
            [BTN_SUBMIT]: handleLogin,
          }}
        />
        <p className={styles["form-login__switch"]}>
          Chưa có tài khoản? <Link to={AUTH_PATH.REGISTER}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
