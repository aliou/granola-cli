import pkg from "../package.json" with { type: "json" };

export const APP_NAME = "granola";
export const VERSION = pkg.version;

export const GRANOLA_API_BASE = "https://public-api.granola.ai/v1";
export const CONFIG_DIR_NAME = "granola-cli";
export const CONFIG_FILE = "config.json";
