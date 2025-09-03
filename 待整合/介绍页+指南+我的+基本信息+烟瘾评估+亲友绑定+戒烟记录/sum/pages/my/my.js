Page({
  data: {
    userInfo: { name: "刘军", motto: "这次一定戒烟成功！" },
    quitDays: 22,
    moneySaved: 660,
    title: "戒烟王者"
  },

   onLoad() {
    // 后端接入时替换对应方法
  },

  goHome() {
    // 因为主页是 tabBar 页面，所以要用 switchTab
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goInfo() {
    wx.navigateTo({ url: '/pages/info/info' });
  },
  goAddictionTest() {
    wx.navigateTo({ url: '/pages/addiction-test/addiction-test' });
  },
  goMotivation() {
    wx.navigateTo({ url: '/pages/motivation/motivation' });
  },
  goFriendBind() {
    wx.navigateTo({ url: '/pages/friend-bind/friend-bind' });
  },
  goQuitRecord() {
    wx.navigateTo({ url: '/pages/quit-record/quit-record' });
  },
  goFunds() {
    wx.navigateTo({ url: '/pages/funds/funds' });
  },
  goAiguide() {
    wx.navigateTo({ url: '/pages/ai-guide/ai-guide' });
  }
});
