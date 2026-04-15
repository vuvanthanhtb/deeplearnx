import clsx from "clsx";
import Modal from "react-bootstrap/Modal";

interface BaseModalProps {
  show: boolean;
  handleClose: () => void;
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  size?: "lg" | "sm";
  className?: string;
}

const BaseModal: React.FC<BaseModalProps> = (props) => {
  const {
    show,
    handleClose,
    title,
    children,
    style = {},
    size = "lg",
    className,
  } = props;
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <div style={style} className={clsx("title-modal", className)}>
            {title}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default BaseModal;
