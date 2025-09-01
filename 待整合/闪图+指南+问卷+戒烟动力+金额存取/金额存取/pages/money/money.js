Page({
    data: {
      totalSaved: '660.00',
      todaySaved: '30',
      monthUnwithdrawn: '240',
      totalTransferIn: '1020',
      friendAccount: '120'
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
  