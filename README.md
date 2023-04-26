# AutoTasks 

## Overview 
This project uses OpenZeppelin autotasks and sentinels to send a message everytime someone calls the ```submitValue``` function on the TellorFlex contract. 


### Accessing function arguments in an autotask

An autotask can be used to decode the parameters from a function that is being watched by a sentinel.
Both ```decodingForSentinel.js``` and ```dvmAutotask.js``` decode the data sent through the ```submitValue``` function. 
```    
function submitValue(
        bytes32 _queryId,
        bytes calldata _value,
        uint256 _nonce,
        bytes calldata _queryData
    )
```
Since the ```queryId``` is the function's first argument, it can be accessed in the autotask using ``` const queryId = evt.matchReasons[0].args[0]; ```
``` value ``` is accessed using ``` const value = evt.matchReasons[0].args[1]; ```. 

### Customizing labels/values in autotasks
All ```queryData``` will get decoded before being pushed, but a ```label``` or different ```value``` calculation can be hardcoded for any ```queryId```. 
  
  1. store the query ID 
  
  ```javascript 
     const newId = '0x...';
  ```
  
  2. add a new if statement to create the corresponding label or value calculation.
  
  ```javascript
     if (queryId === newId) {
     label = 'new / USD';
     value = ... ;
     }
  ```
  
# Sentinels

### Customizing Sentinel messages

Within each sentinel, notifications can be customized using limited markdown syntax.  (https://docs.openzeppelin.com/defender/sentinel#customizing-notification-messages)

