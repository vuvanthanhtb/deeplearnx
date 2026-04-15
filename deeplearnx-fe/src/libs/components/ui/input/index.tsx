import clsx from "clsx";

interface InputProps {
  className?: string;
  style?: React.CSSProperties;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputComponent = (props: InputProps) => {
  const {
    className,
    style = {},
    name,
    value,
    disabled = false,
    readOnly = false,
    onChange,
    onBlur,
    onFocus,
  } = props;
  return (
    <input
      type="text"
      className={clsx("form-input", className)}
      style={style}
      name={name}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default InputComponent;
