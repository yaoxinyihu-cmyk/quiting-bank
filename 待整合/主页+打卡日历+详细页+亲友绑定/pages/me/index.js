Page({
  data:{
    statusBarHeight:0,
    planDays:21,
    dailyCigs:20,
    pricePerPack:20,
    cigsPerPack:20
  },
  onLoad(){
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
    const p = wx.getStorageSync('smokeProfile');
    const d = wx.getStorageSync('quitPlanDays');
    if(p){ this.setData({ dailyCigs:p.dailyCigs, pricePerPack:p.pricePerPack, cigsPerPack:p.cigsPerPack }); }
    if(d){ this.setData({ planDays:d }); }
  },
  onPlanInput(e){ this.setData({ planDays: Number(e.detail.value||0) }); },
  onDailyInput(e){ this.setData({ dailyCigs: Number(e.detail.value||0) }); },
  onPriceInput(e){ this.setData({ pricePerPack: Number(e.detail.value||0) }); },
  onPerPackInput(e){ this.setData({ cigsPerPack: Number(e.detail.value||0) }); },
  saveProfile(){
    const { planDays, dailyCigs, pricePerPack, cigsPerPack } = this.data;
    wx.setStorageSync('quitPlanDays', planDays || 21);
    wx.setStorageSync('smokeProfile', {
      dailyCigs: dailyCigs || 20,
      pricePerPack: pricePerPack || 20,
      cigsPerPack: cigsPerPack || 20
    });
    wx.showToast({ title:'已保存', icon:'success' });
  }
});