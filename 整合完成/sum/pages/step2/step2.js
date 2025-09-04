Page({
    data: {
      smokeCounts: ['<5支', '5-10支', '10-20支', '20+支'],
      drugOptions: ['是', '否'],
      illnessOptions: ['是', '否'],
      smokeCount: '',
      price: '',
      drug: '',
      illness: ''
    },
    onSmokeCountChange(e) {
      this.setData({ smokeCount: this.data.smokeCounts[e.detail.value] });
    },
    onPriceInput(e) {
      this.setData({ price: e.detail.value });
    },
    onDrugChange(e) {
      this.setData({ drug: this.data.drugOptions[e.detail.value] });
    },
    onIllnessChange(e) {
      this.setData({ illness: this.data.illnessOptions[e.detail.value] });
    },
    nextStep() {
      wx.navigateTo({ url: '/pages/step3/step3' });
    }
  });
  