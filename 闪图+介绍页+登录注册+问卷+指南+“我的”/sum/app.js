const AV = require("./libs/av-core-min.js");
const adapters = require("./libs/leancloud-adapters-weapp.js");

AV.setAdapters(adapters);
AV.init({
  appId: "lSQllNs8JQBywoskZhw5EwC6-gzGzoHsz",
  appKey: "cj3Z4lfue4CAeq0SPH1tjSvq",
  serverURL: "https://lsqllns8.lc-cn-n1-shared.com",
});
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  }
})