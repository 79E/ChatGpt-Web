import { RequestImagesGenerations } from '@/types';
import configStore from '../config/slice';

// 代理模式
const proxyImagesGenerations = (
  params: RequestImagesGenerations,
  options?: { [key: string]: any }
) => {
  const host = configStore.getState().config.api;
  const key = configStore.getState().config.api_key;
  return fetch('/api/proxy/v1/images/generations', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'x-proxy-host': host ? host : '',
      'x-proxy-key': key ? key : '',
    },
    ...options,
  });
};

export default {
  proxyImagesGenerations,
};
