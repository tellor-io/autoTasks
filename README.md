# AutoTasks 

## Overview 
This project uses OpenZeppelin autotasks and sentinels to send a message everytime someone calls the ```submitValue``` function on the TellorFlex contract. 


### Accessing function arguments in an Autotask

```decodingForSentinel.js``` decodes the parameters from ```submitValue```. 
```    
function submitValue(
        bytes32 _queryId,
        bytes calldata _value,
        uint256 _nonce,
        bytes calldata _queryData
    )
```

### Customizing labels/values in autotask.js
All ```queryData``` will get decoded before being pushed, but a ```label``` can be hardcoded for any ```queryId```. 
  
  
  1. create a new variable to store the query ID 
  
  ```javascript 
     const newId = '0x...';
  ```
  
  2. add a new if statement to create the matching label 
  
  ```javascript
     else if (queryId === newId) {
     label = 'new / USD';
     }
  ```



### decodingForSentinelTemplate.md

## dvmAutotask.js

### dvmAutotaskTemplate.md



