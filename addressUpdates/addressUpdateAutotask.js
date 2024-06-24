exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {

    // check if the tx is for submitValue or updateStakeAmount
    const signature = evt.matchReasons[0].signature;
    const timestamp = evt.timestamp;

    const isUpdateStakeAmount = signature.includes("updateStakeAmount");
    const isSubmitValue = signature.includes("submitValue");

    let data, message;
    let worthy = false;

    // if updateStakeAmount, get the new stake amount
    if (isUpdateStakeAmount === true) {
      message = "updateStakeAmount";
      data = evt.matchReasons[0].args[0];
      worthy = true;
    } else if (isSubmitValue === true) {
      const queryId = evt.matchReasons[0].args[0];
      const queryData = evt.matchReasons[0].args[3];

      if (queryId == '0x3ab34a189e35885414ac4e83c5a7faa9d8f03a4d530728ef516d203d91d6309c') {
        message = "autopay address report";
        data  = queryData
        worthy = true;
      } else if (queryId == '0xcf0c5863be1cf3b948a9ff43290f931399765d051a60c3b23a4e098148b1f707') {
        message = "oracle address report";
        data = queryData;
        worthy = true;
      }
    }

    if (worthy === true) {
      matches.push({
        hash: evt.hash,
        metadata: {
          message: message,
          timestamp: timestamp,
          data: data
        }
      });
    }
  }
  return { matches }
}