function FireParticle(type) {
  let MASS, START, TIME, position, velocity, opacity, angle, rotating, radius, stones;
  this.active = true;

  function reset() {
    MASS = type ? .001 : .001;
    START = +new Date();
    TIME = type ? rInt(1000, 1300) : rInt(4000, 9000);
    position = type ? new V(rInt(-50, 50), rInt(-10, 10)) : new V( rInt(-10, 10), rInt(-80, -90));
    velocity = type ? new V(position.x < 0 ?  rFloat(.1, 1) : rFloat(-1, .1), rFloat(-1, -2)) : new V(rFloat(-.3, .3), rFloat(-1.2, -2));
    opacity = type ? 1 : 0;
    angle = 0;
    rotating = rFloat(-.03, .03);
    radius = 10;
  }

  reset();

  this.n = () => {
    const diff = +new Date - START;

    let acc = velocity.get().normalize().mult(0.001);
    acc.add(gc.gravity.get().mult(MASS));

    velocity.add(acc);
    position.add(velocity);
    opacity = .8 - (.8 * (diff / TIME));
    opacity = opacity < 0 ? 0 : opacity;
    if (type) {
      radius = 10;
    } else {
      radius = 20;
      opacity = (.5 * (diff / (TIME / 2)));
      radius = 5 + 40 * opacity;
      opacity = opacity > .5 ? .5 - opacity + .5 : opacity;
    }

    angle += rotating;
    this.active = diff <= TIME;
    !this.active && reset();
  };

  this.r = () => {
    c.save();
    c.fillStyle = type ? 'hsl(' + ((50 * .8) - (50 * opacity)) + ', 70%, 50%)' : 'hsl(224, 4%, 84%)';
    c.translate(position.x, position.y);
    c.rotate(angle);
    bp();
    c.globalAlpha = opacity;
    c.fillRect(-radius, -radius, radius * 2, radius * 2);
    c.restore();
  };
}

function Fire(x, y) {
  const torch = new Anim(
    [[[3,60,3,24,0,1,3,2,6,2,9,0,6,29,7,60],'','black',1]],
    []
  );
  let fires = [];

  for(let i = 0; i < 100; i++) {
    setTimeout(() => {fires.push(new FireParticle(true));}, i * 10);
  }

  for(let i = 0; i < 150; i++) {
    setTimeout(() => {fires.push(new FireParticle(false));}, 500 + (i * 50));
  }

  this.position = new V(x, y);

  this.n = () => {
    fires.forEach((fire) => fire.n());
  };

  this.r = () => {
    c.save();
    c.translate(this.position.x + 5, this.position.y + 30);
    c.save();
    c.translate(0, 110);
    c.scale(.3, -.3);
    fires.forEach((fire) => fire.r());
    c.restore();
    c.scale(4, -4);
    draw.r(torch.n(), [9, 60]);
    c.restore();
  };
}
