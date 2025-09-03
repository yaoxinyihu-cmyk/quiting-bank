Page({
    onLoad() {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/intro/intro' // 跳转到介绍页
        });
      }, 1000);
    }
  });
  