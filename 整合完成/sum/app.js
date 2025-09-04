// app.js
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
  globalData: {
    currentUser: null, // 存储当前登录的用户
    tempProfile: {}    // 暂存问卷数据
  },

  onLaunch() {
    // 初始化本地存储结构
    const init = wx.getStorageSync('signData');
    if (!init) {
      wx.setStorageSync('signData', {
        // 示例结构： "2025-08-13": { signed: true, mood: "还不错", createdAt: 1690000000000 }
      });
    }

    // 初始化时检查是否有已登录的用户
    const user = AV.User.current();
    if (user) {
      this.globalData.currentUser = user;
      // 验证用户session是否有效
      user.isAuthenticated().then(authenticated => {
        if (authenticated) {
          this.globalData.currentUser = user;
          console.log('用户已登录:', user.getUsername());
        } else {
          this.globalData.currentUser = null;
          console.log('用户登录已过期');
        }
      }).catch(error => {
        console.error('验证用户登录状态失败:', error);
        this.globalData.currentUser = null;
      });
    }
  },
});