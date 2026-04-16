import { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";

import styles from "./account.module.scss";
import AccountListTab from "./tabs/list";
import AccountPendingTab from "./tabs/pending";

type TabId = "list" | "pending";

const AccountListPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [mountedTabs, setMountedTabs] = useState<Set<TabId>>(
    new Set<TabId>(["list"]),
  );

  useEffect(() => {
    document.title = "Tài khoản";
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setMountedTabs((prev) => {
      if (prev.has(tab)) return prev;
      return new Set([...prev, tab]);
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <PeopleIcon sx={{ color: "#1a73e8", fontSize: 28 }} />
          <span className={styles.title}>Tài khoản</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === "list" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("list")}
        >
          Danh sách tài khoản
        </div>
        <div
          className={`${styles.tab} ${activeTab === "pending" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("pending")}
        >
          Chờ phê duyệt
        </div>
      </div>

      {mountedTabs.has("list") && (
        <div className={styles.tabContent} hidden={activeTab !== "list"}>
          <AccountListTab />
        </div>
      )}
      {mountedTabs.has("pending") && (
        <div className={styles.tabContent} hidden={activeTab !== "pending"}>
          <AccountPendingTab />
        </div>
      )}
    </div>
  );
};

export default AccountListPage;
