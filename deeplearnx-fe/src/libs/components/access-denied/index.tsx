import { useNavigate } from "react-router-dom";

import styles from "./access-denied.module.scss";

const AccessDeniedComponent = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>🚫</div>

        <h1>Truy cập bị hạn chế</h1>

        <p className={styles.description}>
          Tài khoản của bạn đã đăng nhập thành công nhưng hiện
          <strong> chưa được cấp quyền</strong> để truy cập nội dung này.
          <br />
          Vui lòng liên hệ quản trị viên để được hỗ trợ.
        </p>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => navigate("/")}>
            Quay về trang chính
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedComponent;
