import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import styles from "./editor.module.scss";

const defaultModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const defaultFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
  "clean",
];

interface EditorProps {
  value: string;
  name: string;
  placeholder?: string;
  onChange: (e: string) => void;
  className?: string;
  style?: React.CSSProperties;
  modules?: Record<string, unknown>;
  formats?: string[];
  disabled?: boolean;
}

const EditorComponent: React.FC<EditorProps> = (props) => {
  const {
    onChange,
    placeholder,
    value,
    className = "",
    style = {},
    modules = defaultModules,
    formats = defaultFormats,
    disabled = false,
  } = props;

  const customModules = {
    ...modules,
    toolbar: disabled ? [] : modules.toolbar,
  };

  return (
    <div className={`${styles.editorWrapper} ${className}`} style={style}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={customModules}
        formats={formats}
        readOnly={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default EditorComponent;
