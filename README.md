# Waterly

---

## User flow

INITIALS:
MS_PER_HOUR = 360000
activeTimer = false -> keeps track if there's an active timer
glassesAmount = 0 -> keeps track of amount of glasses
glassesArray = [ -> abstract representation of each glass state
  false, false,
  false, false,
  false, false,
  false, false
;]
lastGlassAt -> to save the date of last tracked glass
passedTime = null; -> to track passed time if there's an active timer

- User clicks
- is it a glass?
  - YES -> is it empty?
    - YES -> is there an active timer?
      - YES -> has more than 1h passed?
        - YES -> fill glass
            - update glassesArray and glassesUI
            - glassesAmount++
            - save current time in lastGlassAt
          - update message
          - start timer INTERVAL EACH SECOND
            - create timer message
            - get currentTime
            - compare lastGlassAt to get passedTime
            - is passedTime < 1?
              - YES -> activeTimer = true
                - update hours / minutes / seconds
              - NO -> timer has ended
                - activeTimer = false
                - passedTime = null;
                - update timer message: ask user to drink
        - NO -> wait alert
      - NO -> fill glass
            - update glassesArray and glassesUI
            - glassesAmount++
            - save current time in lastGlassAt
          - update message
            - is amount 0?
              - YES -> ask to drink first glass
              - NO -> is amount 8?
                - YES -> congratulate from filling
                - NO -> add message
                  - add timer message
          - start timer INTERVAL EACH SECOND
            - get currentTime
            - compare lastGlassAt to get passedTime
            - is passedTime < 1?
              - YES -> activeTimer = true
              - NO -> timer has ended
                - activeTimer = false
                - passedTime = null;
                - in timer message: ask user to drink
    - NO -> empty the glass
      - restart timer
- NO -> do nothing

LOCALSTORAGE NEEDS
glassesArray -> to properly show the filled arrays
lastGlassAt -> to get when was the last glass taken

ON LOAD
- is there something in the local storage?
  - YES -> is the data from TODAY?
    - YES -> update ui
      - check glassesArray
        - fill the ones with true
      - get amount of glasses from it
        - fill the progress bar
        - update message
      - compare lastGlassAt to get passedTime
      - is passedTime < 1?
        - YES -> activeTimer = true
        - NO -> timer has ended
          - activeTimer = false
          - passedTime = null;
    - NO -> clear storage
  - NO -> do nothing