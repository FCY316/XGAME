// const pxToViewport = require("postcss-px-to-viewport");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

// const vw = pxToViewport({
//   // 视口宽度，一般就是 375（ 设计稿一般采用二倍稿，宽度为 375 ）
//   viewportWidth: 375,
//   selectorBlackList: ["html"], // (Array) 指定不转换为视窗单位的类，可以自定义
// });
const production = process.env.REACT_APP_ENV === "production"; // 正式环境
const plugins = [];
if (production) {
  plugins.push(
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境下移除控制台所有的内容
          drop_debugger: true, // 生产环境下移除断点
          pure_funcs: ["console.log", "console.warn"], // 生产环境下移除console
        },
      },
      extractComments: false, // 设置为 false，不提取注释
    })
  );
}
module.exports = {
  // 此处省略 webpack 配置
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    plugins,
  }, // 这里补充style配置
  // style: {
  //   postcss: {
  //     mode: "extends",
  //     loaderOptions: {
  //       postcssOptions: {
  //         ident: "postcss",
  //         plugins: [vw],
  //       },
  //     },
  //   },
  // },
};
