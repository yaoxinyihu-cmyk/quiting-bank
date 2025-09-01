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
      // 若没有答案，则提示并返回
      wx.showToast({ title: '没有找到测试答案', icon: 'none' });
      setTimeout(()=> wx.navigateBack(), 1000);
      return;
    }
    this.setData({ answers });

    // 这里给出一个本地简单评分规则（仅用于占位）
    // 评分规则 (示例):
    // timeOptions 索引 0 (>60min)->0, 1->1, 2->2, 3(<=5min)->3
    // q2 yes->1 no->0
    // whichIndex 1 (早晨一支烟)->1 else 0
    // q4 yes->1 no->0
    // q5 yes->1 no->0 (若为 2 暂无经历，记0)
    const t = answers.timeIndex; // 0..3
    const timeScore = t === 0 ? 0 : (t === 1 ? 1 : (t === 2 ? 2 : 3));
    const q2s = answers.q2 ? answers.q2 : 0;
    const whichs = answers.whichIndex === 1 ? 1 : 0;
    const q4s = answers.q4 ? answers.q4 : 0;
    const q5s = (answers.q5 === 1) ? 1 : 0; // 2 或 0 => 0

    const score = timeScore + q2s + whichs + q4s + q5s;
    this.setData({ score });

    // 根据分数划分等级（示例阈值，可让后端替换）
    let label='';
    if (score <= 2) label = '轻度依赖';
    else if (score <= 4) label = '中度依赖';
    else label = '重度依赖';

    // 建议文本示例（后面可由 AI 返回更个性化建议）
    const advice = {
      '轻度依赖': '您的测试结果为轻度依赖。现在是戒烟的好时机！建议您：每天打卡、形成替代习惯（如刷牙、散步）、减少接触诱因。若需要更多建议，后端 AI 将提供个性化方案（此处为占位文本）。',
      '中度依赖': '您的测试结果为中度依赖。建议您：尝试制定逐步减量计划、在专业人员指导下考虑戒烟替代品（如尼古丁替代疗法）并结合行为干预。后续可连接 AI 评估获取个性化方案。',
      '重度依赖': '您的测试结果为重度依赖。建议尽快咨询专业医疗人员或戒烟门诊，考虑药物或综合干预，并配合行为疗法与支持小组。后端 AI 评估上线后将提供更具体方案。'
    };

    this.setData({
      resultLabel: label,
      adviceText: advice[label]
    });

    // 预留：如果需要把答案发到后端做 AI 评估，请在这里调用 wx.request。
    // 示例（占位）：
    // wx.request({
    //   url: 'https://your-backend.example.com/evaluate',
    //   method: 'POST',
    //   data: answers,
    //   success(res) {
    //     // 解析并设置 resultLabel/adviceText 等
    //   }
    // });
  },

  onBack() {
    wx.navigateBack();
  },

  onShare() {
    wx.showToast({ title: '分享功能占位', icon: 'none' });
    // 可以实现 wx.showShareMenu 或生成海报等
  },

  onAcknowledge() {
    // 关闭或返回首页
    wx.navigateBack();
  }
});
