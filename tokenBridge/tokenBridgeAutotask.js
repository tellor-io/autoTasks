exports.handler = async function (payload) {
    const conditionRequest = payload.request.body;
    const matches = [];
    const events = conditionRequest.events;
    for (const evt of events) {

      const signature = evt.matchReasons[0].signature;
      // const isDepositToLayer = signature.includes("depositToLayer");
      // const isWithdrawFromLayer = signature.includes("withdrawFromLayer");
      const isAddStakingRewards = signature.includes("addStakingRewards");
      const isClaimExtraWithdrawalFee = signature.includes("claimExtraWithdraw");
      const isPauseBridge = signature.includes("pauseBridge");
      const isUnpauseBridge = signature.includes("unpauseBridge");
    
      let amount, address;
  
      // if (isDepositToLayer === true) {
      //   headline = "DepositToLayer called !";
      //   amount = evt.matchReasons[0].args[0];
      //   tip = evt.matchReasons[0].args[1];
      //   address = evt.matchReasons[0].args[2];
      //   amount = (amount / 1e18).toString() + " trb";
      //   tip = (tip / 1e18).toString() + " trb";
      //   args = [amount, tip, address];
      // } else if (isWithdrawFromLayer === true) {
      //   headline = "WithdrawFromLayer called!!!";
      //   args = evt.matchReasons[0].args;
      if (isAddStakingRewards === true) {
        headline = "AddStakingRewards called !";
        amount = evt.matchReasons[0].args[0];
        amount = (amount / 1e18).toString() + " trb";
        address = "check tx"
      } else if (isClaimExtraWithdrawalFee === true) {
        headline = "ClaimExtraWithdrawalFee called !";
        address = evt.matchReasons[0].args[0];
        amount = "check tx"
      } else if (isPauseBridge === true) {
        headline = "PauseBridge called !";
        address = "n/a"
        amount = "n/a"
      } else if (isUnpauseBridge === true) {
        headline = "UnpauseBridge called !";
        address = "n/a"
        amount = "n/a"
      }
  
      // metadata can be any JSON-marshalable object (or undefined)
      matches.push({
        hash: evt.hash,
        metadata: {
          headline: headline,
          amount: amount,
          address: address
        },
      });
    }
    return { matches };
  };
  