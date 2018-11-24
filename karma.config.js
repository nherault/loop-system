module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "src/**/*.ts" },
    ],
    preprocessors: {      
      "src/**/*.ts": ["karma-typescript"],
    },
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json",
    },
    exclude: [ "src/**/index.ts" ],
    reporters: ["progress", "karma-typescript"],
    browsers: ["ChromeHeadless"]
  });
};