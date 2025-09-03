Component({
    properties: {
      showBack: {
        type: Boolean,
        value: false
      }
    },
    methods: {
      goBack() {
        wx.navigateBack({ delta: 1 });
      }
    }
  });
  