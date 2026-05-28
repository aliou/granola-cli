import { chmod, mkdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { CONFIG_DIR_NAME, CONFIG_FILE } from "./constants.js";

export interface Config {
  apiKey?: string;
}

const DEFAULT_CONFIG: Config = {};

export function getConfigDir(): string {
  const configHome = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(configHome, CONFIG_DIR_NAME);
}

export function getConfigPath(): string {
  return join(getConfigDir(), CONFIG_FILE);
}

export async function loadConfig(): Promise<Config> {
  const configPath = getConfigPath();

  try {
    const { readFile } = await import("node:fs/promises");
    const content = await readFile(configPath, "utf-8");
    const data = JSON.parse(content) as Record<string, unknown>;

    const config: Config = { ...DEFAULT_CONFIG };
    if (typeof data.apiKey === "string") {
      config.apiKey = data.apiKey;
    }

    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid config file at ${configPath}`);
    }
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...DEFAULT_CONFIG };
    }
    throw error;
  }
}

export async function saveConfig(config: Config): Promise<void> {
  const configPath = getConfigPath();
  const configDir = dirname(configPath);

  await mkdir(configDir, { recursive: true, mode: 0o700 });

  const content = `${JSON.stringify(config, null, 2)}\n`;
  const { writeFile } = await import("node:fs/promises");
  await writeFile(configPath, content, "utf-8");
  await chmod(configPath, 0o600);
}

export async function getApiKey(): Promise<string | undefined> {
  const envKey = process.env.GRANOLA_API_KEY;
  if (envKey) return envKey;

  const config = await loadConfig();
  return config.apiKey;
}

export async function checkConfigPermissions(): Promise<boolean> {
  const configPath = getConfigPath();

  try {
    const stats = await stat(configPath);
    const mode = stats.mode & 0o777;

    if (mode & 0o077) {
      return false;
    }

    return true;
  } catch {
    return true;
  }
}
