window.scene = (() => {
  let bg;
  let shake = {
    active: false,
    started: 0,
    light: false
  };
  const prison = new Prison();

  return {
    i: () => {
      bg = c.createLinearGradient(0, 0, 0, gc.res.y);
      bg.addColorStop(0, 'hsl(188, 96%, 90%)');
      bg.addColorStop(1, 'hsl(188, 96%, 65%)');

      background.i();
      foreground.i();
      map.i();
      character.i();
    },
    doShake: (light) => {
      shake.active = true;
      shake.light = !!light;
      shake.started = +new Date();
    },
    reset: () => {
      background.reset();
      foreground.reset();
      map.reset();
      character.reset();
      particles.reset();
      camera.reset();
    },
    n: () => {
      background.n();
      map.n();
      if (map.isLast()) {
        character.nFinal();
        finalScene.n();
      } else if (gc.started) {
        character.n();
      }
      particles.n();
      camera.n();

      if (shake.active && +new Date() - shake.started >= 300) {
        shake.active = false;
      }
    },
    r: () => {
      c.save();
      c.fillStyle = bg;
      c.fillRect(0, 0, gc.res.x, gc.res.y);
      c.restore();

      c.save();
      if (shake.active) {
        if (shake.light) {
          c.scale(1.02, 1.02);
          c.translate(rInt(-2, 2) - 10, rInt(-2, 2) - 10);
        } else {
          c.scale(1.05, 1.05);
          c.translate(rInt(-5, 5) - 20, rInt(-5, 5) - 20);
        }
      }

      if (map.isLast()) {
        finalScene.rBackground();
      } else {
        background.r();
      }

      camera.r();
      map.r();
      if (map.isLast()) {
        character.rFinal();
        finalScene.r();
      } else if (!gc.started) {
        character.rSplashScreen();
        prison.rSplash();
      } else {
        character.r();
        if (!map.currentLevel()) {
          prison.r();
        }
      }
      particles.r();

      if (!map.currentLevel()) {
        c.save();
        c.translate(570, 540);
        c.scale(1, -1);
        c.font = '80px Courier New';
        c.textAlign = 'left';
        c.fillStyle = "black";
        c.fillText('[Triangle Man]', 0, 0);
        c.translate(50, 100);
        c.font = '60px Courier New';
        c.fillText('Escape', 0, 0);

        if (!gc.started) {
          c.translate(0, 310);
          c.font = '30px Courier New';
          c.fillText('(Click to Start)', -30, 0);
        }
        c.restore();
      }
      c.restore();

      if (!map.isLast()) {
        foreground.r();
      }

      c.save();
      c.translate(1250, 20);
      c.scale(.3, .3);
      if (gc.muted) {
        draw.r([[[0, 23, 0, 59, 30, 59, 55, 75, 55, 0, 30, 24], '', 'white', 1]], [55, 75]);
      } else {
        draw.r([[[0, 27, 0, 64, 30, 63, 55, 80, 55, 4, 30, 28], '', 'white', 1], [[59, 28, 60, 57, 65, 57, 64, 28], '', 'white', 1], [[66, 18, 67, 64, 71, 64, 71, 19], '', 'white', 1], [[73, 8, 75, 72, 80, 72, 79, 8], '', 'white', 1], [[83, 0, 84, 81, 89, 81, 87, 0], '', 'white', 1]], [89, 81]);
      }
      c.restore();

      c.save();
      c.translate(10 + 146, 700);
      c.scale(1, -1);
      draw.r([[[2,3,0,29,68,30,282,26,290,0,132,3],'','white',1]], [290, 30]);
      c.fillStyle = '#A90011';
      const life = (character.life() / character.maxLife()) * 275;
      c.fillRect(-140, -10, life < 0 ? 0 : life, 20);
      c.restore();

      c.save();
      c.translate(1280 - 145, 700);
      c.scale(-1, -1);
      draw.r([[[2,3,0,29,68,30,282,26,290,0,132,3],'','white',1]], [290, 30]);
      c.fillStyle = '#0089FF';
      const stamina = (character.stamina() / character.maxStamina()) * 275;
      c.fillRect(-140, -10, stamina < 0 ? 0 : stamina, 20);
      c.restore();
    }
  };
})();
