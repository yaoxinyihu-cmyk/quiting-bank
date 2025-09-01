const { buildMonthMatrix, pad } = require('../../utils/date');
const DEFAULT_PROFILE = { dailyCigs:20, pricePerPack:20, cigsPerPack:20 };
const PLAN_DEFAULT_DAYS = 21;

Page({
  data:{
    statusBarHeight:0,
    totalDays:0, startDateCN:'--', totalCigs:0, savedMoney:0, relapseCount:0, progress:0,
    currentYear:new Date().getFullYear(), currentMonth:new Date().getMonth()+1,
    pickerYearVal:'', pickerMonthVal:'', matrix:[], signData:{},
    pulseToday:false
  },

  onLoad(opts){
    const { statusBarHeight } = wx.getSystemInfoSync();
    const now = new Date();
    this.setData({
      statusBarHeight,
      pickerYearVal:`${now.getFullYear()}-01-01`,
      pickerMonthVal:`${now.getFullYear()}-${pad(now.getMonth()+1)}-01`
    });

    this.loadSignData();
    this.refreshMatrix();
    this.refreshHeaderMetrics();

    if(opts && opts.entryTip === '1'){
      this.setData({ pulseToday:true });
      wx.showToast({ title:'快来打卡吧', icon:'none' });
      setTimeout(()=>this.setData({ pulseToday:false }), 3000);
    }
  },
  onShow(){ this.loadSignData(); this.refreshMatrix(); this.refreshHeaderMetrics(); },

  goBack(){ wx.navigateBack(); },

  loadSignData(){ this.setData({ signData: wx.getStorageSync('signData') || {} }); },

  refreshHeaderMetrics(){
    const signData = this.data.signData || {};
    const profile  = wx.getStorageSync('smokeProfile') || DEFAULT_PROFILE;
    const planDays = wx.getStorageSync('quitPlanDays') || PLAN_DEFAULT_DAYS;

    const { streakDays, streakStart } = this._computeCurrentStreak(signData);
    const relapseCount = this._computeBreakTimes(signData);

    const pricePerCig = profile.pricePerPack / profile.cigsPerPack;
    const totalCigs   = streakDays * profile.dailyCigs;
    const savedMoney  = Math.round(streakDays * profile.dailyCigs * pricePerCig);
    const progress    = Math.max(0, Math.min(100, Math.round((streakDays/planDays)*100)));

    this.setData({
      totalDays:streakDays,
      startDateCN:this._toCN(streakStart),
      totalCigs, savedMoney, relapseCount, progress
    });
  },

  _computeCurrentStreak(signData){
    const days = Object.keys(signData).filter(k=>signData[k]?.signed).sort();
    if(days.length===0) return { streakDays:0, streakStart:null };
    const last = days[days.length-1]; let cur=new Date(last), streak=1, start=last;
    for(let i=days.length-2;i>=0;i--){
      const d=new Date(days[i]); const delta=Math.round((cur-d)/86400000);
      if(delta===1){ streak++; start=days[i]; cur=d; } else if(delta>=2){ break; }
    }
    return { streakDays:streak, streakStart:start };
  },
  _computeBreakTimes(signData){
    const days = Object.keys(signData).filter(k=>signData[k]?.signed).sort();
    if(days.length<=1) return 0; let breaks=0;
    for(let i=1;i<days.length;i++){
      const delta=Math.round((new Date(days[i]) - new Date(days[i-1]))/86400000);
      if(delta>=2) breaks++;
    }
    return breaks;
  },
  _toCN(ymd){ if(!ymd) return '--'; const [y,m,d]=ymd.split('-'); return `${y}年${+m}月${+d}日`; },

  refreshMatrix(){
    const { currentYear, currentMonth, signData } = this.data;
    const raw = buildMonthMatrix(currentYear, currentMonth);
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    const matrix = raw.map(r=>r.map(cell=>{
      const key = `${cell.y}-${pad(cell.m)}-${pad(cell.d)}`;
      const rec = signData[key];
      return {
        ...cell,
        signed: !!rec?.signed,
        hasMood: !!(rec && rec.mood && rec.mood.trim()),
        isToday: key===todayKey
      };
    }));
    this.setData({
      matrix,
      pickerYearVal:`${currentYear}-01-01`,
      pickerMonthVal:`${currentYear}-${pad(currentMonth)}-01`
    });
  },

  onYearPick(e){ const y=new Date(e.detail.value).getFullYear(); this.setData({ currentYear:y }, this.refreshMatrix); },
  onMonthPick(e){ const dt=new Date(e.detail.value); this.setData({ currentYear:dt.getFullYear(), currentMonth:dt.getMonth()+1 }, this.refreshMatrix); },
  prevYear(){ this.setData({ currentYear:this.data.currentYear-1 }, this.refreshMatrix); },
  nextYear(){ this.setData({ currentYear:this.data.currentYear+1 }, this.refreshMatrix); },
  prevMonth(){ let {currentYear:y,currentMonth:m}=this.data; m--; if(m<1){m=12;y--;} this.setData({currentYear:y,currentMonth:m}, this.refreshMatrix); },
  nextMonth(){ let {currentYear:y,currentMonth:m}=this.data; m++; if(m>12){m=1;y++;} this.setData({currentYear:y,currentMonth:m}, this.refreshMatrix); },

  goDetail(e){
    const { y,m,d } = e.currentTarget.dataset;
    const dateStr = `${y}-${pad(m)}-${pad(d)}`;
    wx.navigateTo({ url:`/pages/detail/index?date=${dateStr}&tip=${this.data.pulseToday?1:0}` });
  }
});
