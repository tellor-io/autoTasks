# autoTasks 

## Overview 
This project makes OpenZeppelin defender sentinels send more concise and readable messages through an autotask. 

## Create a new label in autotask.js
All ```queryData``` will get decoded before being pushed, but a ```label``` can be hardcoded for any ```queryId```. 
  
  
  1. create a new variable to store the query ID 
  
  ```javascript 
     const newId = '0x...';
  ```
  
  2. add a new else if statement to create the matching label 
  
  ```javascript
     else if (queryId === newId) {
     label = 'new / USD';
     }
  ```
