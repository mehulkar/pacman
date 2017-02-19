// TODO get this from document element later
// currently hard coded in CSS
const MAX_RIGHT = 600;
const MAX_LEFT = 0;
const MAX_DOWN = 600;
const MAX_UP = 0;

const STEPSIZE = 30;

const POSITIVE_DIRECTION = 1;
const NEGATIVE_DIRECTION = -1;

const MOVE_INTERVAL = 200;

const PACMAN_DIAMETER = 30;

var KEY_MAP = {
  37: { human: 'left',  cssProperty: 'left', direction: NEGATIVE_DIRECTION, max: MAX_LEFT },
  39: { human: 'right', cssProperty: 'left', direction: POSITIVE_DIRECTION, max: MAX_RIGHT },
  38: { human: 'up',    cssProperty: 'top', direction: NEGATIVE_DIRECTION, max: MAX_UP },
  40: { human: 'down',  cssProperty: 'top', direction: POSITIVE_DIRECTION, max: MAX_DOWN },
}
const pacmanObject = {
  moving: false,
  direction: 'right', // default
  coordinates: [0, 0],

  currentCssProperty() {
    let kc = Object.keys(KEY_MAP).find(keyCode => {
      return KEY_MAP[keyCode].human === this.direction;
    });

    return KEY_MAP[kc].cssProperty;
  },

  move(direction) {
    // change DOMelement style
    let currentPosition = this.currentPosition();
    let cssProperty = this.currentCssProperty();
    var nextPos = currentPosition + (direction * STEPSIZE);
    pacmanObject.DOMelement.style[cssProperty] = nextPos + 'px';
  },

  currentPosition() {
    let cssProperty = this.currentCssProperty();
    return +this.DOMelement.style[cssProperty].split('px')[0];
  }
};

var Board = {
  rows: [],
  DOMelement: function() {
    return document.getElementById('mainframe');
  },

  setPacman: function(pacmanObject) {
    this.pacman = pacmanObject;
  },

  movePacman: function(direction) {
    if(this.pacman.direction === 'right'){
      this.pacman.coordinates[1] += 1;
    } else if(this.pacman.direction === 'left'){
      this.pacman.coordinates[1] -= 1;
    } else if(this.pacman.direction === 'up'){
      this.pacman.coordinates[0] -= 1;
    } else if(this.pacman.direction === 'down'){
      this.pacman.coordinates[0] += 1;
    }

    this.pacman.move(direction);
  },

  drawAndas: function() {
    var numToDraw   = 400;
    var rows        = this.rows;
    var currentRow  = [];

    var rowNumber = 0;

    for (var i = 0; i < numToDraw; i++) {

      var anda = {
        x: 1,
        y: 1,
        DOMelement: document.createElement('anda'),
      }

      currentRow.push(anda);

      var andaIndex = currentRow.indexOf(anda);

      var left = andaIndex * 30;
      // set position of of element
      anda.DOMelement.style.left = left + 'px';
      anda.DOMelement.style.top  = rows.length * 30 + 'px';

      // set coordinates
      anda.x = andaIndex + 1;
      anda.y = rowNumber + 1;

      // complete row and create new row
      if (left + 30 >= 600) {
        rows.push(currentRow);
        rowNumber++;
        currentRow = [];
      }

      this.DOMelement().appendChild(anda.DOMelement);
    }
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  pacmanObject.DOMelement = document.getElementById('pacman');
  Board.drawAndas();
  Board.setPacman(pacmanObject);
  bindPlayPauseButton()
});

function watchArrowKeyPresses(event) {
  var keyInfo = KEY_MAP[event.keyCode]

  if (!keyInfo) { return; }

  startMovement(keyInfo.human);
}

function isOutOfBounds(current, max, direction) {
  if (direction === POSITIVE_DIRECTION) {
    return current >= (max - PACMAN_DIAMETER);
  } else {
    return current <= max;
  }
}

function startMovement(direction) {
  Board.pacman.direction = direction;

  var matchingKeyCode = Object.keys(KEY_MAP).find(function(keyCode) {
    return KEY_MAP[keyCode].human === Board.pacman.direction;
  });

  var keyInfo = KEY_MAP[matchingKeyCode];

  window.clearInterval(window.movementInterval);

  window.movementInterval = window.setInterval(
    move.bind(this, Board.pacman, keyInfo),
    MOVE_INTERVAL
  );

  Board.pacman.moving = true;
  document.addEventListener('keydown', watchArrowKeyPresses);
}

function move(pacmanObject, keyInfo) {
  var cssProperty     = keyInfo.cssProperty;
  var moveDirection   = keyInfo.direction;
  var max             = keyInfo.max;

  var currentPosition = +pacmanObject.DOMelement.style[cssProperty].split('px')[0];

  if (isOutOfBounds(currentPosition, max, moveDirection)) {
    stopMovement();
  } else {
    Board.movePacman(moveDirection);
  }
}

function stopMovement() {
  window.clearInterval(window.movementInterval);
  pacmanObject.moving = false;
}

function bindPlayPauseButton() {
  const playControlButton = document.getElementById('playControl');

  playControlButton.addEventListener('click', function() {
    if (pacmanObject.moving === false) {
      startMovement(pacmanObject.direction);
      playControlButton.textContent = 'Pause';
    } else {
      stopMovement();
      playControlButton.textContent = 'Start';
    }
  });
}
