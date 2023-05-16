import { Config } from "./type";

export function getConfig(key?: keyof Config) {
  const development = require("./development");
  const production = require("./production");
  const env = process.env.NODE_ENV;
  let config = development;
  if (env === "production") {
    config = production;
  }
  if (key) {
    return config[key];
  }
  return config;
}
