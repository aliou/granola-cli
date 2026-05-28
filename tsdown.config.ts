import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/main.ts"],
    format: "esm",
    dts: false,
    sourcemap: true,
    clean: true,
    target: "node26",
  },
  {
    entry: ["src/main.ts"],
    format: "cjs",
    dts: false,
    clean: false,
    target: "node26",
    deps: {
      alwaysBundle: [/.*/],
    },
    exe: {
      fileName: "granola",
      outDir: "dist",
      targets: [
        { platform: "darwin", arch: "arm64", nodeVersion: "26.0.0" },
        { platform: "linux", arch: "arm64", nodeVersion: "26.0.0" },
      ],
      seaConfig: {
        disableExperimentalSEAWarning: true,
        useCodeCache: false,
        useSnapshot: false,
        execArgvExtension: "none",
      },
    },
  },
]);
