# AutoTasks 

## Overview 
This project uses OpenZeppelin autotasks and sentinels to mimic a price feed but on Discord. The sentinel sends a Discord message everytime someone calls the ```submitValue``` function on the TellorFlex contract, and the message data is defined by the autotask. 


### Accessing function arguments

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
Since the ```queryId``` is the function's first argument, it can be accessed using ``` evt.matchReasons[0].args[0];. ```
Similarly, ``` value ``` is accessed using ``` evt.matchReasons[0].args[1]; ```, and so on for each of the function in question's arguments.

### Decoding
Query Data is decoded using the decodeParameter function from the web3-eth-abi package. It reads the type, but not the data afterwards. Looking for better solutions still.


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

A sentinel needs built to watch the TellorFlex contract on each network. Each sentinel can be assigned to send a discord message by connecting it to a discord webhook. 

### Customizing Sentinel messages

Within each sentinel, notifications can be customized using limited markdown syntax.  (https://docs.openzeppelin.com/defender/sentinel#customizing-notification-messages)

