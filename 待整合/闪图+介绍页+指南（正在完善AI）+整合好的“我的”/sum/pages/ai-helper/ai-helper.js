Page({
    data: {
      messages: [
        { id: 1, from: 'bot', text: '你好，我是AI戒烟助手，我们可以聊聊你的戒烟目标和挑战。' }
      ],
      inputValue: '',
      scrollId: ''
    },
  
    onInput(e) {
      this.setData({
        inputValue: e.detail.value
      });
    },
  
    sendMessage() {
      const text = this.data.inputValue.trim();
      if (!text) return;
  
      // 1. 在界面上立即显示用户发送的消息
      const newUserMessage = {
        id: Date.now(),
        from: 'user',
        text
      };
  
      this.setData({
        messages: [...this.data.messages, newUserMessage],
        inputValue: '',
        scrollId: `msg${newUserMessage.id}`
      });
  
      // 2. 调用 Coze API
      wx.request({
        url: 'https://api.coze.cn/v3/chat',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          // 【重要】将 'YOUR_COZE_API_TOKEN' 替换为你自己的 API token
          'Authorization': 'Bearer cztei_hNG01hknrbB6YPP05dPIwhDsAVOQkAE9coemgL7CTgmb7TFMFzmnbYa18ktVeChzs'
        },
        data: {
          // 【重要】将 'YOUR_BOT_ID' 替换为你的 Coze Bot ID
          bot_id: 'ai戒烟助手小猪',
          user_id: `smoking-quiter`, // 使用一个唯一的 ID
          query: text
        },
        success: (res) => {
          console.log('Coze API 响应：', res.data);
          const responseData = res.data;
  
          // 3. 处理 API 响应并更新界面
          if (responseData && responseData.messages && responseData.messages.length > 0) {
            // 寻找 type 为 'answer' 的消息，通常这是 AI 的回复
            const aiReply = responseData.messages.find(msg => msg.type === 'answer');
            if (aiReply) {
              const botMessage = {
                id: Date.now() + 1,
                from: 'bot',
                text: aiReply.content
              };
              this.setData({
                messages: [...this.data.messages, botMessage],
                scrollId: `msg${botMessage.id}`
              });
            }
          } else {
            // 如果没有有效的回复
            this.showError('未能获取到AI回复。');
          }
        },
        fail: (err) => {
          console.error('API请求失败：', err);
          this.showError('网络连接失败，请检查网络和域名配置。');
        }
      });
    },
  
    // 辅助函数，用于显示错误提示
    showError(message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    }
  });
  