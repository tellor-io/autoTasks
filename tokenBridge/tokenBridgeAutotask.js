exports.handler = async function (payload) {
    const conditionRequest = payload.request.body;
    const matches = [];
    const events = conditionRequest.events;
    for (const evt of events) {
      const signature = evt.matchReasons[0].signature;
      const isDepositToLayer = signature.includes("depositToLayer");
      const isWithdrawFromLayer = signature.includes("withdrawFromLayer");
      const isAddStakingRewards = signature.includes("addStakingRewards");
      const isClaimExtraWithdrawalFee = signature.includes("claimExtraWithdraw");
      const isPauseBridge = signature.includes("pauseBridge");
      const isUnpauseBridge = signature.includes("unpauseBridge");
      let headline, address, amount, tip, depositId;
  
      if (isDepositToLayer === true) {
        headline = "DepositToLayer called!!!";
        amount = evt.matchReasons[0].args[0];
        tip = evt.matchReasons[0].args[1];
        address = evt.matchReasons[0].args[2];
        amount = (amount / 1e18).toString() + " trb";
        depositId = "n/a";
      } else if (isWithdrawFromLayer === true) {
        headline = "WithdrawFromLayer called!!!";
        amount = "check report";
        tip = "n/a";
        address = "check report";
        depositId = evt.matchReasons[0].args[3];
      } else if (isAddStakingRewards === true) {
        headline = "AddStakingRewards called!!!";
        amount = evt.matchReasons[0].args[0];
        tip = "n/a";
        address = "n/a";
        amount = (amount / 1e18).toString() + " trb";
        depositId = "n/a";
      } else if (isClaimExtraWithdrawalFee === true) {
        headline = "ClaimExtraWithdrawalFee called!!!";
        amount = "n/a";
        tip = "n/a";
        address = evt.matchReasons[0].args[0];
        depositId = "n/a";
      } else if (isPauseBridge === true) {
        headline = "PauseBridge called!!!";
        amount = "n/a";
        tip = "n/a";
        address = "n/a";
        depositId = "n/a";
      } else if (isUnpauseBridge === true) {
        headline = "UnpauseBridge called!!!";
        amount = "n/a";
        tip = "n/a";
        address = "n/a";
        depositId = "n/a";
      }
  
      // metadata can be any JSON-marshalable object (or undefined)
      matches.push({
        hash: evt.hash,
        metadata: {
          address: address,
          headline: headline,
          amount: amount,
          tip: tip,
          depositId: depositId,
          matchReasons: evt.matchReasons[0],
        },
      });
    }
    return { matches };
  };
  