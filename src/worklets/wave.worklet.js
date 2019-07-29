import SimplexNoise from 'simplex-noise';

const sim = new SimplexNoise(() => 1);

registerPaint('wave', class {
  static get inputProperties() {
    return ['--animation-tick', '--wave-height', '--wave-color'];
  }

  paint(ctx, geom, properties) {
    const tick = Number(properties.get('--animation-tick'));
    const height = Number.parseFloat(properties.get('--wave-height'));
    const bgColor = properties.get('--wave-color');

    this.drawWave(ctx, geom, '#b6e9f1', 0.003, tick, 12, height);
    this.drawWave(ctx, geom, bgColor, 0.005, tick, 8, height);
  }

  drawWave(ctx, geom, fillColor, ratio, tick, amp, ih) {
    const {
      width,
      height
    } = geom;
    const initY = height * ih;
    const speedT = tick * ratio;

    ctx.beginPath();
    for (let x = 0, speedX = 0; x <= width; x++) {
      speedX += ratio * 1;
      const y = initY + sim.noise2D(speedX, speedT) * amp;
      ctx[x === 0 ? 'moveTo' : 'lineTo'](x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.lineTo(0, initY + sim.noise2D(0, speedT) * amp);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();
  }
});
