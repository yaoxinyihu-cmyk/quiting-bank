Page({
  data: {
    totalSaved: '0.00',
    todaySaved: '0',
    monthUnwithdrawn: '0',
    totalTransferIn: '0',
    friendAccount: '0'
  },

  onLoad() {
    this.fetchFundsData();
  },

  // 模拟获取资金数据（可替换为真实请求）
  fetchFundsData() {
    const mockData = {
      totalSaved: '660.00',
      todaySaved: '30',
      monthUnwithdrawn: '240',
      totalTransferIn: '1020',
      friendAccount: '120'
    };
    this.setData(mockData);
  },

  onTransferIn() {
    wx.showToast({
      title: '转入功能待开发',
      icon: 'none'
    });
  },

  onTransferOut() {
    wx.showToast({
      title: '转出功能待开发',
      icon: 'none'
    });
  }
});
