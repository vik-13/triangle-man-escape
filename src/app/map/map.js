window.map = (() => {
  const scale = 40;
  let currentLevel = 0;
  const levels = [
    // #1
    [[5,15,1,1,1,11,0],[1,31,7,11,1],[1,5,6,6,1],[0,0,17,50,1],[0,0,0,50,1],[0,0,1,1,16],[5,21,1,1,1],[5,33,1,1,1],[5,9,1,1,1]],
    // #2
    [[5,15,1,1,1,11,0],[1,31,7,11,1],[1,43,12,7,1],[1,5,6,6,1],[0,0,17,50,1],[0,0,0,50,1],[0,3,15,3,1],[0,5,13,1,2],[0,3,13,2,1],[0,3,11,1,2],[0,4,11,2,1]],
    // #last
    [[0, 0, 0, 32, 1], [6, 0, 1, 1, 1], [7, 31, 1, 1, 1]]
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
      start: new V(),
      end: new V(49 * scale, 0)
    };
    levels[currentLevel].forEach((item) => {
      if (item[0] === 4) {
        mapData.map.push(new BrokenBlock(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      } else if (item[0] === 5) {
        mapData.enemy.push(new Spider(item[0], item[1] * scale, item[2] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      } else if (item[0] === 6) {
        mapData.start = new V(item[1] * scale, item[2] * scale);
      } else if (item[0] === 7) {
        mapData.end = new V(item[1] * scale, item[2] * scale);
      } else if (item[0] === 3) {
        mapData.enemy.push(new PowerBlock(item[0], item[1] * scale, item[2] * scale));
      } else if (item[0] === 8) {
        mapData.enemy.push(new FanBlock(item[0], item[1] * scale, item[2] * scale));
      } else if (item[0] === 2) {
        mapData.enemy.push(new Spider(item[0], item[1] * scale, item[2] * scale));
      } else {
        mapData.map.push(new Block(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      }
    });
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
    },
    getMap: () => mapData,
    currentLevel: () => currentLevel,
    nextLevel: (direction) => {
      backward = direction === -1;
      currentLevel += direction;
    },
    getStart: () => mapData.start,
    getCharacterStart: () => (backward ? mapData.end : mapData.start),
    getEnd: () => mapData.end,
    isFirst: () => (currentLevel === 0),
    isLast: () => (currentLevel === levels.length - 1)
  };
})();
