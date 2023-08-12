import { TypeDocOptions } from "typedoc";

export const EVERSCALE_INPAGE_PROVIDER: Partial<TypeDocOptions> = {
  name: "everscale-inpage-provider",
  entryPoints: ["./node_modules/everscale-inpage-provider/src/index.ts"],
  out: "docs/build/everscale-inpage-provider",
  readme: "none",
  excludePrivate: true,
  includeVersion: true,
  categorizeByGroup: false,
  categoryOrder: [
    "Provider",
    "Contract",
    "Stream",
    "Models",
    "Provider Api",
    "Utils",
    "Other",
  ],
  sort: ["source-order"],
  hideGenerator: true,
  excludeExternals: false,
  markedOptions: {
    codeBlock: "fenced",
  },
  exclude: [],

  excludeNotDocumented: true,
  excludeInternal: true,
  json: "src/everscale-inpage-provider/ast.json",
  plugin: ["./src/plugins/sub-category.js"],
  theme: "mycustom",
};

export const TIP3: Partial<TypeDocOptions> = {
  name: "tip3",
  // entryPoints: ["./node_modules/tip3/src/index.ts"],
  out: "docs/build/tip3",
  readme: "none",
  excludePrivate: true,
  includeVersion: true,
  categorizeByGroup: false,
  categoryOrder: [
    // "Provider",
    // "Contract",
    // "Stream",
    // "Models",
    // "Provider Api",
    // "Utils",
    // "Other",
  ],
  sort: ["source-order"],
  hideGenerator: true,
  excludeExternals: false,
  markedOptions: {
    codeBlock: "fenced",
  },
  exclude: [],

  excludeNotDocumented: true,
  excludeInternal: true,
  json: "node_modules/@broxus/tip3/build/astBuild.json",
  plugin: ["./src/plugins/sub-category.js"],
  theme: "mycustom",
};
