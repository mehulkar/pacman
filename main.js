// TODO get this from document element later
// currently hard coded in CSS
const MAX_RIGHT = 600;
const MAX_LEFT = 0;
const MAX_DOWN = 600;
const MAX_UP = 0;

const STEPSIZE = 10;

const POSITIVE_DIRECTION = 1;
const NEGATIVE_DIRECTION = -1;

const MOVE_INTERVAL = 100;

const PACMAN_DIAMETER = 30;

var KEY_MAP = {
  37: { human: 'left',  axis: 'left', direction: NEGATIVE_DIRECTION, max: MAX_LEFT },
  39: { human: 'right', axis: 'left', direction: POSITIVE_DIRECTION, max: MAX_RIGHT },
  38: { human: 'up',    axis: 'top',  direction: NEGATIVE_DIRECTION, max: MAX_UP },
  40: { human: 'down',  axis: 'top',  direction: POSITIVE_DIRECTION, max: MAX_DOWN },
}

var MOVING = false;
var DIRECTION = 'right'; // default, but gets changed

document.addEventListener('DOMContentLoaded', function(event) {
  const pacman = document.getElementById('pacman');


  bindPlayPauseButton()
});

function move(pacman, keyInfo) {
  var moveAxis        = keyInfo.axis;
  var moveDirection   = keyInfo.direction;
  var max             = keyInfo.max;

  var currentPosition = +pacman.style[moveAxis].split('px')[0];

  if (isOutOfBounds(currentPosition, max, moveDirection)) {
    endGame();
  } else {
    var nextPos = currentPosition + (moveDirection * STEPSIZE);
    pacman.style[moveAxis] = nextPos + 'px';
  }
}

function endGame() {
  stopMovement();
  const playControlButton = document.getElementById('playControl');
  playControlButton.textContent = 'Start';
  window.alert('Game over :(');
}

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
  DIRECTION = direction;

  var matchingKeyCode = Object.keys(KEY_MAP).find(function(keyCode) {
    return KEY_MAP[keyCode].human === DIRECTION;
  });

  var keyInfo = KEY_MAP[matchingKeyCode];

  window.clearInterval(window.movementInterval);
  window.movementInterval = window.setInterval(
    move.bind(this, pacman, keyInfo), MOVE_INTERVAL
  );

  MOVING = true;
  document.addEventListener('keydown', watchArrowKeyPresses);
}

function stopMovement() {
  window.clearInterval(window.movementInterval);
  document.removeEventListener('keydown', watchArrowKeyPresses);
  MOVING = false;
}

function bindPlayPauseButton() {
  const playControlButton = document.getElementById('playControl');

  playControlButton.addEventListener('click', function() {
    if (MOVING === false) {
      startMovement(DIRECTION);
      playControlButton.textContent = 'Pause';
    } else {
      stopMovement();
      playControlButton.textContent = 'Start';
    }
  });
}
