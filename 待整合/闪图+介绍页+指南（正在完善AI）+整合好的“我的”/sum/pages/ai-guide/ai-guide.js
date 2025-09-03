Page({
    data: {
      messages: [
        {
          type: 'ai',
          text: '你好，我是戒烟助手小猪，目标是帮你成功戒烟。迈出第一步，跟我聊聊吧。'
        }
      ],
      userInput: '',
      isLoading: false, // 用于控制发送按钮状态
    },
  
    // 监听输入框
    onInput(e) {
      this.setData({
        userInput: e.detail.value
      });
    },
  
    // 发送消息
    sendMessage() {
      const userInput = this.data.userInput.trim();
      if (!userInput || this.data.isLoading) {
        return;
      }
  
      // 1. 在界面上立即显示用户发送的消息
      const newMessages = [...this.data.messages, { type: 'user', text: userInput }];
      this.setData({
        messages: newMessages,
        userInput: '',
        isLoading: true // 锁定按钮，防止重复点击
      });
  
      // 2. 调用扣子的 API
      wx.request({
        url: 'https://api.coze.cn/v3/chat',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          // 【重要】替换成你自己的 API token
          'Authorization': 'Bearer cztei_hvdghlKj1x1VnHndyvDc1fiuxAsAtWHrGvrGrHYfftzKTZaZRoJOlxwqHajsKT20j' 
        },
        data: {
          bot_id: '7544583268244029440',
          user_id: 'smoking-quiter-user', // 可以是任何唯一的 ID
          query: userInput
        },
        success: (res) => {
          console.log('API响应：', res.data);
          const responseData = res.data;
  
          // 3. 处理 API 响应并更新界面
          if (responseData.status === 'success' && responseData.messages && responseData.messages.length > 0) {
            // 扣子 API 的响应数据结构可能会有变化，需要根据实际情况解析
            const aiResponseText = responseData.messages[0].content;
            const updatedMessages = [...this.data.messages, { type: 'ai', text: aiResponseText }];
            this.setData({
              messages: updatedMessages
            });
          } else {
            // 如果响应失败或格式不正确
            this.showError('未能获取到AI回复，请稍后再试。');
          }
        },
        fail: (err) => {
          console.error('API请求失败：', err);
          this.showError('网络连接失败，请检查网络。');
        },
        complete: () => {
          this.setData({
            isLoading: false // 请求完成，解锁按钮
          });
        }
      });
    },
    
    // 辅助函数：显示错误提示
    showError(message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    }
  });