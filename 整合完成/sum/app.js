// app.js
const AV = require("./libs/av-core-min.js");
const adapters = require("./libs/leancloud-adapters-weapp.js");

AV.setAdapters(adapters);
AV.init({
  appId: "lSQllNs8JQBywoskZhw5EwC6-gzGzoHsz",
  appKey: "cj3Z4lfue4CAeq0SPH1tjSvq",
  serverURL: "https://lsqllNs8.lc-cn-n1-shared.com",
});

App({
  globalData: {
    currentUser: null,
    tempProfile: {},
    totalDays: 0, // 全局打卡天数
    streakDays: 0, // 连续打卡天数
    relapseCount: 0, // 复吸次数
    userProfile: null // 存储用户配置信息
  },

  onLaunch() {
    console.log('App Launch');
    
    try {
      // 初始化本地存储结构
      const init = wx.getStorageSync('signData');
      if (!init) {
        wx.setStorageSync('signData', {});
      }

      // 初始化时检查是否有已登录的用户
      const user = AV.User.current();
      if (user) {
        console.log('发现已登录用户:', user.id);
        
        // 检查本地存储中是否有用户ID记录
        const lastUserId = wx.getStorageSync('lastUserId');
        console.log('上次登录用户ID:', lastUserId, '当前用户ID:', user.id);
        
        // 如果用户ID变更，清除之前的打卡数据
        if (lastUserId && lastUserId !== user.id) {
          console.log('检测到用户变更，清除本地打卡数据');
          wx.removeStorageSync('signData');
          wx.setStorageSync('signData', {});
          // 同时清除其他可能包含用户数据的本地存储
          wx.removeStorageSync('userProfileCache');
        }
        
        // 保存当前用户ID
        wx.setStorageSync('lastUserId', user.id);
        
        this.globalData.currentUser = user;
        
        // 验证用户session是否有效
        user.isAuthenticated().then(authenticated => {
          if (authenticated) {
            console.log('用户session有效:', user.getUsername());
            this.globalData.currentUser = user;
            
            // 加载用户打卡数据
            this.loadCheckInData();
            // 加载用户配置
            this.loadUserProfile();
          } else {
            console.log('用户登录已过期');
            this.globalData.currentUser = null;
            // 清除用户ID记录
            wx.removeStorageSync('lastUserId');
          }
        }).catch(error => {
          console.error('验证用户登录状态失败:', error);
          this.globalData.currentUser = null;
          // 清除用户ID记录
          wx.removeStorageSync('lastUserId');
        });
      } else {
        console.log('没有已登录用户');
        // 没有用户登录时清除用户ID记录
        wx.removeStorageSync('lastUserId');
      }
    } catch (error) {
      console.error('App onLaunch 错误:', error);
    }
  },

  // 加载用户配置
  async loadUserProfile() {
    try {
      const currentUser = AV.User.current();
      if (!currentUser) {
        console.log('loadUserProfile: 无当前用户');
        return;
      }

      // 先检查是否有缓存的配置
      const cachedProfile = wx.getStorageSync('userProfileCache');
      if (cachedProfile && cachedProfile.userId === currentUser.id) {
        console.log('使用缓存的用户配置');
        this.globalData.userProfile = cachedProfile.data;
        return;
      }

      // 查询用户配置
      const Profile = AV.Object.extend('Profile');
      const query = new AV.Query(Profile);
      query.equalTo('user', currentUser);
      const results = await query.find();
      
      if (results.length > 0) {
        const profileData = {
          dailyCigs: results[0].get('smokeCount') || 20,
          pricePerPack: results[0].get('pricePerPack') || 20,
          cigsPerPack: results[0].get('cigsPerPack') || 20
        };
        
        this.globalData.userProfile = profileData;
        
        // 缓存用户配置
        wx.setStorageSync('userProfileCache', {
          userId: currentUser.id,
          data: profileData,
          timestamp: Date.now()
        });
      } else {
        // 使用默认值
        const defaultProfile = {
          dailyCigs: 20,
          pricePerPack: 20,
          cigsPerPack: 20
        };
        
        this.globalData.userProfile = defaultProfile;
        
        // 缓存默认配置
        wx.setStorageSync('userProfileCache', {
          userId: currentUser.id,
          data: defaultProfile,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('加载用户配置失败:', error);
      // 使用默认值
      this.globalData.userProfile = {
        dailyCigs: 20,
        pricePerPack: 20,
        cigsPerPack: 20
      };
    }
  },

  // 加载用户打卡数据
  async loadCheckInData() {
    try {
      const currentUser = AV.User.current();
      if (!currentUser) {
        console.log('loadCheckInData: 无当前用户');
        return;
      }

      // 尝试查询用户的打卡记录
      try {
        const CheckIn = AV.Object.extend('CheckIn');
        const query = new AV.Query(CheckIn);
        query.equalTo('user', currentUser);
        query.descending('date');
        const results = await query.find();

        // 处理打卡数据
        const signData = {};
        let checkedInDates = [];
        
        results.forEach(item => {
          const date = item.get('date');
          const dateStr = date.toISOString().split('T')[0];
          signData[dateStr] = {
            signed: item.get('signed'),
            mood: item.get('mood') || ''
          };
          if (item.get('signed')) {
            checkedInDates.push(dateStr);
          }
        });

        // 保存到本地存储
        wx.setStorageSync('signData', signData);
        
        // 计算打卡统计
        this.calculateCheckInStats(checkedInDates);
      } catch (error) {
        // 如果表不存在或其他错误，使用本地存储的数据
        console.warn('从LeanCloud加载打卡数据失败，使用本地数据:', error);
        const signData = wx.getStorageSync('signData') || {};
        const checkedInDates = Object.keys(signData).filter(k => signData[k]?.signed);
        this.calculateCheckInStats(checkedInDates);
      }
    } catch (error) {
      console.error('加载打卡数据失败:', error);
    }
  },

  // 计算打卡统计信息
  calculateCheckInStats(checkedInDates) {
    if (!checkedInDates || checkedInDates.length === 0) {
      this.globalData.totalDays = 0;
      this.globalData.streakDays = 0;
      this.globalData.relapseCount = 0;
      return;
    }

    // 排序日期
    checkedInDates.sort();
    
    // 计算连续打卡天数和复吸次数
    let currentStreak = 1;
    let maxStreak = 1;
    let relapseCount = 0;
    
    if (checkedInDates.length > 1) {
      let lastDate = new Date(checkedInDates[0]);
      
      for (let i = 1; i < checkedInDates.length; i++) {
        const currentDate = new Date(checkedInDates[i]);
        const dayDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // 连续打卡
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else if (dayDiff > 1) {
          // 中断打卡，算作复吸
          relapseCount++;
          currentStreak = 1;
        }
        
        lastDate = currentDate;
      }
    }

    this.globalData.totalDays = checkedInDates.length;
    this.globalData.streakDays = maxStreak;
    this.globalData.relapseCount = relapseCount;
  },
  
  // 全局方法：获取用户配置
  async getUserProfile() {
    try {
      const currentUser = AV.User.current();
      if (!currentUser) return null;

      // 如果已经有缓存的配置，直接返回
      if (this.globalData.userProfile) {
        return this.globalData.userProfile;
      }
      
      // 检查本地缓存
      const cachedProfile = wx.getStorageSync('userProfileCache');
      if (cachedProfile && cachedProfile.userId === currentUser.id) {
        this.globalData.userProfile = cachedProfile.data;
        return this.globalData.userProfile;
      }
      
      // 查询用户配置
      const Profile = AV.Object.extend('Profile');
      const query = new AV.Query(Profile);
      query.equalTo('user', currentUser);
      const results = await query.find();
      
      if (results.length > 0) {
        this.globalData.userProfile = {
          dailyCigs: results[0].get('smokeCount') || 20,
          pricePerPack: results[0].get('pricePerPack') || 20,
          cigsPerPack: results[0].get('cigsPerPack') || 20
        };
        
        // 缓存用户配置
        wx.setStorageSync('userProfileCache', {
          userId: currentUser.id,
          data: this.globalData.userProfile,
          timestamp: Date.now()
        });
        
        return this.globalData.userProfile;
      }
      
      // 使用默认值
      this.globalData.userProfile = {
        dailyCigs: 20,
        pricePerPack: 20,
        cigsPerPack: 20
      };
      
      // 缓存默认配置
      wx.setStorageSync('userProfileCache', {
        userId: currentUser.id,
        data: this.globalData.userProfile,
        timestamp: Date.now()
      });
      
      return this.globalData.userProfile;
    } catch (error) {
      console.error('获取用户配置失败:', error);
      // 使用默认值
      this.globalData.userProfile = {
        dailyCigs: 20,
        pricePerPack: 20,
        cigsPerPack: 20
      };
      return this.globalData.userProfile;
    }
  },
  
  // 清除用户数据（用于登出或切换用户）
  clearUserData() {
    console.log('清除用户数据');
    wx.removeStorageSync('signData');
    wx.removeStorageSync('lastUserId');
    wx.removeStorageSync('userProfileCache');
    
    // 重新初始化signData
    wx.setStorageSync('signData', {});
    
    // 重置全局数据
    this.globalData.currentUser = null;
    this.globalData.userProfile = null;
    this.globalData.totalDays = 0;
    this.globalData.streakDays = 0;
    this.globalData.relapseCount = 0;
  }
});