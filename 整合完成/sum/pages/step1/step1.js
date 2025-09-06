// pages/step1/step1.js
Page({
  data: {
    nickname: '',
    genders: ['男', '女'],
    educations: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士', '其他'],
    smokeAges: ['<1年', '1-5年', '5-10年', '10年以上'],
    gender: '',
    birthday: '',
    education: '',
    smokeAge: ''
  },
  
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },
  
  onGenderChange(e) {
    this.setData({ gender: this.data.genders[e.detail.value] });
  },
  
  onDateChange(e) {
    this.setData({ birthday: e.detail.value });
  },
  
  onEduChange(e) {
    this.setData({ education: this.data.educations[e.detail.value] });
  },
  
  onSmokeAgeChange(e) {
    this.setData({ smokeAge: this.data.smokeAges[e.detail.value] });
  },
  
  nextStep() {
    // 简单验证必填字段
    if (!this.data.nickname || !this.data.gender || !this.data.birthday) {
      wx.showToast({
        title: '请填写完整基本信息',
        icon: 'none'
      });
      return;
    }
    
    // 将本页数据暂存到全局
    const app = getApp();
    app.globalData.tempProfile = {
      ...app.globalData.tempProfile, // 保留之前页面的数据（如果有）
      nickname: this.data.nickname,
      gender: this.data.gender,
      birthday: this.data.birthday,
      education: this.data.education,
      smokeAge: this.data.smokeAge
    };
    
    console.log('暂存的数据 step1:', app.globalData.tempProfile);
    wx.navigateTo({ url: '/pages/step2/step2' });
  }
});