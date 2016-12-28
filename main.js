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

document.addEventListener('DOMContentLoaded', function(event) {
  const pacman = document.getElementById('pacman');

  // move right on load
  window.movementInterval = window.setInterval(
    move.bind(this, pacman, KEY_MAP[39]),
  MOVE_INTERVAL);

  document.addEventListener('keydown', watchArrowKeyPresses);
});

function move(pacman, keyInfo) {
  var moveAxis        = keyInfo.axis;
  var moveDirection   = keyInfo.direction;
  var max             = keyInfo.max;

  var currentPosition = +pacman.style[moveAxis].split('px')[0];

  if (isOutOfBounds(currentPosition, max, moveDirection)) {
    stopMovement();
  } else {
    var nextPos = currentPosition + (moveDirection * STEPSIZE);
    pacman.style[moveAxis] = nextPos + 'px';
  }
}

function stopMovement() {
  console.log('Stopping game...');
  window.clearInterval(window.movementInterval);
  document.removeEventListener('keydown', watchArrowKeyPresses);
}

function watchArrowKeyPresses(event) {
  var keyInfo = KEY_MAP[event.keyCode]

  if (!keyInfo) { return; }

  window.clearInterval(window.movementInterval);
  window.movementInterval = window.setInterval(
    move.bind(this, pacman, keyInfo),
  MOVE_INTERVAL);
}

function isOutOfBounds(current, max, direction) {
  if (direction === POSITIVE_DIRECTION) {
    return current >= (max - PACMAN_DIAMETER);
  } else {
    return current <= max;
  }
}
