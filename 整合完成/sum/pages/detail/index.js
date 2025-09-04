const { pad } = require('../../utils/date');

Page({
  data:{ statusBarHeight:0, date:'', dateCN:'--', signed:false, mood:'', isToday:false, from:'' },

  onLoad(opts){
    const { statusBarHeight } = wx.getSystemInfoSync();
    const key = opts?.date || this._today();
    const store = wx.getStorageSync('signData') || {};
    const rec   = store[key] || {};
    this.setData({
      statusBarHeight,
      from: opts?.from || '',
      date: key,
      dateCN: this._toCN(key),
      signed: !!rec.signed,
      mood: rec.mood || '',
      isToday: key === this._today()
    });
    if(opts && opts.tip === '1'){ wx.showToast({ title:'快来填写今日的戒烟心得吧', icon:'none' }); }
  },

  _today(){ const n=new Date(); return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())}`; },
  _toCN(s){ if(!s) return '--'; const [y,m,d]=s.split('-'); return `${y}年${+m}月${+d}日`; },

  goBack(){ wx.navigateBack(); },
  onSwitch(e){ if(!this.data.isToday) return; this.setData({ signed:e.detail.value }); },
  onMoodInput(e){ this.setData({ mood:e.detail.value }); },

  onSave(){
    if(!this.data.isToday){ wx.showToast({ title:'仅今天可打卡', icon:'none' }); return; }
    const store = wx.getStorageSync('signData') || {};
    store[this.data.date] = { signed:this.data.signed, mood:(this.data.mood||'').trim() };
    wx.setStorageSync('signData', store);
    wx.showToast({ title:'已保存', icon:'success' });
    if(this.data.from==='home'){ wx.redirectTo({ url:'/pages/home/index?success=1' }); }
    else{ wx.navigateBack(); }
  }
});