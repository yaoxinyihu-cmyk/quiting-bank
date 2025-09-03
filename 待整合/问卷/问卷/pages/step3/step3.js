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
        icon: 'success'
      });
    }
  });
  