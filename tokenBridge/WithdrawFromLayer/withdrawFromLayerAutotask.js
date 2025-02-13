exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {
    const signature = evt.matchReasons[0].signature;
    let depositId, sender, recipient, amount;

    // depositId, sender, recipeient, amount
    headline = "WithdrawFromLayer called !";
    depositId = evt.matchReasons[0].args[0];
    sender = evt.matchReasons[0].args[1];
    recipient = evt.matchReasons[0].args[2];
    amount = evt.matchReasons[0].args[3];
    amount = (amount / 1e18).toString() + " trb";

    // metadata can be any JSON-marshalable object (or undefined)
    matches.push({
      hash: evt.hash,
      metadata: {
        headline: headline,
        depositId: depositId,
        sender: sender,
        recipient: recipient,
        amount: amount,
      },
    });
  }
  return { matches };
};
