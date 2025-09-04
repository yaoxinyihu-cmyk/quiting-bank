// pages/home/index.js
const { pad } = require('../../utils/date');

Page({
  data:{
    statusBarHeight:0,
    user:{ name:'刘军', avatar:'/assets/images/avatar3.png' },
    streakDays:0, streakStartCN:'2025年8月28日',
    todaySave:20, sumSave:100, sumCigs:100,
    msgsPreview:[
      {id:1, name:'橙子', avatar:'/assets/images/avatar1.png', time:'10:17', text:'坚持，加油！'},
      {id:2, name:'星河', avatar:'/assets/images/avatar2.png', time:'12:05', text:'想烟时多喝水/深呼吸~'},
      {id:3, name:'唐宁', avatar:'/assets/images/avatar3.png', time:'18:33', text:'每一天的小胜利，汇聚成大改变！'}
    ]
  },

  onLoad(){
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
  },

  /* 绑定亲友 */
  goBind(){ wx.navigateTo({ url:'/pages/bind/index' }); },

  /* 一键打卡：完成后跳去日历并引导 */
  
  oneTapSign(){
    console.log('oneTapSign clicked');
    const today = this._today();
    const store = wx.getStorageSync('signData') || {};
    if(!store[today]) store[today] = { signed:true, mood:'' };
    else store[today].signed = true;
    wx.setStorageSync('signData', store);
    console.log('will navigate to calendar page');
    wx.navigateTo({ url:'/pages/calendar/index?entryTip=1' });
  },

  openCalendar(){ wx.navigateTo({ url:'/pages/calendar/index' }); },
  openAllMsgs(){ wx.navigateTo({ url:'/pages/board/index' }); },

  _today(){ const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
});