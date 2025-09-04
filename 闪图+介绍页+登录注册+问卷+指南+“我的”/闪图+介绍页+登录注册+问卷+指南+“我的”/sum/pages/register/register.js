const AV = require("../../libs/av-core-min.js");

Page({
  data: {
    name: '',
    username: '',
    password: '',
  },
  
  inputName(e) {
    this.setData({
      name: e.detail.value,
    });
  },
  
  inputUsername(e) {
    this.setData({
      username: e.detail.value,
    });
  },
  
  inputPassword(e) {
    this.setData({
      password: e.detail.value,
    });
  },
  
  // 修正后的注册方法
  register() {
    let { name, username, password } = this.data;
    
    // 表单验证
    if (!username || !password) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none'
      });
      return;
    }
    
    if (password.length < 6) {
      wx.showToast({
        title: '密码长度至少6个字符',
        icon: 'none'
      });
      return;
    }
    
    // 创建用户
    let user = new AV.User();
    user.setUsername(username);
    user.setPassword(password);
    
    // 添加额外信息（可选）
    if (name) {
      user.set('name', name);
    }
    
    // 使用signUp方法注册
    user.signUp().then(() => {
      wx.showToast({
        title: "注册成功",
        icon: "success"
      });
      wx.redirectTo({
        url: '/pages/step1/step1',
      });
    }).catch(error => {
      console.error('注册失败:', error);
      wx.showToast({
        title: error.message || '注册失败',
        icon: "none"
      });
    });
  },
});