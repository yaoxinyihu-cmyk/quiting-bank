Page({
    onLoad() {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/introduce/introduce' // 跳转到介绍页
        });
      }, 1000);
    }
  });
  