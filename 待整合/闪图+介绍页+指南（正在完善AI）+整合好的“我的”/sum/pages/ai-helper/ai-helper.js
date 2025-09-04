Page({
    data: {
      messages: [
        { id: 1, from: 'bot', text: '你好，我是AI戒烟助手，我们可以聊聊你的戒烟目标和挑战。' }
      ],
      inputValue: '',
      scrollId: '',
      isLoading: false,
      // 保持 userId 不变，以保持会话连贯
      userId: 'smoking-quiter-user-001' 
    },
  
    onInput(e) {
      this.setData({
        inputValue: e.detail.value
      });
    },
  
    sendMessage() {
      const text = this.data.inputValue.trim();
      if (!text || this.data.isLoading) {
        return;
      }
  
      // 1. 在界面上立即显示用户发送的消息
      const newUserMessage = {
        id: Date.now(),
        from: 'user',
        text
      };
  
      this.setData({
        messages: [...this.data.messages, newUserMessage],
        inputValue: '',
        scrollId: `msg${newUserMessage.id}`,
        isLoading: true // 锁定按钮，防止重复发送
      });
  
      // 2. 调用 Coze API
      wx.request({
        url: 'https://api.coze.cn/v3/chat',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          // 【重要】替换成你自己的 API token
          'Authorization': 'Bearer cztei_hf9I1tUxgrH86ztL57G8TUSRKmlOBPQY6IVV0v3Vjo9ALe9dd0N3V63ZokG05MrPt'
        },
        data: {
          // 【重要】替换成你自己的 Bot ID
          bot_id: '7544583268244029440',
          user_id: this.data.userId,
          query: text,
          stream: false
        },
        success: (res) => {
          console.log('Coze API 响应：', res.data);
          const responseData = res.data;
  
          if (responseData.code === 0 && responseData.messages && responseData.messages.length > 0) {
            const botReplies = responseData.messages.filter(msg => msg.type === 'answer');
            
            if (botReplies.length > 0) {
              const replyText = botReplies.map(msg => msg.content).join('\n');
              const botMessage = {
                id: Date.now() + 1,
                from: 'bot',
                text: replyText
              };
              this.setData({
                messages: [...this.data.messages, botMessage],
                scrollId: `msg${botMessage.id}`
              });
            } else {
              this.showError('AI 助手没有回复，请检查 Bot 配置。');
            }
          } else {
            this.showError('API请求失败: ' + (responseData.msg || '未知错误'));
          }
        },
        fail: (err) => {
          console.error('API请求失败：', err);
          this.showError('网络连接失败: ' + (err.errMsg || '未知错误'));
        },
        complete: () => {
          this.setData({
            isLoading: false
          });
        }
      });
    },
  
    showError(message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 3000
      });
    },
    
    // 页面滚动到底部
    onReady: function() {
      this.scrollToBottom();
    },
    
    scrollToBottom: function() {
      setTimeout(() => {
        if (this.data.messages.length > 0) {
          this.setData({
            scrollId: `msg${this.data.messages[this.data.messages.length - 1].id}`
          });
        }
      }, 100);
    }
  });