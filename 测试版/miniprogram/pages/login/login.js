const AV = require("../../libs/av-core-min.js");
Page({
  data:{
    username:'',
    password:'',
  },
  inputUsername(e){
    this.setData({
      username:e.detail.value,
    })
  },
  inputPassword(e){
    this.setData({
      password:e.detail.value,
    })
  },
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register',  // 跳转到注册页面
    });
  },
  goToLogin(){
    let username = this.data.username
    let password = this.data.password
    AV.User.logIn(username,password).then(
      (userLogined)=>{
        wx.showToast({
          title: userLogined.name + "欢迎登录",
          icon:"success"
        })
        wx.redirectTo({
          url: "/pages/register/register" ,//把里面的路径改至首页，即跳转到主页
        })
      },(error)=>{
        wx.showToast({
          title: JSON.stringify(error),
          icon:"error"
        })
      }
    )
  },
});