function MapObject(type, x, y) {
  const obj = objects[type];
  let mirrored = !!rInt(0, 2);

  this.n = () => {};

  this.r = () => {
    c.save();
    c.translate(x + obj[1][0] / 2, y + obj[1][1] / 2);
    c.scale(mirrored ? -1 : 1, -1);
    draw.r(obj[0], obj[1]);
    c.restore();
  };
}
