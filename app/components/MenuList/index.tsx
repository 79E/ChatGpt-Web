import {
  CommentOutlined,
  GithubOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { joinTrim } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  mode?: "vertical" | "horizontal" | "inline";
};

function MenuList(props: Props) {
  const pathname = usePathname();

  const menuList = [
    {
      path: "/",
      name: "对话",
      icon: <CommentOutlined />,
      message: "与智能AI进行对话交流",
    },
    {
      path: "/draw",
      name: "绘画",
      icon: <PictureOutlined />,
      message: "利用智能AI绘画出图片",
    },
    {
      path: "https://github.com/79E/ChatGpt-Web",
      name: "项目地址",
      icon: <GithubOutlined />,
      message: "免费开源可商业化AiWeb项目",
    },
  ];

  const { mode = "horizontal" } = props;

  return (
    <div className={joinTrim([styles.menuList, styles["menuList_" + mode]])}>
      {menuList.map((item) => {
        const isExternal = /^(http:\/\/|https:\/\/)/.test(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            target={isExternal ? "_blank" : "_self"}
          >
            <div
              className={joinTrim([
                styles.item,
                pathname === item.path ? styles.select_item : "",
              ])}
            >
              <span className={styles.item_icon}>{item.icon}</span>
              <div className={styles.item_text}>
                <p className={styles.item_title}>{item.name}</p>
                {mode !== "horizontal" && (
                  <span className={styles.item_message}>{item.message}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default MenuList;
