window.character = (() => {
  const MASS = .8;
  const MAX_SPEED = 4;
  const MAX_LIFE = 100;
  const MAX_STAMINA = 100;

  let atFinalPosition = false;
  let finalOpacity = 1;

  const state = {
    jump: false,
    fight: {
      possible: true,
      started: false,
      startedTime: 0,
      type: 0,
    },
  };

  let die = {
    isDead: false,
    dying: false
  };
  let stamina = 100;
  let life = MAX_LIFE;
  let levelIsCompleted = false;
  let isGoingBack = false;
  let velocity = new V();
  let position;
  const size = {x: 60, y: 83};
  const jumpVector = new V(0, 20);
  let inAir = false;
  let strongDrop = false;
  let lastMove = +new Date();
  let isRelaxing = false;

  function collision(position) {
    const collisionInfo = {
      touches: [],
      sides: [],
      isOverFan: false
    };

    map.getMap().enemy.forEach((block) => {
      if (block.type === 5) {
        if (block.active && !block.freeze.active) {
          const distance = block.center().distance(position.get().add(new V(size.x / 2, size.y / 2)));
          if (state.fight.started && distance < block.collisionRadius + 20) {
            block.contact(20);
          } else if (Math.abs(block.center().x - position.get().x) < 350 && Math.abs(block.center().y - position.get().y) <= 150) {
            block.follow(true);
          } else if (block.following.active) {
            block.follow();
          }
        }
      } else if (block.type === 6) {
        if (block.active && !block.freeze.active) {
          const distance = block.center().distance(position.get().add(new V(size.x / 2, size.y / 2)));
          if (state.fight.started && distance < block.collisionRadius + 20) {
            block.contact(30);
          } else if (Math.abs(block.center().x - position.get().x) < 450 && Math.abs(block.center().y - position.get().y) <= 150) {
            block.follow(true);
          } else if (block.following.active) {
            block.follow();
          }
        }
      } else if (block.type !== 7 && block.type !== 8) {
        if (block.center().distance(position.get().add(new V(size.x / 2, size.y / 2))) < block.collisionRadius + 20) {
          toDie();
        }
      }
    });

    map.getMap().map.forEach((block) => {
      if (block.active && position.x + size.x > block.x && position.x < block.x + block.w && position.y < block.y + block.h && position.y + size.y > block.y) {
        const coords = [
          block.y + block.h,
          block.x + block.w,
          block.y - size.y,
          block.x - size.x
        ];
        const distances = [
          (block.y + block.h) - position.y,
          (block.x + block.w) - position.x,
          (position.y + size.y) - block.y,
          (position.x + size.x) - block.x,
        ];

        const side = distances.indexOf(Math.min(...distances));

        collisionInfo.sides.push(side);
        collisionInfo.touches.push({
          side: side,
          type: block.type,
          intersect: coords[side],
          velocity: block.getVelocity()
        });

        if (block.type === 4) {
          block.startFalling();
        }
      }
    });

    return collisionInfo;
  }

  function toDie(falling) {
    if (die.dying) return;
    if (falling) {
      particles.dying(position.get().add(new V(0, size.y)), [color.dying1, color.dying2, color.dying3, color.dying4]);
    } else {
      particles.dying(position, [color.dying1, color.dying2, color.dying3, color.dying4]);
    }
    velocity = new V();
    die.dying = true;
    setTimeout(() => {
      toDead();
    }, 1000);
  }

  function toDead() {
    die.isDead = true;
  }

  function checkDrop() {
    map.getMap().enemy.forEach((block) => {
      if (block.type === 5 || block.type === 6) {
        if (block.active && !block.freeze.active &&
          block.center().distance(position.get().add(new V(size.x / 2, size.y / 2))) < 300) {
          block.contact(50, true);
        }
      }
    });
  }

  return {
    i: () => {
      position = map.getStart().get();
    },
    reset: () => {
      life = MAX_LIFE;
      velocity = new V();
      position = map.getCharacterStart().get();
      characterAnimations.mirror(position.x !== 0);
      die = {
        dying: false,
        isDead: false
      };
      characterAnimations.to('stay');
      inAir = false;
      levelIsCompleted = false;
      isGoingBack = false;
    },
    hit: (power) => {
      life -= power;
      particles.dying(position, [color.dying1, color.dying2, color.dying3, color.dying4]);
    },
    n: () => {
      if (die.dying) {
        characterAnimations.to('die', false, true);
        const acc = velocity.get().normalize().mult(-0.017);
        acc.add(gc.gravity.get().mult(MASS / 2));
        velocity.add(acc);
        position.add(velocity);
        return false;
      } else {
        life = life >= 100 ? 100 : life + .02;
        stamina = stamina >= 100 ? 100 : stamina + .3;
      }

      const acc = velocity.get().normalize().mult(-0.017);
      acc.add(gc.gravity.get().mult(MASS));

      if (control.pressed[0]) {
        acc.add(new V(-1, 0));
        characterAnimations.mirror(true);
      } else if (control.pressed[2]) {
        acc.add(new V(1, 0));
        characterAnimations.mirror(false);
      }

      velocity.add(acc);
      velocity.x = Math.abs(velocity.x) < MAX_SPEED ? velocity.x : ((Math.abs(velocity.x) / velocity.x) * MAX_SPEED);
      position.add(velocity);

      const collisionResult = collision(position);

      collisionResult.touches.forEach((item) => {
        if (item.side === 0 && velocity.y <= 0) {
          position.y = item.intersect;
          velocity.y = 0;
          position.add(item.velocity);

          if (!control.pressed[0] && !control.pressed[2]) {
            if (item.type === 2) {
              velocity.x /= 1.02;
            } else {
              velocity.x /= 2;
            }
          }
          if (Math.abs(velocity.x) > .1) {
            particles.addRunning(position, velocity);
          }
        }


        if (item.type === 0) {
          if (item.side === 1 || item.side === 3) {
            position.x = item.intersect;
          }

          if (item.side === 2) {
            position.y = item.intersect;
            velocity.y = velocity.y >= 0 ? 0 : velocity.y;
          }
        }
      });

      if (collisionResult.sides.indexOf(0) !== -1 && velocity.y <= 0) {
        if (control.pressed[0] || control.pressed[2]) {
          characterAnimations.to('walk');
        } else if (!isRelaxing) {
          characterAnimations.to('stay');
        }

        if (control.pressed[1]) {
          if (!state.jump) {
            velocity.add(jumpVector);
            characterAnimations.to('jump', false, true);
            state.jump = true;
          }
        }

        if (state.jump && !control.pressed[1]) {
          state.jump = false;
        }

        if (inAir) {
          characterAnimations.to('drop', true);
          particles.addJump(position, velocity.x, strongDrop);
          if (strongDrop) {
            scene.doShake();
            checkDrop();
          }
          inAir = false;
          strongDrop = false;
        }
      } else {
        inAir = true;
      }

      if (!collisionResult.sides.length && velocity.y < 0) {
        if (!collisionResult.isOverFan) {
          characterAnimations.to('fall');
        }

        if (control.pressed[1] && !state.jump && !inAir) {
          velocity.apply(new V(0, 15));
          characterAnimations.to('jump', false, true);
          state.jump = true;
        }
      }

      if (!control.pressed[1] && velocity.y > 0) {
        velocity.y /= 1.2;
      }

      if (position.x < 0 && map.isFirst()) {
        position.x = 0;
      } else if (position.x + size.x <= 0) {
        isGoingBack = true;
      }

      if (position.y + size.y < 0) toDie(true);

      if (position.x >= map.getEnd().x + 20) {
        if (map.isEmpty()) {
          levelIsCompleted = true;
        } else {
          position.x = map.getEnd().x + 20;
        }
      }

      if (control.pressed[0] || control.pressed[1] || control.pressed[2]) {
        lastMove = +new Date();
      }

      // Fight
      if (control.pressed[3] && state.fight.possible && !state.fight.started) {
        state.fight.possible = false;
        state.fight.started = true;
        state.fight.type = rInt(0, 3);
        // state.fight.type = 2;
        state.fight.startedTime = +new Date();
        velocity.x = 0;
        if (state.fight.type === 0) {
          characterAnimations.to('lowKick', true, true);
        } else if (state.fight.type === 1) {
          characterAnimations.to('highKick', true, true);
        } else if (state.fight.type === 2) {
          characterAnimations.to('backKick', true, true);
        }
      }

      if (state.fight.started && +new Date() - state.fight.startedTime > 300) {
        state.fight.started = false;
      }

      if (!control.pressed[3]) {
        state.fight.possible = true;
      }

      if (control.pressed[4] && inAir && stamina === MAX_STAMINA) {
        velocity.add(new V(0, -20));
        strongDrop = true;
        stamina = 0;
      }

      if (!inAir) {
        strongDrop = false;
      }

      if (life <= 0) {
        toDie();
      }

      // if (+new Date() - lastMove > 20000) {
      //   if (!isRelaxing) {
      //     isRelaxing = true;
      //     characterAnimations.to(['dancing', 'sit'][rInt(0, 2)]);
      //   }
      // } else {
      //   isRelaxing = false;
      // }
    },
    nFinal: () => {
      const maxSpeed = 1;
      if (!atFinalPosition) {
        characterAnimations.to('walk');

        const acc = velocity.get().normalize().mult(-0.017);
        acc.add(new V(.1, 0));

        velocity.add(acc);
        velocity.x = Math.abs(velocity.x) < maxSpeed ? velocity.x : ((Math.abs(velocity.x) / velocity.x) * maxSpeed);
        position.add(velocity);

        if (position.x >= 1000 - (size.x / 2)) {
          position.x = 1000 - (size.x / 2);
          atFinalPosition = true;
          characterAnimations.to('stay');
          setTimeout(() => {
            finalScene.i();
          }, 5000);
        }
      } else {
        finalOpacity -= .004;
        if (finalOpacity < 0) {
          finalOpacity = 0;
        }
      }
    },
    nSplashScreen: () => {

    },
    r: () => {
      c.save();
      characterAnimations.r(position);
      c.restore();
    },
    rFinal: () => {
      c.save();
      c.globalAlpha = finalOpacity;
      c.scale(1, 1 + (1 - finalOpacity));
      characterAnimations.r(position);
      c.globalAlpha = 1;
      c.restore();
    },
    rSplashScreen: () => {
      c.save();
      characterAnimations.to('sit');
      characterAnimations.r(new V(380, 270), 1);
      c.restore();
    },
    size: () => size,
    position: () => position,
    isDead: () => die.isDead,
    isDying: () => die.dying,
    levelIsCompleted: () => levelIsCompleted,
    isGoingBack: () => isGoingBack,
    life: () => life,
    maxLife: () => MAX_LIFE,
    stamina: () => stamina,
    maxStamina: () => MAX_STAMINA
  };
})();
