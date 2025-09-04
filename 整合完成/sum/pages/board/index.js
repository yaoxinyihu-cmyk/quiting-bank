Page({
  data:{ statusBarHeight:0, messages:[], scrollTop:0 },

  onLoad(){
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });

    const AVS = [
      '../../assets/images/avatar1.png',
      '../../assets/images/avatar2.png',
      '../../assets/images/avatar3.png',
    ];
    const arr = [
      {id:1,name:'橙子',time:'10:17',text:'坚持，加油！',avatar:AVS[0]},
      {id:2,name:'星河',time:'12:05',text:'想烟时多喝水/深呼吸～',avatar:AVS[1]},
      {id:3,name:'唐宁',time:'18:33',text:'每一天的小胜利，汇聚成大改变！',avatar:AVS[2]},
      {id:4,name:'木木',time:'19:22',text:'需要我就call我，我们都在！',avatar:AVS[0]},
      {id:5,name:'七七',time:'21:10',text:'明天也要继续哦～',avatar:AVS[1]}
    ];
    this.setData({ messages: arr });

    this.startAutoScroll();
  },
  onUnload(){ this.stopAutoScroll(); },
  onHide(){ this.stopAutoScroll(); },
  goBack(){ wx.navigateBack(); },

  startAutoScroll(){
    this.stopAutoScroll();
    let n = 0;
    this.timer = setInterval(()=>{
      n += 1;
      this.setData({ scrollTop: n * 140 });
    }, 3000);
  },
  stopAutoScroll(){ if(this.timer){ clearInterval(this.timer); this.timer = null; } }
});
