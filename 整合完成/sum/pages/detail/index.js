const { pad } = require('../../utils/date');
const AV = require('../../libs/av-core-min.js');

Page({
  data: { 
    statusBarHeight: 0, 
    date: '', 
    dateCN: '--', 
    signed: false, 
    mood: '', 
    isToday: false, 
    from: '' 
  },

  onLoad(opts) {
    const { statusBarHeight } = wx.getSystemInfoSync();
    const key = opts?.date || this._today();
    const store = wx.getStorageSync('signData') || {};
    const rec = store[key] || {};
    this.setData({
      statusBarHeight,
      from: opts?.from || '',
      date: key,
      dateCN: this._toCN(key),
      signed: !!rec.signed,
      mood: rec.mood || '',
      isToday: key === this._today()
    });
    if (opts && opts.tip === '1') {
      wx.showToast({ title: '快来填写今日的戒烟心得吧', icon: 'none' });
    }
  },

  _today() {
    const n = new Date();
    return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
  },
  
  _toCN(s) {
    if (!s) return '--';
    const [y, m, d] = s.split('-');
    return `${y}年${+m}月${+d}日`;
  },

  goBack() { wx.navigateBack(); },
  
  onSwitch(e) { 
    if (!this.data.isToday) return; 
    this.setData({ signed: e.detail.value }); 
  },
  
  onMoodInput(e) { this.setData({ mood: e.detail.value }); },

  async onSave() {
    if (!this.data.isToday) {
      wx.showToast({ title: '仅今天可打卡', icon: 'none' });
      return;
    }

    try {
      const currentUser = AV.User.current();
      if (!currentUser) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }

      // 保存到本地存储
      const store = wx.getStorageSync('signData') || {};
      store[this.data.date] = { 
        signed: this.data.signed, 
        mood: (this.data.mood || '').trim() 
      };
      wx.setStorageSync('signData', store);

      // 尝试保存到LeanCloud
      try {
        const CheckIn = AV.Object.extend('CheckIn');
        
        // 直接创建新记录，而不是先查询
        const checkInRecord = new CheckIn();
        checkInRecord.set('user', currentUser);
        checkInRecord.set('date', new Date(this.data.date));
        checkInRecord.set('signed', this.data.signed);
        checkInRecord.set('mood', this.data.mood.trim());
        
        await checkInRecord.save();
        console.log('打卡记录保存到LeanCloud成功');
      } catch (leanCloudError) {
        console.warn('保存到LeanCloud失败，使用本地存储:', leanCloudError);
        // LeanCloud保存失败不影响本地使用
      }
      
      // 更新全局统计
      const app = getApp();
      if (app.loadCheckInData) {
        app.loadCheckInData();
      }

      wx.showToast({ title: '已保存', icon: 'success' });
      
      if (this.data.from === 'home') {
        wx.redirectTo({ url: '/pages/home/index?success=1' });
      } else {
        wx.navigateBack();
      }
    } catch (error) {
      console.error('保存打卡记录失败:', error);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  }
});