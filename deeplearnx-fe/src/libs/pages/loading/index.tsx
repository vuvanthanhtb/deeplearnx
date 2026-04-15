import React from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import styles from "./loading.module.scss";
import type { RootState } from "@/shell/redux/store";

interface LoadingPageProps {
  opacity?: number;
  target?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = (props) => {
  const { opacity, target } = props;

  const { totalLoadingProcess } = useSelector((state: RootState) => state.app);
  if (totalLoadingProcess === 0) {
    return "";
  }

  let opacityNum = 0.3;
  if (opacity) {
    opacityNum = opacity;
  }

  const gridContent = document.querySelector(target ?? "#root");

  const backgroundColor = {
    backgroundColor: `rgba(225, 225, 225, ${opacityNum})`,
  };

  const loadingPanel = (
    <div style={backgroundColor} className={styles["lds-ellipsis"]}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );

  if (!gridContent) {
    return null;
  }
  return ReactDOM.createPortal(loadingPanel, gridContent);
};

export default LoadingPage;
