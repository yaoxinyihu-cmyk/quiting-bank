Page({
  data: {
    current: 0
  },

  onSwiperChange(e) {
    this.setData({
      current: e.detail.current
    });
  },

  goNext() {
    this.setData({
      current: this.data.current + 1
    });
  },
  startNow() {
  wx.navigateTo({ url: '/pages/login/login' });
},
});
