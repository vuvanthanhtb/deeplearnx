import { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { registerUser } from "@/modules/auth/shell/auth.slice";
import Avatar from "@/assets/avatar.jpeg";
import BackgroundLogin from "@/assets/background-login.jpg";
import styles from "./register.module.scss";
import BaseFormComponent from "@/libs/components/ui/base-form";
import type { RegisterRequest } from "../../shell/auth.type";
import { initialValues, loginConfig } from "./register.config";
import { registerValidation } from "./register.validation";
import { HOME_PATH } from "@/modules/home/shell/home.route";
import { AUTH_PATH } from "../../shell/auth.route";
import { BTN_SUBMIT } from "@/libs/constants/button.constant";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(initialValues);

  useEffect(() => {
    document.title = "Đăng ký";
  }, []);

  const onChange = (data: Record<string, unknown>) => {
    setFormValues((prev) => ({ ...prev, ...data }));
  };

  const handleRegister = async (data: Record<string, unknown>) => {
    const result = await dispatch(
      registerUser(data as unknown as RegisterRequest),
    );
    if (registerUser.fulfilled.match(result)) {
      navigate(AUTH_PATH.LOGIN, { replace: true });
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
        <div className={styles["form-login__title"]}>
          <span className={styles["form-login__title-gradient"]}>
            Deeplearn
          </span>
          <span className={styles["form-login__title-x"]}>X</span>
        </div>
        <BaseFormComponent
          formConfig={loginConfig}
          validationSchema={registerValidation}
          values={formValues}
          onChange={onChange}
          handlers={{
            [BTN_SUBMIT]: handleRegister,
          }}
        />
        <p className={styles["form-login__switch"]}>
          Đã có tài khoản? <Link to={AUTH_PATH.LOGIN}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
