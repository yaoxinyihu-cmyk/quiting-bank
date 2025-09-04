// 评估表单页逻辑
const AV = require('../../libs/av-core-min.js'); // 引入 LeanCloud SDK

Page({
  data: {
    // 选项数据
    timeOptions: ['>60分钟','31-60分钟','6-30分钟','<=5分钟'],
    timeIndex: null,
    timeIndexText: '请选择时间',

    whichOptions: ['其他时间','早晨一支烟'],
    whichIndex: null,
    whichIndexText: '请选择',

    // 单项选择默认值
    q2: null,
    q4: null,
    q5: null,
    
    // 用于存储已有的评估记录ID（如果有）
    existingRecordId: null
  },

  onLoad() {
    // 检查用户是否已登录
    const currentUser = AV.User.current();
    if (!currentUser) {
      wx.showToast({ 
        title: '请先登录', 
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login' // 请根据您的登录页面路径修改
        });
      }, 2000);
      return;
    }
    
    // 尝试获取用户已有的评估记录
    this.fetchExistingAssessment();
  },

  // 获取用户已有的评估记录
  fetchExistingAssessment() {
    const currentUser = AV.User.current();
    const query = new AV.Query('AddictionAssessment');
    query.equalTo('user', currentUser);
    query.descending('createdAt'); // 获取最新的记录
    
    query.first().then(record => {
      if (record) {
        console.log('找到已有的评估记录:', record.attributes);
        this.setData({ existingRecordId: record.id });
        
        // 可选：填充已有数据到表单
        this.populateForm(record.attributes);
      }
    }).catch(error => {
      console.error('查询评估记录失败:', error);
    });
  },

  // 填充已有数据到表单（可选功能）
  populateForm(data) {
    // 根据存储的数据填充表单
    this.setData({
      timeIndex: data.timeIndex,
      timeIndexText: this.data.timeOptions[data.timeIndex],
      whichIndex: data.whichIndex,
      whichIndexText: this.data.whichOptions[data.whichIndex],
      q2: data.q2.toString(),
      q4: data.q4.toString(),
      q5: data.q5.toString()
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 时间选择改变
  onTimeChange(e) {
    const idx = e.detail.value;
    this.setData({
      timeIndex: idx,
      timeIndexText: this.data.timeOptions[idx]
    });
  },

  // 哪一只烟改变
  onWhichChange(e) {
    const idx = e.detail.value;
    this.setData({
      whichIndex: idx,
      whichIndexText: this.data.whichOptions[idx]
    });
  },

  // 单选题回调
  onQ2Change(e) { this.setData({ q2: e.detail.value }); },
  onQ4Change(e) { this.setData({ q4: e.detail.value }); },
  onQ5Change(e) { this.setData({ q5: e.detail.value }); },

  // 点击确认，保存到LeanCloud并跳转到结果页
  async onConfirm() {
    // 简单校验
    if (this.data.timeIndex === null) {
      wx.showToast({ title: '请选择起床后吸烟时间', icon: 'none' });
      return;
    }
    if (this.data.q2 === null || this.data.whichIndex === null || this.data.q4 === null || this.data.q5 === null) {
      wx.showToast({ title: '请完成所有题目', icon: 'none' });
      return;
    }

    // 计算分数
    const score = this.calculateScore();
    
    // 获取结果标签和建议
    const { resultLabel, adviceText } = this.getResult(score);
    
    try {
      // 保存到LeanCloud
      await this.saveToLeanCloud(score, resultLabel, adviceText);
      
      // 本地存储答案和结果
      const answers = {
        timeIndex: Number(this.data.timeIndex),
        q2: Number(this.data.q2),
        whichIndex: Number(this.data.whichIndex),
        q4: Number(this.data.q4),
        q5: Number(this.data.q5),
        score,
        resultLabel,
        adviceText
      };
      
      wx.setStorageSync('addictionAnswers', answers);

      // 跳转到结果页
      wx.navigateTo({
        url: '/pages/addiction-result/addiction-result'
      });
    } catch (error) {
      console.error('保存评估数据失败:', error);
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  // 计算分数
  calculateScore() {
    const t = this.data.timeIndex;
    const timeScore = t === 0 ? 0 : (t === 1 ? 1 : (t === 2 ? 2 : 3));
    const q2s = Number(this.data.q2);
    const whichs = this.data.whichIndex === 1 ? 1 : 0;
    const q4s = Number(this.data.q4);
    const q5s = (Number(this.data.q5) === 1) ? 1 : 0;

    return timeScore + q2s + whichs + q4s + q5s;
  },

  // 获取结果标签和建议
  getResult(score) {
    let resultLabel = '';
    if (score <= 2) resultLabel = '轻度依赖';
    else if (score <= 4) resultLabel = '中度依赖';
    else resultLabel = '重度依赖';

    const advice = {
      '轻度依赖': '您的测试结果为轻度依赖。现在是戒烟的好时机！建议您：每天打卡、形成替代习惯（如刷牙、散步）、减少接触诱因。若需要更多建议，后端 AI 将提供个性化方案（此处为占位文本）。',
      '中度依赖': '您的测试结果为中度依赖。建议您：尝试制定逐步减量计划、在专业人员指导下考虑戒烟替代品（如尼古丁替代疗法）并结合行为干预。后续可连接 AI 评估获取个性化方案。',
      '重度依赖': '您的测试结果为重度依赖。建议尽快咨询专业医疗人员或戒烟门诊，考虑药物或综合干预，并配合行为疗法与支持小组。后端 AI 评估上线后将提供更具体方案。'
    };

    return {
      resultLabel,
      adviceText: advice[resultLabel]
    };
  },

  // 保存到LeanCloud - 修复版
  async saveToLeanCloud(score, resultLabel, adviceText) {
    const currentUser = AV.User.current();
    
    try {
      // 首先查询用户是否已有评估记录
      const query = new AV.Query('AddictionAssessment');
      query.equalTo('user', currentUser);
      const existingRecords = await query.find();
      
      let assessment;
      
      if (existingRecords.length > 0) {
        // 如果已有记录，使用第一条记录进行更新（删除其他记录）
        assessment = existingRecords[0];
        
        // 删除其他记录（确保只有一个评估记录）
        if (existingRecords.length > 1) {
          const recordsToDelete = existingRecords.slice(1);
          await AV.Object.destroyAll(recordsToDelete);
        }
      } else {
        // 如果没有记录，创建新记录
        assessment = new AV.Object('AddictionAssessment');
      }
      
      // 设置字段值
      assessment.set('user', currentUser);
      assessment.set('timeIndex', Number(this.data.timeIndex));
      assessment.set('q2', Number(this.data.q2));
      assessment.set('whichIndex', Number(this.data.whichIndex));
      assessment.set('q4', Number(this.data.q4));
      assessment.set('q5', Number(this.data.q5));
      assessment.set('score', score);
      assessment.set('resultLabel', resultLabel);
      assessment.set('adviceText', adviceText);
      
      // 保存到LeanCloud
      await assessment.save();
      console.log('评估数据保存成功');
      
    } catch (error) {
      console.error('保存评估数据失败:', error);
      throw error;
    }
  }
});