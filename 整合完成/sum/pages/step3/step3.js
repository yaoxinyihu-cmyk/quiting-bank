Page({
    data: {
      slogan: '',
      startDate: '',
      endDate: ''
    },
    onSloganInput(e) {
      this.setData({ slogan: e.detail.value });
    },
    onStartDateChange(e) {
      this.setData({ startDate: e.detail.value });
    },
    onEndDateChange(e) {
      this.setData({ endDate: e.detail.value });
    },
    finish() {
      wx.showToast({
        title: '问卷完成！',
        icon: 'success',
        duration: 1000 // toast 显示时间 1 秒
      });
  
      // 延迟 1 秒执行跳转
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/index/index", // 跳转到首页
        });
      }, 1000);
    }
  });
  