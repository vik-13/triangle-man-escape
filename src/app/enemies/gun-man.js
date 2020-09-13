function GunMan(type, x, y, d) {
  const getNext = () => {
    let next = rInt(-300, 300);
    if (this.x + next < 0 || this.x + next > 2000) {
      next = -next;
    }
    return new V(this.x + next, 0);
  };

  const POWER = 30;
  const BOMB_SPEED = 8;
  const BOMB_LIVE_TIME = 1000;
  const FREEZE_TIME = 700;
  const WALKING_SPEED = 1;
  const FOLLOWING_SPEED = 1.7;
  const gMain = [[[14,0,72,0,72,71,16,71],'','black',1],[[24,72,23,87,35,88,35,72],'','black',1],[[53,71,65,72,65,86,54,86],'','black',1],[[27,12,26,24,38,24,38,13],'','white',1],[[0,36,0,52,11,48,40,48,41,38,10,40],'','black',1]];
  const gBomb = [[[6,0,0,8,6,16,16,16,22,8,16,0],'','black',1],[[14,6,16,10,18,7,16,5],'','white',1]];
  const gList = {
    stay: [
      gMain,
      [[[55,5,107,6,108,53,54,54],[54,54,33,28,14,59,33,34],[54,52,30,18,0,57,30,25],[108,52,128,27,146,58,128,34],[108,50,128,17,160,58,128,24],[60,14,60,21,70,21,70,12],[92,15,92,22,102,22,102,15]]],
      300
    ],
    walk: [
      gMain,
      [[[14,8,72,8,72,79,16,78],[24,70,24,86,36,86,36,70],[53,64,65,65,65,80,54,80],[27,19,26,31,38,31,38,20],[-1,44,-1,60,10,56,39,56,40,46,9,48]],[[14,0,72,0,72,71,16,71],[24,62,24,78,36,78,36,62],[53,71,65,72,65,86,54,86],[27,12,26,24,38,24,38,13],[0,32,0,49,10,44,40,44,41,35,10,36]]],
      120
    ],
    die: [
      gMain,
      [[[87,26,103,81,35,101,20,47],[24,77,10,83,14,94,29,87],[93,76,99,87,86,94,80,84],[74,41,70,42,75,53,78,52],[-32,73,-31,90,-21,85,9,85,10,76,-22,77]]],
      200,
      true
    ],
    kick: [
      gMain,
      [[[20,0,78,2,76,73,20,71],[26,71,22,85,33,89,37,74],[55,70,67,73,64,87,52,85],[31,9,29,21,40,23,41,13],[13,33,11,52,24,48,58,51,60,40,24,38]]],
      100,
      true
    ],
    hit: [
      gMain,
      [[[16,4,73,4,73,75,17,74],[24,72,23,87,35,88,35,72],[53,71,65,72,65,86,54,86],[26,21,26,24,38,24,38,21],[12,36,13,53,23,48,53,48,54,39,22,40]]],
      150,
      true
    ]
  };

  const die = {
    active: false,
    started: 0,
    live: 100
  };

  this.type = type;
  this.x = x;
  this.y = y;
  this.active = true;
  this.collisionRadius = 70;
  this.freeze = {
    active: false,
    started: 0,
    direction: 0
  };
  this.following = {
    active: false,
    lastSeen: 0,
    to: getNext(),
  };
  this.hitting = {
    possible: true,
    active: false,
    started: 0,
    next: 0,
    direction: 1,
    position: new V()
  };

  let current = new Anim(...gList.walk);

  this.follow = (visible) => {
    if (visible) {
      if (!this.following.active) {
        this.hitting.possible = false;
        this.hitting.started = +new Date();
      }
      this.following.active = true;
      this.following.lastSeen = +new Date();
    } else {
      if (+new Date() - this.following.lastSeen > 3000) {
        this.following.active = false;
        this.following.to = getNext();
      }
    }
    if (character.position().get().x - this.x > 405 || character.position().get().x - this.x < -325) {
      if (this.x < character.position().get().x) {
        this.following.to = character.position().get().add(new V(-300, 0));
      } else {
        this.following.to = character.position().get().add(new V(220, 0));
      }
    } else if (!character.isDying() && this.hitting.possible && !this.hitting.active) {
      this.hitting.possible = false;
      this.hitting.active = true;
      this.hitting.position = new V(this.x + 10, this.y + 34);
      this.hitting.direction = character.position().get().x - (this.x + 36) > 0 ? 1: -1;
      this.hitting.started = +new Date();
      sfx.shoot();
      current = new Anim(...gList.kick);
      setTimeout(() => {
        current = new Anim(...gList.walk);
      }, 200);
    }
  };

  this.contact = (power, isFallen) => {
    if (!die.active) {
      let actualPower = power;
      if (isFallen) {
        actualPower = power * ((300 - this.center().distance(character.position().get().add(new V(character.size().x / 2, character.size().y / 2)))) / 300);
      }
      die.live -= actualPower;
      particles.dying(new V(this.x + 25, this.y + 30), [color.dying1, color.dying2, color.dying3, color.dying4]);
      if (die.live <= 0) {
        this.destroy();
      } else {
        this.freeze.active = true;
        this.freeze.started = +new Date();
        this.freeze.direction = character.position().x < this.x ? .2 : -.2;
        current = new Anim(...gList.hit);
      }
    }
  };

  this.destroy = () => {
    die.active = true;
    die.started = +new Date();
    current = new Anim(...gList.die);
    particles.dying(new V(this.x + 60, this.y + 10), [color.dying1, color.dying2, color.dying3, color.dying4]);
  };

  this.n = () => {
    if (!this.freeze.active && !die.active) {
      const speed = this.following.active ? FOLLOWING_SPEED : WALKING_SPEED;
      const diff = this.following.to.x - this.x;
      const nextStep = Math.abs(diff) < speed ? Math.abs(diff) : speed;
      this.x += (diff < 0 ? -nextStep : nextStep);

      if (!this.following.active && Math.abs(this.following.to.x - this.x) < 5) {
        this.following.to = getNext();
        current = new Anim(...gList.walk);
      }
    }

    if (this.freeze.active) {
      this.x += this.freeze.direction;
    }

    if (this.hitting.active) {
      this.hitting.position.x += (this.hitting.direction * BOMB_SPEED);

      if (character.position().get().add(new V(character.size().x / 2, character.size().y / 2)).distance(this.hitting.position.get().add(new V(11, 8))) < 30) {
        character.hit(POWER);
        sfx.lowKick();
        this.hitting.started = +new Date();
        this.hitting.active = false;
      }

      if (+new Date() - this.hitting.started >= BOMB_LIVE_TIME) {
        this.hitting.active = false;
      }
    }

    if (!this.hitting.possible && !this.hitting.active && +new Date() - this.hitting.started > 1000) {
      this.hitting.possible = true;
      current = new Anim(...gList.walk);
    }

    if (this.freeze.active && +new Date() - this.freeze.started >= FREEZE_TIME) {
      this.freeze.active = false;
      this.following.active = false;
      current = new Anim(...gList.walk);
    }
    if (die.active && +new Date() - die.started > 200) {
      this.active = false;
    }
  };

  this.center = () => new V(this.x + 36, this.y + 44);

  this.r = () => {
    c.save();
    c.translate(this.x + 36, this.y + 44);
    if (this.following.active) {
      c.scale(character.position().get().x - (this.x + 36) > 0 ? -1 : 1, -1);
    } else {
      c.scale(this.following.to.x - this.x > 0 ? -1 : 1, -1);
    }
    draw.r(current.n(), [72, 88]);
    c.restore();
    if (this.hitting.active) {
      c.save();
      c.translate(this.hitting.position.x + 11, this.hitting.position.y + 8);
      c.scale(.8, -.8);
      draw.r(gBomb, [22, 16])
      c.restore();
    }
  };
}
