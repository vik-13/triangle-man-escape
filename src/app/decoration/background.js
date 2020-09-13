window.background = (() => {
  let bShift = rInt(0, 470);
  let type = 0;
  let mirrored = false;

  return {
    i: () => {
      type = rInt(0, backgroundObjects.length);
    },
    reset: () => {
      bShift = rInt(0, 470);
      type = rInt(0, backgroundObjects.length);
      mirrored = !!rInt(0, 2);
    },
    set: (t) => {
      type = backgroundObjects[type] ? t : rInt(0, backgroundObjects.length);
    },
    n: () => {

    },
    r: () => {
      c.save();
      c.translate(1100 - bShift - (camera.getPosition().x / 2), 370 + (camera.getPosition().y / 2));
      c.globalAlpha = .75;
      c.scale(20, mirrored ? 20 : -20);
      draw.r(backgroundObjects[type], [102, 36]);
      c.globalAlpha = 1;
      c.restore();
    }
  };
})();
