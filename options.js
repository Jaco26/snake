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

function getStoredOptions(key) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  }
}

function setStoredOptions(key, obj) {
  const existing = getStoredOptions(key);
  if (existing) {
    localStorage.setItem(key, JSON.stringify(
      Object.assign(existing, obj)
    ));
  } else {
    localStorage.setItem(key, JSON.stringify(obj))
  }
  
}

function loadOptions(storageKey, options) {
  const storedOptions = getStoredOptions(storageKey);
  Object.keys(options).forEach(key => {
    if (storedOptions && storedOptions[key]) {
      options[key] = storedOptions[key];
    }
  });  
  return options;
}

const STORAGE_KEY = 'options';

const OPTIONS = loadOptions(STORAGE_KEY, {
  polluterMode: false,
});

const gameMode = get('game-mode');

if (OPTIONS.polluterMode) {
  gameMode.el.textContent = 'Activate Normal Mode';
  gameMode.el.style.backgroundColor = 'black';
  gameMode.el.style.color = 'orange';
} else {
  gameMode.el.textContent = 'Activate Polluter Mode';
  gameMode.el.style.backgroundColor = '#efefef';
  gameMode.el.style.color = 'black';
}

gameMode.on('click', (e) => {
  OPTIONS.polluterMode = !OPTIONS.polluterMode;
  if (OPTIONS.polluterMode) {
    setStoredOptions(STORAGE_KEY, {
      polluterMode: true,
    });
    gameMode.el.textContent = 'Activate Normal Mode';
    gameMode.el.style.backgroundColor = 'black';
    gameMode.el.style.color = 'orange';
  } else {
    setStoredOptions(STORAGE_KEY, {
      polluterMode: false,
    });
    gameMode.el.textContent = 'Activate Polluter Mode';
    gameMode.el.style.backgroundColor = '#efefef';
    gameMode.el.style.color = 'black';
  }
});

const pauseButton = get('pause-button');
pauseButton.el.disabled = true;
