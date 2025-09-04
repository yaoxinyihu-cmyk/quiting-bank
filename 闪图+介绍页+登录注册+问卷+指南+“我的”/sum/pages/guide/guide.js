Page({
    data: {
      currentIndex: 0,
      navItems: [
        { title: '戒烟必要性', anchor: 'section0' },
        { title: '准备与开始', anchor: 'section1' },
        { title: '应对戒断反应', anchor: 'section2' },
        { title: '防止复吸与坚持', anchor: 'section3' },
        { title: '健康与生活', anchor: 'section4' },
        { title: 'AI戒烟助手', anchor: 'ai' }
      ]
    },
  
    onNavTap(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ currentIndex: index });
  
      const navItem = this.data.navItems[index];
      if (navItem.title === 'AI戒烟助手') {
        wx.navigateTo({
          url: '/pages/ai-helper/ai-helper'
        });
        return;
      }
      wx.pageScrollTo({
        selector: `#${navItem.anchor}`,
        duration: 300
      });
    }
  });
  