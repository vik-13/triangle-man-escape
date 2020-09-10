window.particles = (function () {
  let list = [];
  let runningLast = +new Date();
  let wallLast = +new Date();

  return {
    reset: () => {
      list = [];
    },
    addRunning: (position, velocity) => {
      if (+new Date() - runningLast < 200) {
        return false;
      }
      const amount = 2;
      for (let i = 0; i < amount; i++) {
        list.push(
          new Particle(
            rFloat(.1, .15),
            4,
            position.get(),
            new V(rFloat(-1, 1), rFloat(.5, .5 + (velocity.x / 5))),
            500,
            color.walking
          )
        );
      }
      runningLast = +new Date();
    },
    addJump: (position, velocityX, strong) => {
      const amount = strong ? 30 : 5;
      const power = strong ? 3 : 1;
      for (let i = 0; i < amount; i++) {
        list.push(
          new Particle(
            rFloat(.1, .15),
            5,
            position.get(),
            new V(rFloat(velocityX - power, velocityX + power), rFloat(.5, power)),
            strong ? 1500 : 500,
            color.walking
          )
        );
      }
    },
    addFan: (position) => {
      const amount = 1;
      for (let i = 0; i < amount; i++) {
        list.push(
          new Particle(
            rFloat(.0001, .00015),
            2,
            position.get().add(new V(rInt(0, 100), rInt(0, 20))),
            new V(0, rFloat(1, 3)),
            2000,
            color.walking
          )
        );
      }
    },
    dying: (position, colors) => {
      const amount = 30;
      for (let i = 0; i < amount; i++) {
        list.push(
          new Particle(
            rFloat(.1, .3),
            rInt(3, 10),
            position.get(),
            new V(rFloat(.5, 2) * Math.sin(rFloat(0, Math.PI * 2)), rFloat(3, 4) * Math.cos(rFloat(0, Math.PI * 2))),
            500,
            colors[rInt(0, colors.length)]
          )
        );
      }
    },
    n: () => {
      list = list.filter(function (particle) {
        particle.n();
        return particle.isActive;
      });
    },
    r: () => {
      list.forEach(function (particle) {
        particle.r();
      });
    }
  };
})();
