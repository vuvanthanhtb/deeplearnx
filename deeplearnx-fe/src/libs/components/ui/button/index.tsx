import clsx from "clsx";
import { Spinner } from "react-bootstrap";
import type { ButtonProps } from "@/libs/types/button.type";

const ButtonComponent = (props: ButtonProps) => {
  const {
    title,
    type,
    style = {},
    className = "",
    onClick,
    disabled = false,
    isLoading = false,
  } = props;
  return (
    <button
      type={type}
      style={style}
      className={clsx("base-btn", className)}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          {title}
        </>
      ) : (
        title
      )}
    </button>
  );
};

export default ButtonComponent;
