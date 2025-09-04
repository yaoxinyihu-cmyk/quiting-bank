// pages/step2/step2.js
Page({
  data: {
    smokeCounts: ['<5支', '5-10支', '10-20支', '20+支'],
    drugOptions: ['是', '否'],
    illnessOptions: ['是', '否'],
    smokeCount: '',
    price: '',
    drug: '',
    illness: ''
  },
  
  onSmokeCountChange(e) {
    this.setData({ smokeCount: this.data.smokeCounts[e.detail.value] });
  },
  
  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },
  
  onDrugChange(e) {
    this.setData({ drug: this.data.drugOptions[e.detail.value] });
  },
  
  onIllnessChange(e) {
    this.setData({ illness: this.data.illnessOptions[e.detail.value] });
  },
  
  nextStep() {
    // 简单验证必填字段
    if (!this.data.smokeCount || !this.data.price) {
      wx.showToast({
        title: '请填写完整吸烟信息',
        icon: 'none'
      });
      return;
    }
    
    const app = getApp();
    app.globalData.tempProfile = {
      ...app.globalData.tempProfile, // 保留step1的数据
      smokeCount: this.data.smokeCount,
      price: this.data.price ? Number(this.data.price) : null, // 转换为数字类型存储
      drug: this.data.drug,
      illness: this.data.illness
    };
    
    console.log('暂存的数据 step2:', app.globalData.tempProfile);
    wx.navigateTo({ url: '/pages/step3/step3' });
  }
});
  