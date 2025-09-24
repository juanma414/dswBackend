import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  verbose: true,
  coverageDirectory: "coverage",
  collectCoverage: false,
  collectCoverageFrom: ["src/** /*.ts", "!src/** /*.spec.ts", "!**/node_modules/**"], //Se relaciona con la bandera anterior si la ponemos en true
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.ts?$": "ts-jest" },
  testMatch: ["<rootDir>/src/** /*.spec.ts"],
  moduleNameMapper: {
    "^\\.{1,2}/.*\\.js$": "$1.ts",
  },

 // extensionsToTreatAsEsm: [".ts"],
  //clearMocks: true,
  //moduleFileExtensions: ["ts", "js", "json", "node"],
};

export default config;
