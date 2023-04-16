# autoTasks 

## Create a new label 
All ```queryData``` will get decoded before being pushed, but creating a ```label``` through the ```queryId``` makes the final discord message look nicer. 
  
  
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
