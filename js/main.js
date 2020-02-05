// === *** BASIC UI *** === //
// ===

// INFO SECTION - close & open
const infoButton = document.getElementById('js-open-info');
const infoSection = document.getElementById('js-info-section');

infoButton.addEventListener('click', function () {
  infoSection.classList.toggle('--show');
  infoButton.classList.toggle('--active');
});

// ALERT MESSAGE - close
const closeAlert = document.getElementById('js-close-alert');

closeAlert.addEventListener('click', function () {
  alertUI.classList.toggle('--show');
});

// ===
// ===
// ===
// === *** FUNCTIONALITY *** === //
// ===

// === CONSTANTS === //
const GOAL_AMOUNT = 8;
// 1h = 60min = 60 * 60 = 3600s = 3600000ms
const MIN_SECONDS_SINCE = 3600;
const MAX_SECONDS_SINCE = 7200;

// === STATES === //
let glassesState, lastGlassAt;

// === ELEMENTS === //
const glassesUI = document.querySelectorAll('#js-glasses > .glass');
const progressBarUI = document.getElementById('js-progress-bar');
const alertUI = document.getElementById('js-alert');
const messageUI = document.getElementById('js-message');
const timerUI = document.getElementById('js-timer');

// === EVENTS === //
document.getElementById('js-glasses').addEventListener('click', handleGlassClick);

// === FUNCTIONS === //
function init() {
  // reset states or load from localStorage

  // reset states if ->
  // there's no saved items in localStorage
  // or if it exists but is a new day
  if (localStorage.length < 1) {
    resetState();
  } else { 
    // there's something on local storage -> check day
    const localStorageDate = new Date(localStorage.getItem('savedLastGlassAt'));
    const currentDay = new Date();

    if (localStorageDate.getDate() !== currentDay.getDate()) {
      // its a new day -> reset states
      resetState();
    } else {
      // set states to the one saved on local storage
      glassesState = JSON.parse(localStorage.getItem('savedGlassesState'));
      lastGlassAt = localStorageDate;
      runTimer();
    }
  }

  render();
}

function resetState() {
  // reseting glasses
  glassesState = [
    false, false,
    false, false,
    false, false,
    false, false
  ];
  // no glasses drank
  lastGlassAt = null;
}

function render(updatedGlass = null) {
  // when null updated glass -> all glasses should be rendered
  if (updatedGlass === null) {
    for (let position in glassesState) {
      // by default all glasses are unfilled
      // fill acording to state = true
      if (glassesState[position]) {
        renderGlass(position);
      }
    }
  } else {
    // update just the given glass
    renderGlass(updatedGlass);
  }

  // update progress bar
  progressBarUI.classList.toggle(`--filled-${ getFilledGlassesAmount() }`);

  // update message
  renderMessage(getFilledGlassesAmount());
}

function renderGlass(position) {
  // fill glass
  glassesUI[position].classList.toggle('--filled');
}

function renderAlert(glassPosition) {
  // animation feedback on clicked glass
  glassesUI[glassPosition].classList.add('glass-headshake');

  // remove class when animation ends
  glassesUI[glassPosition]
    .addEventListener('animationend', function() {
      glassesUI[glassPosition].classList.remove('glass-headshake');
    }, false);

  // show alert message
  alertUI.classList.toggle('--show');
}

function renderMessage(amount) {
  // message depends on amount of glasses
  if (amount === 0) {
    messageUI.innerText = `Take your first glass of water of the day, please...`;

  } else if (amount === GOAL_AMOUNT) {
    messageUI.innerText = `Congratulations! You took your daily dosis of water today, good job!`

  } else {
    // glasses between 1-goal amount
    messageUI.innerText = `Feeling much better, right?`;
  }
}

function renderTimer(hours = null, minutes, seconds) {
  // in this case, enough time has passed so timer is not needed
  if (hours === null) {
    timerUI.innerText = `Now!`
  } else {
    // display h m s
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
  
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
  
    timerUI.innerText = `${hours}h ${minutes}m ${seconds}s`
  }
}

function renderRemoveTimer() {
  document.getElementById('js-timer-message').style.display = 'none';
}

function getFilledGlassesAmount() {
  let amount = 0;
  for (let state of glassesState) {
    if (state) {
      amount++;
    }
  }
  return amount;
}

function handleGlassClick(event) {
  let clicked = event.target;

  // exit event if =>
  // clicked element is not a button/glass OR
  // the glass is filled in that position
  if (
    clicked.classList[0] !== "glass" ||
    glassesState[clicked.dataset.position] === true
  ) return;
  
  // clicked element is an empty glass
  // check if it can be filled
  // first glass of the day -> lastGlassAt = null OR
  // more than the minimum time since last glass has passed
  let clickedPosition = clicked.dataset.position;
  if (
    lastGlassAt === null ||
    secondsSinceLastGlass() > MIN_SECONDS_SINCE
  ) {
    // fill glass
    glassesState[clickedPosition] = true;

    // save current time
    lastGlassAt = new Date();

    // only start a new timer the goals hasn't been reached
    if (getFilledGlassesAmount() !== GOAL_AMOUNT) {
      runTimer();
    } else {
      // timer not needed
      renderRemoveTimer();
    }
    // save to local storage 
    localStorage.setItem('savedGlassesState', JSON.stringify(glassesState));
    localStorage.setItem('savedLastGlassAt', lastGlassAt);

    // update UI
    render(clickedPosition);
  } else {
    // must wait to fill glass -> show alert
    renderAlert(clickedPosition);
  }
}

function secondsSinceLastGlass() {
  // compare current time with last glass time -> in seconds
  let currentDate = new Date();
  
  // seconds = milliseconds / 1000
  let secondsPassed = (currentDate.getTime() - lastGlassAt.getTime()) / 1000;

  return (Math.round(secondsPassed));
}

function runTimer() {
  // continue timer variable to end timer if needed
  const currentAmount = getFilledGlassesAmount();
  // for each second
  let interval = setInterval(function() {
    let secondsPassed = secondsSinceLastGlass();

    // handling the end of intervals:
    // end interval if more than max seconds have passed
    // or if glasses state has been updated
    if (
      secondsPassed >= MAX_SECONDS_SINCE ||
      currentAmount !== getFilledGlassesAmount()
    ) {
      // only show 'now' when the seconds have passed
      if (secondsPassed >= MAX_SECONDS_SINCE) {
        renderTimer();
      }
      clearInterval(interval);
    } else {
      let secondsLeft = MAX_SECONDS_SINCE - secondsPassed;

      // separating seconds in h / m / s
      let hours = Math.floor((secondsLeft / (60 * 60) ) % 24);
      let minutes = Math.floor((secondsLeft / 60) % 60 );
      let seconds = Math.floor(secondsLeft % 60);

      // render timer
      renderTimer(hours, minutes, seconds);
    }
  }, 1000);
}

// === INITIALIZE ===
init();