window.characterAnimations = (() => {
  const size = [60, 83];
  // const gMain = [[[0,9,36,0,21,26],'','black',1],[[21,27,34,39,34,59],'','black',1],[[21,27,21,45,8,58],'','black',1],[[22,7,29,6,26,11],'','red',1]];
  const gMain = [[[0, 8, 60, 0, 31, 31], '', 'black', 1], [[32, 32, 50, 83, 51, 50], '', 'black', 1], [[31, 33, 3, 82, 30, 62], '', 'black', 1], [[46, 6, 37, 8, 43, 11], '', 'red', 1]];
  const gList = {
    stay: [
      gMain,
      [[[1, 10, 61, 5, 30, 35], [32, 34, 50, 83, 53, 50], [29, 35, 3, 82, 32, 63], [49, 10, 39, 11, 44, 15]]],
      500,
      false
    ],
    walk: [
      gMain,
      [[[1, 9, 61, 3, 31, 33], [30, 35, 13, 85, 38, 61], [33, 35, 47, 84, 54, 53], [49, 7, 40, 9, 45, 13]], [[1, 7, 60, -3, 32, 29], [32, 32, -10, 84, 27, 60], [34, 33, 65, 80, 60, 47], [49, 2, 40, 5, 46, 8]], [[0, 8, 60, 0, 31, 31], [30, 32, 4, 82, 31, 63], [32, 32, 51, 83, 56, 50], [46, 6, 37, 8, 43, 11]], [0, 0, 0, 0], [[1, 8, 60, -7, 34, 28], [34, 31, 66, 81, 62, 47], [32, 31, -5, 81, 26, 61], [47, 1, 39, 4, 45, 7]]],
      110
    ],
    jump: [
      gMain,
      [[[8, 7, 60, -24, 45, 17], [39, 39, 26, 96, 43, 70], [35, 38, 0, 93, 27, 69], [51, -14, 44, -8, 50, -7]], [[0, 8, 60, 0, 31, 31], [32, 32, 50, 83, 55, 49], [31, 33, 3, 82, 30, 62], [46, 6, 37, 8, 43, 11]]],
      300,
      true
    ],
    drop: [
      gMain,
      [[[1, 23, 61, 15, 32, 47], [33, 40, 38, 84, 61, 53], [29, 38, 8, 82, 41, 62], [49, 23, 40, 24, 46, 28]], [0, 0, 0, 0]],
      150,
      true
    ],
    fall: [
      gMain,
      [[[20, -5, 74, 23, 32, 32], [32, 32, 36, 71, 55, 49], [31, 33, -5, 68, 25, 62], [60, 20, 52, 16, 54, 22]]],
      300,
      true
    ],
    die: [
      gMain,
      [[[3, 56, 27, 27, 31, 58], [66, 46, 57, 60, 34, 59], [-29, 57, -8, 49, 7, 59], [21, 40, 25, 34, 26, 41]]],
      1000,
      true
    ],
    lowKick: [
      gMain,
      [[[-8, 14, 49, -6, 27, 30], [31, 32, 37, 55, 52, 26], [27, 33, 3, 82, 26, 61], [39, 2, 31, 6, 37, 8]], [[-7, 21, 46, -8, 30, 32], [32, 32, 93, 64, 61, 39], [31, 33, -2, 82, 26, 62], [36, 3, 28, 7, 34, 9]], [0, 0, 0, 0]],
      120,
      true
    ],
    highKick: [
      gMain,
      [[[-15, 13, 42, -7, 20, 30], [25, 31, 31, 53, 45, 24], [19, 31, 3, 82, 20, 60], [32, 1, 23, 5, 29, 7]], [[-7, 21, 46, -8, 30, 32], [43, 27, 105, 1, 65, 5], [31, 33, -2, 82, 26, 62], [36, 3, 28, 7, 34, 9]], [0, 0, 0, 0]],
      120,
      true
    ],
    backKick: [
      gMain,
      [[[-8, 14, 49, -6, 27, 30], [31, 32, 37, 55, 52, 26], [27, 33, 3, 82, 26, 61], [39, 2, 31, 6, 37, 8]], [[8, 2, -22, 55, 24, 35], [23, 40, 4, 83, 5, 54], [39, 30, 95, 14, 68, 31], [-10, 42, -4, 34, -1, 40]], [0, 0, 0, 0]],
      120,
      true
    ]
  };

  let current = new Anim(...gList.stay, 300);
  let currentName = 'stay';
  let mirrored = false;
  let nextAnim;
  let isBlocked = false;

  function next() {
    if (!nextAnim) return;
    current = new Anim(...gList[nextAnim]);
    currentName = nextAnim;
    nextAnim = null;
    isBlocked = false;
  }

  return {
    mirror: (value) => {
      mirrored = value;
    },
    to: (name, blocked, force) => {
      if (name === 'walk') {
        sfx.run();
      } else if (name === 'wall') {
        sfx.wall();
      } else if (name === 'flying') {
        sfx.flying();
      }
      if (currentName === name) return;
      if (name === 'jump') {
        sfx.jump();
      } else if (name === 'drop') {
        sfx.fall();
      } else if (name === 'die') {
        sfx.die();
      } else if (name === 'lowKick') {
        setTimeout(() => {
          sfx.lowKick();
        }, 120);
      } else if (name === 'highKick' || name === 'backKick') {
        setTimeout(() => {
          sfx.highKick();
        }, 120);
      }
      if (isBlocked && !force) {
        nextAnim = name;
      } else {
        current = new Anim(...gList[name]);
        currentName = name;
        isBlocked = blocked;
      }
    },
    r: (position, scale) => {
      let s = scale || 1;
      c.translate(position.x + (size[0] / 2), position.y + (size[1] / 2));
      c.scale(mirrored ? -s : s, -s);
      draw.r(current.n(), size);
      if (isBlocked && current.isFinished()) {
        next();
      }
    }
  };
})();
