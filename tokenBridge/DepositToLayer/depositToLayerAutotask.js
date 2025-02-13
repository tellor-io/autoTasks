exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {
    const signature = evt.matchReasons[0].signature;
    let amount, layerRecipient, tip;

    headline = "DepositToLayer called !";
    amount = evt.matchReasons[0].args[0];
    tip = evt.matchReasons[0].args[1];
    layerRecipient = evt.matchReasons[0].args[2];
    amount = (amount / 1e18).toString() + " trb";
    tip = (tip / 1e18).toString() + " trb";

    // metadata can be any JSON-marshalable object (or undefined)
    matches.push({
      hash: evt.hash,
      metadata: {
        headline: headline,
        amount: amount,
        layerRecipient: layerRecipient,
        tip: tip,
      },
    });
  }
  return { matches };
};
