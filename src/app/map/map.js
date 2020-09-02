window.map = (() => {
  const scale = 40;
  let currentLevel = 0;
  const levels = [
    // #1
    [[0,0,0,70,1],[0,10,6,8,1],[0,23,6,8,1],[0,16,12,9,1],[0,50,10,8,1],[0,38,6,9,1],[7,69,1,1,1],[6,1,6,1,1]],
    // #last
    [[0,0,0,32,1],[6,0,1,1,1],[7,31,1,1,1]]
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
      end: new V()
    };
    levels[currentLevel].forEach((item) => {
      if (item[0] === 4) {
        mapData.map.push(new BrokenBlock(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      } else if (item[0] === 5) {
        mapData.enemy.push(new SawBlock(item[0], item[1] * scale, item[2] * scale, item[3] * scale, item[4] * scale, (typeof item[5] !== 'undefined' ? new V(item[5], item[6]) : new V()).get().mult(scale)));
      } else if (item[0] === 6) {
        mapData.start = new V(item[1] * scale, item[2] * scale);
      } else if (item[0] === 7) {
        mapData.end = new V(item[1] * scale, item[2] * scale);
      } else if (item[0] === 3) {
        mapData.enemy.push(new PowerBlock(item[0], item[1] * scale, item[2] * scale));
      } else if (item[0] === 8) {
        mapData.enemy.push(new FanBlock(item[0], item[1] * scale, item[2] * scale));
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
        item.n();
      });
    },
    r: () => {
      mapData.map.forEach((item) => {
        item.r();
      });
      mapData.enemy.forEach((item) => {
        item.r();
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
