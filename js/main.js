////// === UI ===
// INFO SECTION - showing & hidding
const infoButton = document.querySelector('.js-open-info');
const infoSection = document.querySelector('.js-info-section');

infoButton.addEventListener('click', function () {
  infoSection.classList.toggle('--show');
  infoButton.classList.toggle('--active');
});

////// === FUNCTIONALITY ===
// the ui elements
const progress = document.querySelector('.js-progress-bar');
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
const content = document.querySelector('.js-content');
const contentParagraph = document.querySelector('.js-content-paragraph');
let timerParagraph = null;
let timer = null;
let hours = null;
let minutes = null;
let seconds = null;

// keping track of the state of each glass
let glassesArray = [false, false, false, false, false, false, false, false];
let glassesAmount = 0;
let lastGlassAt = null;

// utils
const MS_IN_HOUR = 3600000;

// initial setup
function init() {
  // listening for click events on the glasses container
  document.querySelector('.js-glasses-container')
    .addEventListener('click', function(event) {
      // passing the data-glass value of the element
      if (event.target.dataset.glass) {
        // only running the function if the element has a data-glass
        // because otherwise a glass wasn't pressed
        glassClick(event.target.dataset.glass);
      }
    });
}

// when a glass gets clicked
function glassClick(position) {

  if (glassesArray[position] === false) {
    // an empty glass was pressed

    let currently = new Date().getTime();

    // check if this is the first glass 
    // or if that no glass was drank in 2h
    if (lastGlassAt === null) {
      // first glass of the day

      // filling the glass
      glassesArray[position] = true;
      glassesUI[position].classList.toggle('--filled');
      glassesAmount++;
      lastGlassAt = new Date().getTime();

      // updating the progress bar
      progress.classList.toggle(`--filled-${glassesAmount}`);

      startTimer();
    } else {
      // check time since last glass
      timePassed = currently - lastGlassAt;
      

      // check if at least 2h have passed
      if (timePassed >= MS_IN_HOUR * 2) {
         // filling the glass
        glassesArray[position] = true;
        glassesUI[position].classList.toggle('--filled');
        glassesAmount++;
        lastGlassAt = new Date().getTime();

        // updating the progress bar
        progress.classList.toggle(`--filled-${glassesAmount}`);

        startTimer();
      } else {
        // send message to wait
      }
    }

  } else {
    // a filled glass was pressed

    // empting the glass
    glassesArray[position] = false;
    glassesUI[position].classList.toggle('--filled');
    glassesAmount--;

    // updating the progress bar
    progress.classList.toggle(`--filled-${glassesAmount + 1}`);

    // reset timer
    lastGlassAt = null;
  }
  
  updateContent();
}

// updating the content section
function updateContent() {
  let text = '';
  let timerText = `Next glass in `

  switch(glassesAmount) {
    case 0:
      text = `Take your first glass of water of the day, please... `;
      break;
    case 1:
      // break;
    case 2:
      // break;
    case 3:
      // break;
    case 4:
      // break;
    case 5:
      // break;
    case 6:
      // break;
    case 7:
      text = `Feeling much better, right?`

      // check if timer paragraph exists
      if(timerParagraph === null) {
        // doesnt exist -> create it
        let newTimerParagraph = document.createElement('p');
        newTimerParagraph.classList.add('js-timer-paragraph');
        newTimerParagraph.classList.add('content__paragraph');
        newTimerParagraph.textContent = timerText;

        // create the content__timer
        let newTimer = document.createElement('span');
        newTimer.classList.add('content__timer');
        
        // create the timer digits
        let newHour = document.createElement('span');
        newHour.classList.add('content__timer-element');
        newHour.classList.add('js-hours');
        newHour.textContent = '2h'
        let newMinute = document.createElement('span');
        newMinute.classList.add('content__timer-element');
        newMinute.classList.add('js-minutes');
        newMinute.textContent = '00m'
        let newSecond = document.createElement('span');
        newSecond.classList.add('content__timer-element');
        newSecond.classList.add('js-seconds');
        newSecond.textContent = '00s'
        
        newTimer.appendChild(newHour);
        newTimer.appendChild(newMinute);
        newTimer.appendChild(newSecond);
        newTimerParagraph.appendChild(newTimer);
        content.appendChild(newTimerParagraph);

        // setting the UI
        timerParagraph = document.querySelector('.js-timer-paragraph');
        hours = document.querySelector('.js-hours');
        minutes = document.querySelector('.js-minutes');
        seconds = document.querySelector('.js-seconds');
      } else {
        // only update the timer
      }

      break;
    case 8:
      text = `Congratulations! You took your daily dosis of water today, good job! `
      break;
  }

  // updating the content of the paragraphs
  contentParagraph.textContent = text;
  if (glassesAmount === 0 || glassesAmount === 8) {
    content.removeChild(timerParagraph);
    timerParagraph = null;
  }
}
let i = 0;

function startTimer() {
  let interval = setInterval(function() {   
    let currentTime = new Date().getTime();

    // total seconds passed
    let secondsPassed = (currentTime - lastGlassAt) / 1000;
    // 2 hours - seconds passed
    let timeLeft = (MS_IN_HOUR * 2 / 1000) - secondsPassed;

    // stopping timer when the 2h passed
    if (timeLeft <= 1) {
      clearInterval(interval);
    }
    
    // converting the seconds in h m s
    let hoursLeft = Math.floor( (timeLeft / (60 * 60)) % 24);
    let minutesLeft = Math.floor( (timeLeft / 60) % 60 );
    let secondsLeft = Math.floor(timeLeft % 60);
  
    // display result  
    hours.innerText = hoursLeft + 'h';

    if (minutesLeft < 10) {
      minutes.innerText = '0' + minutesLeft + 'm';
    } else {
      minutes.innerText = minutesLeft + 'm';
    }

    if (secondsLeft < 10) {
      seconds.innerText = '0' + secondsLeft + 's';
    } else {
      seconds.innerText = secondsLeft + 's';
    }
  }, 1000);
}

// initialization
init();