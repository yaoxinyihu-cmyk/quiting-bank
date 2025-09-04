// pages/step3/step3.js
const AV = require('../../libs/av-core-min.js'); // 引入LeanCloud SDK

Page({
  data: {
    slogan: '',
    startDate: '',
    endDate: ''
  },
  
  onSloganInput(e) {
    this.setData({ slogan: e.detail.value });
  },
  
  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
  },
  
  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
  },
  
  finish() {
    const app = getApp();
    const currentUser = app.globalData.currentUser;
    
    // 检查用户是否登录
    if (!currentUser) {
      wx.showToast({
        title: '用户未登录，请重新登录',
        icon: 'none',
        duration: 2000
      });
      
      // 跳转到登录页面
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login', // 请根据您的实际登录页面路径修改
        });
      }, 2000);
      return;
    }
    
    // 简单验证必填字段
    if (!this.data.slogan || !this.data.startDate) {
      wx.showToast({
        title: '请填写戒烟口号和开始日期',
        icon: 'none'
      });
      return;
    }
    
    // 获取所有暂存的数据
    const profileData = {
      ...app.globalData.tempProfile, // 包含step1和step2的数据
      slogan: this.data.slogan,
      startDate: this.data.startDate ? new Date(this.data.startDate) : null,
      endDate: this.data.endDate ? new Date(this.data.endDate) : null,
      user: currentUser // 关联当前用户
    };
    
    // 创建一个新的Profile对象:cite[1]:cite[5]
    const Profile = AV.Object.extend('Profile');
    const profile = new Profile();
    
    // 设置Profile的各个字段:cite[1]
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        profile.set(key, profileData[key]);
      }
    });
    
    // 设置一个指向当前用户的Pointer:cite[1]
    profile.set('user', currentUser);
    
    // 保存到LeanCloud:cite[1]:cite[5]
    profile.save().then(() => {
        console.log('问卷数据保存成功');
        wx.showToast({
          title: '问卷完成！',
          icon: 'success',
          duration: 1000
        });
        
        // 清空临时数据
        app.globalData.tempProfile = {};
        
        // 延迟1秒后跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/index/index",
          });
        }, 1000);
      })
      .catch(error => {
        console.error('保存失败:', error);
        let errorMsg = '保存失败，请重试';
        
        // 根据错误码提供更具体的错误信息:cite[1]
        if (error.code === 137) {
          errorMsg = '无效的数据格式，请检查填写内容';
        } else if (error.code === 1) {
          errorMsg = '网络连接失败，请检查网络设置';
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
      });
  }
});