window.splashScreen = (() => {
  return {
    n: () => {
      character.nSplashScreen();
    },
    r: () => {
      c.save();
      c.translate(600, 340);
      c.scale(1, -1);
      c.font = '80px Courier New';
      c.textAlign = 'left';
      c.fillStyle = "black";
      c.fillText('Triangle Man:', 0, 0);
      c.translate(0, 50);
      c.font = '40px Courier New';
      c.fillText('Escape', 0, 0);

      c.translate(0, 210);
      c.font = '30px Courier New';
      c.fillText('(Click to Start)', -30, 0);
      c.restore();

      character.rSplashScreen();
    }
  };
})();
