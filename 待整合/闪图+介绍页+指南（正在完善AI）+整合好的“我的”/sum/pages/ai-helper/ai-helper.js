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
  
      const newMsg = {
        id: Date.now(),
        from: 'user',
        text
      };
  
      this.setData({
        messages: [...this.data.messages, newMsg],
        inputValue: '',
        scrollId: `msg${newMsg.id}`
      });
  
      // 模拟AI响应
      setTimeout(() => {
        const reply = this.getAIReply(text);
        const botMsg = {
          id: Date.now() + 1,
          from: 'bot',
          text: reply
        };
        this.setData({
          messages: [...this.data.messages, botMsg],
          scrollId: `msg${botMsg.id}`
        });
      }, 500);
    },
  
    getAIReply(userText) {
      // 简单关键词匹配（可接入云函数或API做智能回答）
      if (userText.includes('难受') || userText.includes('忍不住')) {
        return '当你感觉忍不住时，可以试试4D方法：拖延、深呼吸、喝水、做别的事。';
      }
      if (userText.includes('体重')) {
        return '戒烟后体重增加是正常的，你可以通过多喝水、吃健康零食和适量运动来控制。';
      }
      if (userText.includes('你好')) {
        return '你好，很高兴和你聊天。你是刚开始戒烟还是已经坚持一段时间了？';
      }
      return '坚持下去，你已经在变得更健康的路上了！';
    }
  });
  