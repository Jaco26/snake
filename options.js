function El(id) {
  this.el = document.getElementById(id);
  this.on = function(evt, handler) {
    this.el.addEventListener(evt, handler);
    return this;
  };
  this.off = function(evt, handler) {
    this.el.removeEventListener(evt, handler);
    return this;
  }
}

function get(id) {
  return new El(id);
}

const OPTIONS = {
  polluterMode: false,
}

const gameMode = get('game-mode');

gameMode.on('click', (e) => {
  OPTIONS.polluterMode = !OPTIONS.polluterMode;
  if (OPTIONS.polluterMode) {
    gameMode.el.textContent = 'Activate Normal Mode';
    gameMode.el.style.backgroundColor = 'black';
    gameMode.el.style.color = 'orange';

  } else {
    gameMode.el.textContent = 'Activate Wacky Mode';
    gameMode.el.style.backgroundColor = '#efefef';
    gameMode.el.style.color = 'black';
  }
});

const pauseButton = get('pause-button');
pauseButton.el.disabled = true;
