"use client";

import { useState, useLayoutEffect } from "react";

function useDocumentResize(target?: HTMLElement) {
  if (!target && typeof window !== "undefined") {
    target = window.document.body;
  }

  const [rect, setRect] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      if (target) {
        setRect({
          width: target.offsetWidth,
          height: target.offsetHeight,
        });
      }
    };

    // 添加resize事件监听器
    window.addEventListener("resize", handleResize);

    // 获取初始宽度
    if (target) {
      setRect({
        width: target.offsetWidth,
        height: target.offsetHeight,
      });
    }

    // 在组件卸载时移除监听器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [target]);

  return rect;
}

export default useDocumentResize;
