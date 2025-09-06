// pages/home/index.js
const { pad } = require('../../utils/date');
const AV = require('../../libs/av-core-min.js');

Page({
  data: {
    statusBarHeight: 0,
    user: { name: '加载中...', avatar: '/assets/images/avatar3.png', slogan: '' }, // 初始为空
    streakDays: 0,
    streakStartCN: '--',
    todaySave: 0,
    sumSave: 0,
    sumCigs: 0,
    msgsPreview: [
      { id: 1, name: '橙子', avatar: '/assets/images/avatar1.png', time: '10:17', text: '坚持，加油！' },
      { id: 2, name: '星河', avatar: '/assets/images/avatar2.png', time: '12:05', text: '想烟时多喝水/深呼吸~' },
      { id: 3, name: '唐宁', avatar: '/assets/images/avatar3.png', time: '18:33', text: '每一天的小胜利，汇聚成大改变！' }
    ],
    isLoading: true,
    profileData: null // 存储用户配置数据
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
    this.loadUserData();
  },

  onShow() {
    // 每次页面显示时都重新加载数据，确保与打卡页面同步
    this.loadUserData();
  },

  // 加载用户数据
  async loadUserData() {
    try {
      this.setData({ isLoading: true });
      
      const currentUser = AV.User.current();
      if (!currentUser) {
        // 用户未登录，跳转到登录页面
        wx.redirectTo({
          url: '/pages/login/login'
        });
        return;
      }

      // 获取用户信息
      const userData = {
        name: currentUser.get('name') || currentUser.getUsername() || '用户',
        avatar: '/assets/images/avatar3.png', // 默认头像
        slogan: '' // 初始为空，等待从LeanCloud获取
      };
      
      // 获取用户配置数据
      const profileData = await this.loadProfileData();
      
      // 从LeanCloud获取打卡记录并计算统计数据
      await this.calculateStatsFromLeanCloud();
      
      // 更新用户信息，使用从LeanCloud获取的slogan
      this.setData({
        user: {
          ...userData,
          slogan: profileData.slogan // 使用从LeanCloud获取的slogan
        },
        isLoading: false
      });

    } catch (error) {
      console.error('加载用户数据失败:', error);
      
      // 如果出错，使用默认slogan
      this.setData({
        'user.slogan': '这次一定能戒烟成功！',
        isLoading: false
      });
      
      // 如果LeanCloud查询失败，尝试使用本地数据
      this.calculateStatsFromLocal();
    }
  },

  // 加载用户配置数据
  async loadProfileData() {
    try {
      const currentUser = AV.User.current();
      if (!currentUser) return null;

      // 查询用户配置
      const Profile = AV.Object.extend('Profile');
      const query = new AV.Query(Profile);
      query.equalTo('user', currentUser);
      const results = await query.find();
      
      if (results.length > 0) {
        const profile = results[0];
        const profileData = {
          dailyCigs: profile.get('smokeCount') || 20, // 从Profile获取日均吸烟量
          pricePerPack: profile.get('pricePerPack') || 20, // 从Profile获取烟的价格
          cigsPerPack: profile.get('cigsPerPack') || 20, // 从Profile获取每包烟支数
          slogan: profile.get('slogan') || '这次一定能戒烟成功！' // 从Profile获取戒烟口号
        };
        
        this.setData({
          profileData
        });
        
        return profileData;
      } else {
        // 使用默认值
        const profileData = {
          dailyCigs: 20,
          pricePerPack: 20,
          cigsPerPack: 20,
          slogan: '这次一定能戒烟成功！'
        };
        
        this.setData({
          profileData
        });
        
        return profileData;
      }
    } catch (error) {
      console.error('加载用户配置失败:', error);
      // 使用默认值
      const profileData = {
        dailyCigs: 20,
        pricePerPack: 20,
        cigsPerPack: 20,
        slogan: '这次一定能戒烟成功！'
      };
      
      this.setData({
        profileData
      });
      
      return profileData;
    }
  },

  // 从LeanCloud获取打卡记录并计算统计数据
  async calculateStatsFromLeanCloud() {
    try {
      const currentUser = AV.User.current();
      if (!currentUser) return;
      
      // 使用已加载的用户配置数据
      const profileData = this.data.profileData;
      if (!profileData) {
        await this.loadProfileData();
      }
      
      // 获取所有打卡记录
      let checkInRecords = [];
      try {
        const CheckIn = AV.Object.extend('CheckIn');
        const query = new AV.Query(CheckIn);
        query.equalTo('user', currentUser);
        query.equalTo('signed', true); // 只获取已签到的记录
        query.ascending('date'); // 按日期升序排列
        checkInRecords = await query.find();
      } catch (error) {
        console.error('获取打卡记录失败:', error);
        // 如果LeanCloud查询失败，回退到本地数据
        this.calculateStatsFromLocal();
        return;
      }
      
      // 提取已签到的日期
      const signedDates = [];
      checkInRecords.forEach(record => {
        const date = record.get('date');
        const dateStr = date.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
        signedDates.push(dateStr);
      });
      
      // 计算统计数据
      const totalDays = signedDates.length;
      
      // 计算连续打卡天数和开始日期
      const { streakDays, streakStart } = this._computeCurrentStreak(signedDates);
      
      // 使用从Profile获取的价格计算节省金额
      const pricePerCig = profileData.pricePerPack / profileData.cigsPerPack;
      const todaySave = Math.round(profileData.dailyCigs * pricePerCig);
      const sumSave = Math.round(totalDays * profileData.dailyCigs * pricePerCig);
      const sumCigs = totalDays * profileData.dailyCigs;
      
      // 格式化开始日期
      const streakStartCN = this._toCN(streakStart);
      
      // 更新全局数据
      const app = getApp();
      app.globalData.totalDays = totalDays;
      app.globalData.streakDays = streakDays;
      
      // 更新页面数据
      this.setData({
        streakDays: totalDays,
        streakStartCN: streakStartCN,
        todaySave: todaySave,
        sumSave: sumSave,
        sumCigs: sumCigs
      });
      
    } catch (error) {
      console.error('从LeanCloud计算统计数据失败:', error);
      // 如果LeanCloud计算失败，回退到本地数据
      this.calculateStatsFromLocal();
    }
  },
  
  // 从本地存储计算统计数据（备用方案）
  calculateStatsFromLocal() {
    try {
      // 使用已加载的用户配置数据
      const profileData = this.data.profileData || {
        dailyCigs: 20,
        pricePerPack: 20,
        cigsPerPack: 20
      };
      
      // 获取本地存储的打卡数据
      const signData = wx.getStorageSync('signData') || {};
      
      // 提取已签到的日期
      const signedDates = Object.keys(signData).filter(date => signData[date]?.signed);
      
      // 计算统计数据
      const totalDays = signedDates.length;
      
      // 计算连续打卡天数和开始日期
      const { streakDays, streakStart } = this._computeCurrentStreak(signedDates);
      
      // 使用配置数据计算节省金额
      const pricePerCig = profileData.pricePerPack / profileData.cigsPerPack;
      const todaySave = Math.round(profileData.dailyCigs * pricePerCig);
      const sumSave = Math.round(totalDays * profileData.dailyCigs * pricePerCig);
      const sumCigs = totalDays * profileData.dailyCigs;
      
      // 格式化开始日期
      const streakStartCN = this._toCN(streakStart);
      
      // 更新全局数据
      const app = getApp();
      app.globalData.totalDays = totalDays;
      app.globalData.streakDays = streakDays;
      
      // 更新页面数据
      this.setData({
        streakDays: totalDays,
        streakStartCN: streakStartCN,
        todaySave: todaySave,
        sumSave: sumSave,
        sumCigs: sumCigs
      });
      
    } catch (error) {
      console.error('从本地存储计算统计数据失败:', error);
    }
  },

  // 计算连续打卡开始日期（基于日期数组）
  _computeCurrentStreak(signedDates) {
    if (signedDates.length === 0) return { streakDays: 0, streakStart: null };
    
    // 排序日期
    signedDates.sort();
    
    const last = signedDates[signedDates.length - 1];
    let cur = new Date(last), streak = 1, start = last;
    
    for (let i = signedDates.length - 2; i >= 0; i--) {
      const d = new Date(signedDates[i]);
      const delta = Math.round((cur - d) / 86400000);
      if (delta === 1) {
        streak++;
        start = signedDates[i];
        cur = d;
      } else if (delta >= 2) {
        break;
      }
    }
    
    return { streakDays: streak, streakStart: start };
  },

  // 格式化日期为中文
  _toCN(ymd) {
    if (!ymd) return '--';
    const [y, m, d] = ymd.split('-');
    return `${y}年${+m}月${+d}日`;
  },

  /* 绑定亲友 */
  goBind() { wx.navigateTo({ url: '/pages/bind/index' }); },

  /* 一键打卡：只跳转到日历页并显示提示 */
  oneTapSign() {
    wx.navigateTo({ 
      url: '/pages/calendar/index?entryTip=1'
    });
  },

  openCalendar() { wx.navigateTo({ url: '/pages/calendar/index' }); },
  openAllMsgs() { wx.navigateTo({ url: '/pages/board/index' }); },

  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
});