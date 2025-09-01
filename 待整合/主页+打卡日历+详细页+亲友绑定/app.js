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