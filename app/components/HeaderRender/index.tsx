import React, { useEffect, useMemo, useState } from "react";
import { HeaderViewProps } from "@ant-design/pro-layout/es/components/Header";
import styles from "./index.module.scss";
import {
  AppstoreOutlined,
  CloudSyncOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  PayCircleOutlined,
  ReconciliationOutlined,
  SyncOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { configStore } from "@/store";
import { Avatar, Button, Dropdown } from "antd";
import { getAiKey, getEmailPre } from "@/utils";
import MenuList from "../MenuList";
import { getConfig } from "@/config";
import { userAsync } from "@/store/async";

function HeaderRender(props: HeaderViewProps, defaultDom: React.ReactNode) {
  // const { token, user_detail, logout, setLoginModal } = useStore()
  const { config } = configStore();

  const renderLogo = useMemo(() => {
    if (typeof props.logo === "string") return <img src={props.logo} />;
    return <>{props.logo}</>;
  }, []);

  useEffect(() => {
    onRefreshBalance();
  }, [config.api, config.api_key]);

  const [balance, setBalance] = useState<{
    number: string | number;
    loading: boolean;
  }>({
    number: 0,
    loading: false,
  });

  function onRefreshBalance() {
    // const systemConfig = getAiKey(config);
    setBalance((b) => ({ ...b, loading: true }));
    userAsync
      .proxyUsage()
      .then((res) => {
        setBalance((b) => ({ number: res, loading: false }));
      })
      .finally(() => {
        setBalance((b) => ({ ...b, loading: false }));
      });
  }

  return (
    <div className={styles.header}>
      {props.isMobile && props.hasSiderMenu && (
        <MenuUnfoldOutlined
          className={styles.header__menuIcon}
          onClick={() => props.onCollapse?.(!props.collapsed)}
        />
      )}
      <div className={styles.header__logo}>
        {renderLogo}
        {!props.isMobile && <h1>{props.title}</h1>}
      </div>
      {!props.isMobile && <MenuList />}
      <div className={styles.header__actives}>
        <div
          className={styles.header__balance}
          onClick={() => {
            onRefreshBalance();
          }}
        >
          <p>余额：{balance.number}</p> <SyncOutlined spin={balance.loading} />
        </div>
        {props.isMobile && (
          <Dropdown
            arrow
            placement="bottomRight"
            destroyPopupOnHide
            trigger={["click"]}
            dropdownRender={() => {
              return <MenuList mode="inline" />;
            }}
          >
            <div className={styles.header__actives_menu}>
              <AppstoreOutlined />
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
}

export default HeaderRender;
