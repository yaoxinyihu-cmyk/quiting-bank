Page({
    data: {
      nickname: '',
      genders: ['男', '女'],
      educations: ['高中', '大专', '本科', '硕士', '博士'],
      smokeAges: ['<1年', '1-5年', '5-10年', '10年以上'],
      gender: '',
      birthday: '',
      education: '',
      smokeAge: ''
    },
    onNicknameInput(e) {
      this.setData({ nickname: e.detail.value });
    },
    onGenderChange(e) {
      this.setData({ gender: this.data.genders[e.detail.value] });
    },
    onDateChange(e) {
      this.setData({ birthday: e.detail.value });
    },
    onEduChange(e) {
      this.setData({ education: this.data.educations[e.detail.value] });
    },
    onSmokeAgeChange(e) {
      this.setData({ smokeAge: this.data.smokeAges[e.detail.value] });
    },
    nextStep() {
      wx.navigateTo({ url: '/pages/step2/step2' });
    }
  });
  