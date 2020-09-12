function HeliMan(type, x, y) {
  const getNext = () => {
    let next = rInt(-300, 300);
    if (this.x + next < 0 || this.x + next > 2000) {
      next = -next;
    }
    return new V(this.x + next, 0);
  };

  this.type = type;
  this.x = x;
  this.y = y;
  this.active = true;
  this.collisionRadius = 70;

  this.following = {
    to: getNext(),
    nextUpdate: rInt(500, 2000),
    lastUpdate: +new Date(),
    speed: rFloat(1, 3)
  };
  this.hitting = {
    possible: true,
    active: false,
    started: 0,
    last: 0,
    next: 0,
    position: new V()
  };

  const POWER = 40;
  const BOMB_SPEED = 8;
  const gMain = [[[41,23,88,23,89,68,40,68],'','black',1],[[61,23,61,0,66,0,65,23],'','black',1],[[0,6,25,7,66,7,123,3,99,2,59,2],'','black',1],[[59,39,60,50,71,50,71,39],'','white',1]];
  const gBomb = [[[12,0,0,16,12,32,32,32,44,16,32,0],'','black',1],[[27,12,31,20,35,13,32,9],'','white',1]];
  const gList = {
    fly: [
      gMain,
      [[[40,21,87,25,84,70,36,66],[61,23,61,0,66,0,65,23],[50,2,58,5,66,7,76,5,71,2,59,1],[57,38,56,49,67,50,69,39]],[0,0,0,0],[[39,25,86,21,91,66,42,70],[62,23,60,0,65,0,66,23],[51,3,56,6,66,6,76,5,68,2,59,2],[59,40,61,51,72,49,71,38]]],
      150
    ]
  };

  let current = new Anim(...gList.fly);

  this.n = () => {
    if (this.active) {
      const diff = this.following.to.x - this.x;
      const nextStep = Math.abs(diff) < this.following.speed ? Math.abs(diff) : this.following.speed;
      this.x += (diff < 0 ? -nextStep : nextStep);
    }
    if (Math.abs(this.following.to.x - this.x) < 5) {
      this.following.to = getNext();
    }
    if (+new Date() - this.following.lastUpdate >= this.following.nextUpdate) {
      this.following.to = character.position().get().add(new V(rInt(-200, 200), 0));
      this.following.lastUpdate = +new Date();
      this.following.nextUpdate = rInt(500, 2000);
      this.following.speed = rFloat(1, 3);
    }

    if (this.type !== 8) {
      if (this.hitting.active) {
        this.hitting.position.y -= BOMB_SPEED;

        if (character.position().get().add(new V(character.size().x / 2, character.size().y / 2)).distance(this.hitting.position.get().add(new V(11, 8))) < 30) {
          character.hit(POWER);
          this.hitting.active = false;
        }

        if (this.hitting.position.y < 40) {
          particles.addJump(this.hitting.position, 0, true);
          this.hitting.active = false;
          this.hitting.last = +new Date();
          this.hitting.next = rInt(1500, 3000);
          const distance = this.hitting.position.distance(character.position().get().add(new V(character.size().x / 2, character.size().y / 2)));
          if (distance < 300) {
            character.hit(POWER * ((300 - distance) / 300));
            scene.doShake(true);
          }
        }
      } else {
        if (+new Date() - this.hitting.last >= this.hitting.next && Math.abs((character.position().x + (character.size().x / 2)) - (this.x + 22)) < 200) {
          this.hitting.active = true;
          this.hitting.position = new V(this.x + 61, this.y);
        }
      }
    }
  };

  this.center = () => new V(this.x + 61, this.y + 34);

  this.r = () => {
    c.save();
    c.translate(this.x + 61, this.y + 34);
    c.scale(1, -1);
    draw.r(current.n(), [123, 68]);
    c.restore();

    if (this.hitting.active) {
      c.save();
      c.translate(this.hitting.position.x + 22, this.hitting.position.y + 16);
      c.scale(1, -1);
      draw.r(gBomb, [44, 32])
      c.restore();
    }
  };
}
