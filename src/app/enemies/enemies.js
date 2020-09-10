function Spider(type, x, y, d) {
  const FREEZE_TIME = 700;
  const SPEED = 2.3;
  const gMain = [[[55,0,107,1,108,48,54,49],'','black',1],[[54,48,32,25,14,59,32,32],'','black',1],[[55,45,32,14,0,57,30,23],'','black',1],[[109,47,128,24,146,58,128,30],'','black',1],[[109,46,128,13,160,58,128,22],'','black',1],[[59,9,59,16,69,16,69,8],'','white',1],[[92,10,92,17,102,16,102,10],'','white',1]];
  const gList = {
    stay: [
      gMain,
      [[[55,5,107,6,108,53,54,54],[54,54,33,28,14,59,33,34],[54,52,30,18,0,57,30,25],[108,52,128,27,146,58,128,34],[108,50,128,17,160,58,128,24],[60,14,60,21,70,21,70,12],[92,15,92,22,102,22,102,15]]],
      300
    ],
    walk: [
      gMain,
      [[[55,4,107,4,108,52,54,52],[54,51,33,29,4,57,34,34],[53,50,28,14,6,57,30,22],[109,51,130,29,155,57,130,34],[108,49,126,13,150,58,126,20],[59,12,59,19,69,19,69,10],[92,13,92,20,102,20,102,13]]],
      120
    ],
    die: [
      gMain,
      [[[99,-7,110,44,65,56,51,4],[67,57,26,48,2,59,27,54],[53,63,20,43,-10,65,20,48],[109,47,132,42,164,56,133,47],[112,48,142,38,173,57,140,44],[94,1,86,2,88,12,96,11],[100,30,93,32,96,41,102,40]]],
      200,
      true
    ],
    kick: [
      gMain,
      [[[72,-12,122,0,113,46,61,36],[60,34,38,20,8,44,38,26],[60,31,47,-5,5,-5,44,3],[116,44,135,21,137,59,134,28],[115,44,135,11,143,61,134,20],[74,-2,72,5,82,8,84,0],[104,5,102,12,112,15,114,9]],[[85,-22,133,-2,116,42,66,23],[66,19,44,-9,0,-8,43,-4],[65,21,41,-2,10,33,41,5],[118,40,137,21,127,57,135,27],[118,39,141,12,137,58,140,19],[88,-11,85,-4,94,1,98,-7],[113,0,110,7,120,11,123,5]],[0,0,0,0,0,0,0]],
      120
    ],
    hit: [
      gMain,
      [[[55,0,107,1,108,48,54,49],[54,48,32,25,50,61,32,32],[55,45,32,14,46,58,30,23],[109,47,128,24,119,58,128,30],[109,46,128,13,120,58,128,22],[60,12,60,16,70,16,70,14],[92,14,92,17,102,16,102,14]]],
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
  this.d = d;
  this.active = true;
  this.collisionRadius = 70;
  this.freeze = {
    active: false,
    started: 0,
    direction: 0
  };
  this.isMovable = d.mag() > 0;

  let current = new Anim(...gList.walk);
  let original = new V(x, y);
  let shift = 0;
  let step = this.isMovable ? 1 / Math.floor(d.mag() / SPEED) : 0;
  let direction = 1;

  this.contact = (power) => {
    if (!die.active) {
      die.live -= power;
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
    particles.dying(new V(this.x + 80, this.y), [color.dying1, color.dying2, color.dying3, color.dying4]);
  };

  this.n = () => {
    if (this.isMovable && !this.freeze.active && !die.active) {
      // Fight!

      const current = original.get().add(this.d.get().mult(shift));
      this.x = current.x;
      this.y = current.y;
      if (shift > 1 || shift < 0) {
        direction *= -1;
      }
      shift += (step * direction);
    }

    if (this.freeze.active) {
      this.x += this.freeze.direction;
    }

    if (this.freeze.active && +new Date() - this.freeze.started >= FREEZE_TIME) {
      this.freeze.active = false;
      current = new Anim(...gList.walk);
    }
    if (die.active && +new Date() - die.started > 200) {
      this.active = false;
    }
  };

  this.center = () => new V(this.x + 70, this.y + 25);

  this.r = () => {
    c.save();
    c.translate(this.x + 80, this.y + 30);
    c.scale(1, -1);
    draw.r(current.n(), [160, 59]);
    c.restore();
  };
}
