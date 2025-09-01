Page({
  data: {},

  // 跳转到介绍页
  goIntroduce() {
    wx.navigateTo({
      url: '/pages/introduce/introduce'
    });
  },

  // 跳转到“我的”页
  goMy() {
    wx.switchTab({
      url: '/pages/my/my'
    });
  }
});
