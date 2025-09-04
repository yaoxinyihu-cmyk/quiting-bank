const AV = require("./libs/av-core-min.js");
const adapters = require("./libs/leancloud-adapters-weapp.js");

AV.setAdapters(adapters);
AV.init({
  appId: "lSQllNs8JQBywoskZhw5EwC6-gzGzoHsz",
  appKey: "cj3Z4lfue4CAeq0SPH1tjSvq",
  serverURL: "https://lsqllns8.lc-cn-n1-shared.com",
});
// app.js
App({
  onLaunch() {
    // 初始化本地存储结构
    const init = wx.getStorageSync('signData');
    if (!init) {
      wx.setStorageSync('signData', {
        // 示例结构： "2025-08-13": { signed: true, mood: "还不错", createdAt: 1690000000000 }
      });
    }
  },
});