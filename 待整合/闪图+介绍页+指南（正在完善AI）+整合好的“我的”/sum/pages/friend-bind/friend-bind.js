Page({
  data: {
    // 二维码URL（后端实现前，先用占位图片）
    qrCodeUrl: '/assets/images/qrcode.png'
  }
});
    // 预留：后续对接 wx.scanCode 或后端生成码的API
    /*
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果', res);
        // TODO: 调用后端接口进行绑定
      },
      fail: (err) => {
        console.error('扫码失败', err);
      }
    });
    */

