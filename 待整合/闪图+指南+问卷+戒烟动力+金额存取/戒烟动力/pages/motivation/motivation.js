Page({
    data: {
      // 状态栏高度（自定义导航栏适配）
      statusBarHeight: 0,
  
      // 原有数据
      date: '',
      slogan: '',
      showMessageBoard: false,
      messages: [
        {
          avatar: '/images/avatar1.png',
          name: '林丽123',
          time: '今天 10:37',
          text: '老公，看到你为戒烟付出的努力，真的很心疼又敬佩。无论这个过程有多难，我都会陪着你。相信你一定能戒烟成功！我们一起加油✨'
        },
        {
          avatar: '/images/avatar2.png',
          name: '宝贝',
          time: '8月12日 14:20',
          text: '爸爸我为你加油！为了健康多陪我和妈妈 ❤️ 你是我最勇敢的英雄！'
        },
        {
          avatar: '/images/avatar3.png',
          name: '我',
          time: '8月11日 8:00',
          text: '我必须彻底戒烟！为了健康的身体，也为了陪家人走更远的路。每一次抗拒诱惑都是自我胜利。我相信自己的决心，嘴馋是暂时的，胜利属于坚持者。绝不放弃！'
        }
      ]
    },
  
    onLoad() {
      // 获取状态栏高度，适配不同机型（刘海屏等）
      const sysInfo = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: sysInfo.statusBarHeight
      });
    },
  
    // 返回上一个页面
    goBack() {
      wx.navigateBack({ delta: 1 });
    },
  
    // 选择日期
    onDateChange(e) {
      this.setData({ date: e.detail.value });
    },
  
    // 口号输入
    onSloganInput(e) {
      this.setData({ slogan: e.detail.value });
    },
  
    // 显示/隐藏留言板
    toggleMessageBoard() {
      this.setData({ showMessageBoard: !this.data.showMessageBoard });
    },
  
    // 弹窗阻止冒泡
    stopMask() {}
  });
  