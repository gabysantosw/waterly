////// === BASE UI === //////

// INFO SECTION - showing & hidding
const infoButton = document.querySelector('.js-open-info');
const infoSection = document.querySelector('.js-info-section');

infoButton.addEventListener('click', function () {
  infoSection.classList.toggle('--show');
  infoButton.classList.toggle('--active');
});

// ALERT MESSAGE - hidding on button press
const alert = document.querySelector('.js-alert');
const closeAlert = document.querySelector('.js-close-alert');

closeAlert.addEventListener('click', function () {
  alert.classList.toggle('--show');
});

////// === FUNCTIONALITY === //////

////// UI ELEMENTS
const glassesWrapper = document.querySelector('.js-glasses-wrapper');
const glassesUI = [
  document.querySelector('.js-glass-1'),
  document.querySelector('.js-glass-2'),
  document.querySelector('.js-glass-3'),
  document.querySelector('.js-glass-4'),
  document.querySelector('.js-glass-5'),
  document.querySelector('.js-glass-6'),
  document.querySelector('.js-glass-7'),
  document.querySelector('.js-glass-8')
];
const progressBar = document.querySelector('.js-progress-bar');
const messageWrapper = document.querySelector('.js-message-wrapper');
const messageParagraph = document.querySelector('.js-message-paragraph');
// elements that initially doesn't exist
let messageTimerParagraph = null;
let timer = null;
let hours = null;
let minutes = null;
let seconds = null;

////// VARIABLES -> initial states
let glassesArray = [
  false, false,
  false, false,
  false, false,
  false, false
];
let isTimerActive = false;
let timePassed = null; 
let glassesAmount = 0;
let lastGlassAt = null;

/////// CONSTANTS
const MS_PER_HOUR = 2000;

////// SETUP
function init() {
  // listen for user clicks inside the glasses container
  glassesWrapper.addEventListener('click', function (event) {
    // check if it's a glass -> only the glasses have a data-glass attribute
    if (event.target.dataset.glass) {
      // pass the data-glass value (position) 
      glassClick(event.target.dataset.glass);
    }
  });
}

function glassClick(position) {
  // check if glass is empty -> glasses status are reflexted on glassesArray
  if(glassesArray[position] === false) {
    // -> glass is empty

    // check if a timer is running
    if (isTimerActive) {
      // -> a timer is running

      // has more than 1h passed on that timer?
      if (timePassed >= MS_PER_HOUR) {
        // fill glass -> update data
        fillGlass(position);

        // checking if its the last glass of the day
        // if it is (glass 8) no need for timers
        if (glassesAmount !== 8) {
          // create timer message
          createTimerMessage();

          // start timer
          runTimer();
        }
      } else {
        // wait alert
        // animation class -> headshake
        glassesUI[position].classList.add('glass-headshake');

        // remove class when animation ends
        glassesUI[position].addEventListener('animationend', function(event) {
          glassesUI[position].classList.remove('glass-headshake');
        }, false);

        // show alert message
        alert.classList.toggle('--show');
      }
    } else {
      // -> a timer is not running
      // fill glass -> update data
      fillGlass(position);

      // checking if its the last glass of the day
      // if it is (glass 8) no need for timers
      if (glassesAmount !== 8) {
        // create timer message
        createTimerMessage();

        // start timer
        runTimer();
      }
    }

  } else {
    // -> glass is filled
  }
}

function fillGlass(position, updateDate = false) {
  // FUNCTIONAL SIDE
  glassesArray[position] = true;
  glassesAmount++;
  saveLocalStorage();
  
  // to handle checkLocalStorage where the last glass at is already set
  if (updateDate === false) {
    lastGlassAt = new Date();
  }

  // UI SIDE
  glassesUI[position].classList.toggle('--filled');
  // updating the progress bar
  progressBar.classList.toggle(`--filled-${ glassesAmount }`);
  // update message according to new ammount
  updateMessage();
}

// update message according to new ammount
function updateMessage() {
  if (glassesAmount === 0) {
    messageParagraph.innerText = `Take your first glass of water of the day, please...`;
    removeTimerMessage();

  } else if (glassesAmount === 8) {
    messageParagraph.innerText = `Congratulations! You took your daily dosis of water today, good job!`
    removeTimerMessage();

  } else {
    // glasses between 1-7
    messageParagraph.innerText = `Feeling much better, right?`;
  }
}

function removeTimerMessage() {
  messageWrapper.removeChild(messageTimerParagraph);

  // reseting ui variables
  messageTimerParagraph = null;
  timer = null;
  hours = null;
  minutes = null;
  seconds = null;
}

// create timer message
function createTimerMessage() {
  // check if messageTimerParagraph was already created
  if (messageTimerParagraph === null) {
    // -> not created, create
    let newMessageTimer = document.createElement('p');
    newMessageTimer.classList.add('js-message-timer-paragraph');
    newMessageTimer.classList.add('message__paragraph');
    newMessageTimer.textContent = `Next glass in `;
  
    // append to parent
    messageWrapper.appendChild(newMessageTimer);
  
    // updating element's reference
    messageTimerParagraph = document.querySelector('.js-message-timer-paragraph');
  }

  // check if timer element exist
  if (timer === null) {
    // doesn't exist, create
    let newTimer = document.createElement('span');
    newTimer.classList.add('message__timer');
    newTimer.classList.add('js-timer');
    
    // append to parent
    messageTimerParagraph.appendChild(newTimer);
  
    // updating element's reference
    timer = document.querySelector('.js-timer');
  }

  // check if hours/minutes/seconds elements exists
  if (hours === null || minutes === null || seconds === null) {
    // remove innerText in case there's any
    timer.innerText = '';

    // they dont exist, create them
    let newHour = document.createElement('span');
    newHour.classList.add('message__timer-element');
    newHour.classList.add('js-hours');
    newHour.textContent = '2h'
    let newMinute = document.createElement('span');
    newMinute.classList.add('message__timer-element');
    newMinute.classList.add('js-minutes');
    newMinute.textContent = '00m'
    let newSecond = document.createElement('span');
    newSecond.classList.add('message__timer-element');
    newSecond.classList.add('js-seconds');
    newSecond.textContent = '00s';
  
    // append to parent 
    timer.appendChild(newHour);
    timer.appendChild(newMinute);
    timer.appendChild(newSecond);
  
    // updating element's reference
    hours = document.querySelector('.js-hours');
    minutes = document.querySelector('.js-minutes');
    seconds = document.querySelector('.js-seconds');
  }
}

function timeOverMessage() {
  timer.innerText = `... right now, hurry!`;

  // reseting the ui variables so they can be created when needed
  hours = null;
  minutes = null;
  seconds = null;
}

function runTimer() {
  // for each second
  let interval = setInterval(function() {
    let currentDate = new Date();

    // passed time in ms since filled glass
    passedTime = currentDate.getTime() - lastGlassAt.getTime();

    // setting timer to 2h and converting passedTime to seconds
    let timeLeft = (MS_PER_HOUR * 2 / 1000) - (passedTime / 1000);

    // check if timer has ended -> passed time in seconds > 1 second
    if (timeLeft < 0) {
      // -> timer has ended
      isTimerActive = false;
      // update timer message: ask user to drink
      timeOverMessage();

      clearInterval(interval);
      
    } else {
      // -> timer is active
      isTimerActive = true;
      
      // ang getting time left in h m s
      let hoursLeft = Math.floor((timeLeft / (60 * 60) ) % 24);
      let minutesLeft = Math.floor((timeLeft / 60) % 60 );
      let secondsLeft = Math.floor(timeLeft % 60);

      // display the timer
      hours.innerText = `${ hoursLeft }h`;

      if (minutesLeft < 10) {
        minutes.innerText = `0${ minutesLeft }m`;
      } else {
        minutes.innerText = `${ minutesLeft }m`;
      }

      if (secondsLeft < 10) {
        seconds.innerText = `0${ secondsLeft }s`;
      } else {
        seconds.innerText = `${ secondsLeft }s`;
      }
    }

  }, 1000);
}

////// === LOCAL STORAGE === //////

// LOCALSTORAGE NEEDS
// glassesArray -> to properly show the filled arrays
// lastGlassAt -> to get when was the last glass taken


//     - YES -> update ui
//       - check glassesArray
//         - fill the ones with true
//       - get amount of glasses from it
//         - fill the progress bar
//         - update message
//       - compare lastGlassAt to get passedTime
//       - is passedTime < 1?
//         - YES -> activeTimer = true
//         - NO -> timer has ended
//           - activeTimer = false
//           - passedTime = null;

//

function saveLocalStorage() {
  localStorage.setItem('array', JSON.stringify(glassesArray));
  localStorage.setItem('date', lastGlassAt);
}

function checkLocalStorage() {
  // check if the local storage contains anything
  if (localStorage.length > 1) {
    let localDate = new Date(localStorage.getItem('date'));
    let currentDay = new Date();

    // check if the data is from today
    if(localDate.getDate() === currentDay.getDate()) {
      // -> localStorage is from today
      // update variables to the ones in localStorage
      glassesArray = JSON.parse(localStorage.getItem('array'));
      lastGlassAt = localDate;

      // fill glasses acordingly and update glassesAmount
      for (let i = 0; i < glassesArray.length; i++) {
        if (glassesArray[i] === true) {
          fillGlass(i, true);
        }
      }

      // checking if its the last glass of the day
      // if it is (glass 8) no need for timers
      if (glassesAmount !== 8) {
        // create timer message
        createTimerMessage();

        // start timer
        runTimer();
      }

    } else {
      // -> localStorage is from another day
      localStorage.clear();
    }
  }
}

////// === INITIALIZATION === //////
window.onload = function() {
  init();
  checkLocalStorage();
};