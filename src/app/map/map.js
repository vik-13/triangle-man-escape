window.map = (() => {
  const scale = 40;
  let currentLevel = 2;
  const levels = [
    // #1
    [[0,0,17,50,1],[0,0,0,50,1],[0,0,1,1,16],[5,22,1,1,1],[8,42,14,1,1]],
    // #2
    [[0,0,0,50,1],[0,0,17,50,1],[5,12,1,1,1],[1,6,5,6,1],[5,23,1,1,1],[1,15,7,5,1],[1,27,4,8,1]],
    // #3
    [[0,0,0,50,1],[6,31,1,1,1],[0,0,17,50,1],[8,13,14,1,1],[8,31,14,1,1],[1,10,6,12,1],[1,32,7,7,1]],
    // #4
    [[0,0,0,50,1],[0,0,17,50,1],[1,7,6,5,1],[1,14,8,5,1],[1,21,10,5,1],[7,33,14,1,1],[5,24,1,1,1],[5,37,1,1,1],[5,11,1,1,1]],
    // #5
    [[0,0,0,50,1],[0,0,17,50,1],[7,33,14,1,1],[5,37,1,1,1],[7,15,14,1,1],[8,24,14,1,1],[6,24,1,1,1],[0,15,6,19,1]],
    // #6
    [[0,0,0,50,1],[0,0,17,50,1],[1,9,4,5,1,12,6],[6,10,1,1,1],[6,23,1,1,1],[6,29,1,1,1]],
    // #last
    [[0, 0, 0, 32, 1], [6, 0, 1, 1, 1], [7, 31, 1, 1, 1]]
  ];
  // 0 - fire,

  const additions = [
    // objects, background, foreground
    // #1
    [[[0, 29, 1]], 1, 0],
    // #2
    [[[0, 14, 1]], 1, 1],
    // #3
    [[]],
    // #4
    [[]],
    // #5
    [[]],
    // #6
    [[]],
    // #7
    [[]],
    // #8
    [[]]
  ];
  let backward = false;

  let mapData = {
    map: [],
    enemy: [],
    start: new V(),
    end: new V()
  };

  function initLevel() {
    mapData = {
      map: [],
      enemy: [],
      additions: [],
      start: new V(),
      end: new V(49 * scale, 0),
    };
    levels[currentLevel].forEach((item) => {
      if (item[0] === 5) {
        mapData.enemy.push(new Spider(item[0], item[1] * scale, item[2] * scale));
      } else if (item[0] === 6) {
        mapData.enemy.push(new GunMan(item[0], item[1] * scale, item[2] * scale));
      } else if (item[0] === 7 || item[0] === 8) {
        mapData.enemy.push(new HeliMan(item[0], item[1] * scale, item[2] * scale));
      } else if (item[0] === 2) {
        mapData.enemy.push(new Spider(item[0], item[1] * scale, item[2] * scale));
      } else {
        mapData.map.push(new Block(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      }
    });

    if (additions[currentLevel]) {
      additions[currentLevel][0].forEach((addition) => {
        if (!addition[0]) {
          mapData.additions.push(new Fire(addition[1] * scale, addition[2] * scale));
        }
      });

      if (typeof additions[currentLevel][1] !== 'undefined') {
        background.set(additions[currentLevel][1]);
      }

      if (typeof additions[currentLevel][2] !== 'undefined') {
        foreground.set(additions[currentLevel][2]);
      }
    }
  }

  return {
    i: () => {
      initLevel();
    },
    reset: () => {
      initLevel();
    },
    n: () => {
      mapData.map.forEach((item) => {
        item.n();
      });

      mapData.enemy.forEach((item) => {
        if (item.active) {
          item.n();
        }
      });

      mapData.additions.forEach((item) => {
        item.n();
      });
    },
    r: () => {
      mapData.map.forEach((item) => {
        item.r();
      });
      mapData.enemy.forEach((item) => {
        if (item.active) {
          item.r();
        }
      });

      mapData.additions.forEach((item) => {
        item.r();
      });
    },
    getMap: () => mapData,
    currentLevel: () => currentLevel,
    nextLevel: (direction) => {
      backward = direction === -1;
      currentLevel += direction;
    },
    getStart: () => new V(380, 280),
    getCharacterStart: () => (backward ? mapData.end : mapData.start),
    getEnd: () => mapData.end,
    isFirst: () => (currentLevel === 0),
    isLast: () => (currentLevel === levels.length - 1),
    isEmpty: () => {
      const filtered = mapData.enemy.filter((enemy) => {
        return enemy.active && enemy.type !== 7 && enemy.type !== 8;
      });
      return !filtered.length;
    }
  };
})();
