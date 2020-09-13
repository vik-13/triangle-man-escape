function Block(type, x, y, w, h, d) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.d = d;
  this.isMovable = d.mag() > 0;
  this.active = true;

  const colors = [color.black, color.black, color.ice, color.black];
  const nails = [[[0,14,40,14,40,0,27,7,15,1,6,4,0,0],'black','black',1]];
  const gHolder = [[[12, 0, 0, 22, 11, 40, 40, 36, 40, 4], '', 'black', 1], [[19, 16, 16, 20, 19, 24, 24, 23, 26, 17], '', 'mechanics', 1]];
  const speed = 2;

  let original = new V(x, y);
  let shift = 0;
  let step = this.isMovable ? 1 / Math.floor(d.mag() / speed) : 0;
  let direction = 1;

  this.n = () => {
    if (this.isMovable) {
      const current = original.get().add(this.d.get().mult(shift));
      this.x = current.x;
      this.y = current.y;
      if (shift > 1 || shift < 0) {
        direction *= -1;
      }
      shift += (step * direction);
    }
  };

  this.getVelocity = () => d.get().normalize().mult(speed * direction);

  this.r = () => {
    if (this.isMovable) {
      // Holder 1
      c.save();
      c.translate(original.x + (w / 2), original.y + (h / 2));
      draw.r(gHolder, [40, 40]);
      c.restore();

      // Holder 2
      c.save();
      c.translate(original.x + d.x + (w / 2), original.y + d.y + (h / 2));
      draw.r(gHolder, [40, 40]);
      c.restore();

      // Line
      c.save();
      c.strokeStyle = color.mechanics;
      c.moveTo(original.x + (w / 2), original.y + (h / 2));
      c.lineTo(original.x + d.x + (w / 2), original.y + d.y + (h / 2));
      c.stroke();
      c.restore();
    }

    c.save();
    c.translate(this.x, this.y);
    if (this.type === 1) {
      // TOP
      c.save();
      c.scale(1, -1);
      c.translate(-20, -this.h - 4);
      for (let i = 0; i < Math.floor(this.w / 40); i++) {
        c.translate(40, 0);
        draw.r(nails, [40, 8]);
      }
      c.restore();
      // BOTTOM
      c.save();
      c.translate(-20, -4);
      for (let i = 0; i < Math.floor(this.w / 40); i++) {
        c.translate(40, 0);
        draw.r(nails, [40, 8]);
      }
      c.restore();

      c.fillStyle = color.black;
      c.fillRect(0, 0, this.w, this.h);
    } else {
      c.fillStyle = colors[this.type];
      c.fillRect(0, 0, this.w, this.h);
    }
    c.restore();
  }
}
