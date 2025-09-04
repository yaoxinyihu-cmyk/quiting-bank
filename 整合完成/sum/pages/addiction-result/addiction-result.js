// 评估结果页逻辑
const AV = require('../../libs/av-core-min.js'); // 引入 LeanCloud SDK

Page({
  data: {
    answers: null,
    score: 0,
    resultLabel: '',
    adviceText: ''
  },

  onLoad() {
    // 读取本地存储的答案
    const answers = wx.getStorageSync('addictionAnswers') || null;
    if (!answers) {
      // 若没有答案，则尝试从LeanCloud获取最新记录
      this.fetchLatestAssessment();
      return;
    }
    
    this.setData({ 
      answers,
      score: answers.score,
      resultLabel: answers.resultLabel,
      adviceText: answers.adviceText
    });
  },

  // 从LeanCloud获取最新评估记录
  fetchLatestAssessment() {
    const currentUser = AV.User.current();
    if (!currentUser) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    
    const query = new AV.Query('AddictionAssessment');
    query.equalTo('user', currentUser);
    query.descending('createdAt'); // 获取最新的记录
    query.limit(1);
    
    query.first().then(assessment => {
      if (assessment) {
        const data = assessment.attributes;
        this.setData({
          answers: data,
          score: data.score,
          resultLabel: data.resultLabel,
          adviceText: data.adviceText
        });
      } else {
        wx.showToast({ title: '没有找到测试记录', icon: 'none' });
        setTimeout(() => wx.navigateBack({ delta: 2 }), 1000);
      }
    }).catch(error => {
      console.error('获取评估记录失败:', error);
      wx.showToast({ title: '获取数据失败', icon: 'none' });
      setTimeout(() => wx.navigateBack({ delta: 2 }), 1000);
    });
  },

  onBack() {
    // 返回两层页面
    wx.navigateBack({
      delta: 2
    });
  },

  onShare() {
    wx.showToast({ title: '分享功能占位', icon: 'none' });
  },

  onAcknowledge() {
    // 返回两层页面
    wx.navigateBack({
      delta: 2
    });
  }
});