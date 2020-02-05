# v1

Goals: refactor current app 

Completed:

## Steps

USER STORIES:
- As an USER i should click BUTTON to add a glass of water
- i can log another glass after 1h of the last one
- goal is to drink 8 glasses through the day
- remind me to drink if i havent done so in 2h
- should reset each day
- visualize current glasses amount

CONSTANTS:
GOAL_AMOUNT = 8;
MIN_TIME_SINCE = 1h;
MAX_TIME_SINCE = 2h;

STATES:
glasses abstraction
last glass time

EVENTS:
group of button classes

FUNCTIONS:
is new day? reset
has min time passed? allow drink
has max time passed? remind drink
goal amount reached? congrats