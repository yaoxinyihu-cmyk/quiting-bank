Page({
  data:{ statusBarHeight:0 },
  onLoad(){
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
  }
});