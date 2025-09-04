Page({
  data: {
    progress: 68,
    quitDays: 22,
    totalCigarettes: 440,
    relapseDate: '2025年8月9日',
    relapseTimes: 1
  },

  onLoad() {
    this.fetchQuitRecord();
  },

  fetchQuitRecord() {
    const mockData = {
      progress: 68,
      quitDays: 22,
      totalCigarettes: 440,
      relapseDate: '2025年8月9日',
      relapseTimes: 1
    };
    this.setData(mockData, () => {
      this.drawProgress(mockData.progress);
    });
  },

  drawProgress(endPercent) {
    const query = wx.createSelectorQuery().in(this);
    query
      .select('#progressCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;

        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;

        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        ctx.scale(dpr, dpr);

        const lineWidth = 10;
        const padding = 0;
        const radius = canvasWidth / 2 - lineWidth / 2 - padding;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        let currentPercent = 0;

        const animate = () => {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);

          // 背景环
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = '#eeeeee';
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // 进度环
          ctx.beginPath();
          const startAngle = -Math.PI / 2;
          const endAngle =
            startAngle + (currentPercent / 100) * (2 * Math.PI);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
          ctx.strokeStyle = '#a6ce39';
          ctx.lineCap = 'round';
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // 百分比文字
          ctx.fillStyle = '#a6ce39';
          ctx.font = 'bold 22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${currentPercent.toFixed(0)}%`, centerX, centerY);

          if (currentPercent < endPercent) {
            currentPercent += 1;
            setTimeout(animate, 15);
          }
        };

        animate();
      });
  }
});
