const AV = require("../../libs/av-core-min.js");
const app = getApp(); // 获取App实例

Page({
  data: {
    username: '',
    password: '',
  },
  
  inputUsername(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  
  inputPassword(e) {
    this.setData({
      password: e.detail.value,
    })
  },
  
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register',  // 跳转到注册页面
    });
  },
  
  goToLogin() {
    let username = this.data.username
    let password = this.data.password
    
    AV.User.logIn(username, password).then(
      (userLogined) => {
        // 登录成功后清空本地数据
        app.clearUserData();
        
        // 保存当前用户ID
        wx.setStorageSync('lastUserId', userLogined.id);
        
        // 更新App实例中的当前用户
        app.globalData.currentUser = userLogined;
        
        wx.showToast({
          title: userLogined.get('name') || userLogined.getUsername() + "欢迎登录",
          icon: "success"
        })
        
        // 加载用户数据和配置
        app.loadCheckInData();
        app.loadUserProfile();
        
        wx.switchTab({
          url: "/pages/index/index", // 跳转到主页
        })
      }, (error) => {
        wx.showToast({
          title: JSON.stringify(error),
          icon: "error"
        })
      }
    )
  },
})