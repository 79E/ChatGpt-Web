import React from "react";
import { MenuProps } from "antd";
import dynamic from "next/dynamic";
import { MenuDataItem, ProLayout } from "@ant-design/pro-components";
// import HeaderRender from "../HeaderRender";
const HeaderRender = dynamic(() => import("../HeaderRender"));
import { ChatsInfo } from "@/types";
import { getConfig } from "@/config";

type Props = {
  menuExtraRender?: () => React.ReactNode;
  route?: {
    path: string;
    routes: Array<ChatsInfo>;
  };
  menuItemRender?: (
    item: MenuDataItem & {
      isUrl: boolean;
      onClick: () => void;
    },
    defaultDom: React.ReactNode,
    menuProps: MenuProps | any
  ) => React.ReactNode | undefined;
  menuDataRender?: (menuData: MenuDataItem[]) => MenuDataItem[];
  menuFooterRender?: (props?: any) => React.ReactNode;
  menuProps?: MenuProps;
  children?: React.ReactNode;
};

function Layout(props: Props) {
  const { menuExtraRender = () => <></>, menuItemRender = () => undefined } =
    props;
  return (
    <ProLayout
      title={getConfig("title")}
      logo={getConfig("logo")}
      layout="mix"
      splitMenus={false}
      contentWidth="Fluid"
      fixedHeader
      fixSiderbar
      headerRender={HeaderRender}
      contentStyle={{
        height: "calc(100vh - 56px)",
        background: "#fff",
      }}
      siderMenuType="group"
      style={{
        background: "#fff",
      }}
      menu={{
        hideMenuWhenCollapsed: true,
        locale: false,
        collapsedShowGroupTitle: false,
      }}
      suppressSiderWhenMenuEmpty
      siderWidth={300}
      menuExtraRender={menuExtraRender}
      menuItemRender={menuItemRender}
      route={props.route}
      menuDataRender={props.menuDataRender}
      avatarProps={{
        src: "https://files.catbox.moe/85jq4j.png",
        size: "small",
      }}
      menuFooterRender={props.menuFooterRender}
      menuProps={props.menuProps}
      breadcrumbRender={() => []}
    >
      {props.children}
    </ProLayout>
  );
}

export default Layout;
