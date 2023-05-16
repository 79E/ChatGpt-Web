"use client";
import styles from "./index.module.scss";
import {
  Button,
  Empty,
  Input,
  Image,
  Radio,
  Slider,
  Space,
  Popconfirm,
  notification,
  message,
} from "antd";
import { useState } from "react";
import dynamic from "next/dynamic";
import { configStore, drawStore } from "@/store";
import OpenAiLogo from "@/components/OpenAiLogo";
import { ClearOutlined } from "@ant-design/icons";
import { formatTime, generateUUID, getAiKey } from "@/utils";

import Loading from "@/components/Loading";
const Layout = dynamic(() => import("@/components/Layout"), {
  loading: () => <Loading />,
});

import { getConfig } from "@/config";
import { drawAsync } from "@/store/async";

function DrawPage() {
  const { setConfigModal } = configStore();
  const { historyDrawImages, clearhistoryDrawImages, addDrawImage } =
    drawStore();

  const [drawConfig, setDrawConfig] = useState({
    prompt: "",
    n: 1,
    size: "256x256",
    response_format: "url",
  });

  const [drawResultData, setDrawResultData] = useState<{
    loading: boolean;
    list: Array<{ url: string }>;
  }>({
    loading: false,
    list: [],
  });
  const handleDraw = async (res: Response) => {
    const { data } = await res.json();
    if (res.status !== 200 || data.length <= 0) {
      message.error("请求错误 🙅");
      return;
    }
    setDrawResultData({
      loading: false,
      list: data,
    });
    const addImagesData = data.map((item: any) => {
      return {
        ...item,
        ...drawConfig,
        id: generateUUID(),
        dateTime: formatTime(),
      };
    });
    addDrawImage(addImagesData);
  };

  const onStartDraw = async () => {
    setDrawResultData({
      loading: true,
      list: [],
    });
    drawAsync
      .proxyImagesGenerations(drawConfig)
      .then(handleDraw)
      .finally(() => {
        setDrawResultData((dr) => ({ ...dr, loading: false }));
      });
  };

  return (
    <div className={styles.drawPage}>
      <Layout>
        <div className={styles.drawPage_container}>
          <div className={styles.drawPage_container_one}>
            <div className={styles.drawPage_header}>
              {getConfig("drawLogo") && (
                <img src={getConfig("drawLogo")} alt="Midjourney" />
              )}
              <h2>AI 一下，妙笔生画</h2>
              <h4>只需一句话，让你的文字变成画作</h4>
            </div>
            <div
              className={styles.drawPage_create}
              style={{
                minHeight:
                  drawResultData.loading || drawResultData.list.length > 0
                    ? ""
                    : 0,
              }}
            >
              {drawResultData.loading && (
                <OpenAiLogo rotate width="3em" height="3em" />
              )}
              <Image.PreviewGroup>
                {drawResultData.list.map((item) => {
                  return (
                    <Image
                      className={styles.drawPage_image}
                      key={item.url}
                      width={160}
                      src={item.url}
                    />
                  );
                })}
              </Image.PreviewGroup>
            </div>
            <div className={styles.drawPage_mydraw}>
              <div className={styles.drawPage_mydraw_header}>
                <div>
                  <h4>我的绘画</h4>
                  <p>请及时保存绘画图片，链接可能会失效</p>
                </div>
                <Popconfirm
                  title="清除历史绘画"
                  description="确定清除所有绘画数据吗？"
                  onConfirm={() => {
                    clearhistoryDrawImages();
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <ClearOutlined
                    className={styles.drawPage_mydraw_header_icon}
                  />
                </Popconfirm>
              </div>
              {historyDrawImages.length <= 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无生成记录"
                />
              )}
              <Image.PreviewGroup>
                <div className={styles.drawPage_mydraw_list}>
                  {historyDrawImages.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={styles.drawPage_mydraw_list_item}
                      >
                        <Image
                          className={styles.drawPage_image}
                          src={item.url}
                        />
                        <p>{item.prompt}</p>
                      </div>
                    );
                  })}
                </div>
              </Image.PreviewGroup>
            </div>
          </div>
          <div className={styles.drawPage_container_two}>
            <div className={styles.drawPage_config}>
              <Space direction="vertical">
                <p>图片尺寸({drawConfig.size})</p>
                <Radio.Group
                  buttonStyle="solid"
                  defaultValue={drawConfig.size}
                  value={drawConfig.size}
                  onChange={(e) => {
                    setDrawConfig((c) => ({ ...c, size: e.target.value }));
                  }}
                >
                  <Radio.Button value={"256x256"}>256x256</Radio.Button>
                  <Radio.Button value={"512x512"}>512x512</Radio.Button>
                  <Radio.Button value={"1024x1024"}>1024x1024</Radio.Button>
                </Radio.Group>
                <p>图片数量({drawConfig.n}张)</p>
              </Space>
              <Slider
                defaultValue={drawConfig.n}
                value={drawConfig.n}
                min={1}
                max={10}
                onChange={(e) => {
                  setDrawConfig((c) => ({ ...c, n: e }));
                }}
              />
              {/* <Button
                block
                type="dashed"
                style={{
                  background: 'transparent'
                }}
                onClick={() => {
                  setConfigModal(true)
                }}
              >
                系统配置
              </Button> */}
            </div>
            <Input.Search
              value={drawConfig.prompt}
              placeholder="请输入修饰词"
              allowClear
              enterButton={drawResultData.loading ? "绘制中..." : "开始绘制"}
              size="large"
              loading={drawResultData.loading}
              onSearch={() => {
                onStartDraw();
              }}
              onChange={(e) => {
                setDrawConfig((c) => ({ ...c, prompt: e.target.value }));
              }}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default DrawPage;
