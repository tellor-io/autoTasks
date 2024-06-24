exports.handler = async function (payload) {
  const conditionRequest = payload.request.body;
  const matches = [];
  const events = conditionRequest.events;
  for (const evt of events) {
      const signature = evt.matchReasons[0].signature;
      const isNewStaker = signature.includes("NewStaker");
      const isStakeWithdrawRequested = signature.includes("StakeWithdrawRequested");
      const isStakeWithdrawn = signature.includes("StakeWithdrawn");
      let event, address, amount;

      if (isNewStaker === true) {
          event = "Stake Deposited!"
          address = evt.matchReasons[0].args[0];
          amount = evt.matchReasons[0].args[1];
        amount = amount / 1e18;
      } else if (isStakeWithdrawRequested === true) {
          event = "Stake withdraw requested!"
          address = evt.matchReasons[0].args[0];
          amount = evt.matchReasons[0].args[1];
        amount = amount / 1e18;
      } else if (isStakeWithdrawn === true) {
          event = "Stake withdrawn!"
          address = evt.matchReasons[0].args[0];
          address = String(address)
          amount = "check withdraw request for " + address;
      }

      // metadata can be any JSON-marshalable object (or undefined)
      matches.push({
          hash: evt.hash,
          metadata: {
              address: address,
              event: event,
              amount: amount,
            matchReasons: evt.matchReasons[0],
          },
      });
  }
  return { matches };
};
