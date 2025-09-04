// 评估表单页逻辑
Page({
  data: {
    // 选项数据
    timeOptions: ['>60分钟','31-60分钟','6-30分钟','<=5分钟'],
    timeIndex: null,
    timeIndexText: '请选择时间',

    whichOptions: ['其他时间','早晨一支烟'],
    whichIndex: null,
    whichIndexText: '请选择',

    // 单项选择默认值（'1'、'0'、'2'等以字符串形式保存，便于 radio 比较）
    q2: null, // 是否在很多吸烟场所难以控制（是:1 否:0）
    q4: null, // 早晨第一个小时是否比其他时间吸更多（是:1 否:0）
    q5: null  // 卧病在床是否吸烟（是:1 否:0 暂无:2）
  },

  // 返回（若是在 tabBar 中可能不需要）
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

  // 点击确认，先做本地简单校验并保存，跳转到结果页
  onConfirm() {
    // 简单校验：确保关键题目不为空（可根据需求放宽）
    if (this.data.timeIndex === null) {
      wx.showToast({ title: '请选择起床后吸烟时间', icon: 'none' });
      return;
    }
    if (this.data.q2 === null || this.data.whichIndex === null || this.data.q4 === null || this.data.q5 === null) {
      wx.showToast({ title: '请完成所有题目', icon: 'none' });
      return;
    }

    // 组装答案对象
    const answers = {
      timeIndex: Number(this.data.timeIndex),
      q2: Number(this.data.q2),
      whichIndex: Number(this.data.whichIndex),
      q4: Number(this.data.q4),
      q5: Number(this.data.q5)
    };

    // 暂时本地保存，结果页读取。将来可改为 wx.request 提交到后端 AI 评估。
    wx.setStorageSync('addictionAnswers', answers);

    // 跳转到结果页
    wx.navigateTo({
      url: '/pages/addiction-result/addiction-result'
    });
  }
});
