// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@opengsn/contracts/src/forwarder/IForwarder.sol";
import "@opengsn/contracts/src/BasePaymaster.sol";

contract Paymaster is BasePaymaster {
  mapping(address => bool) public targets;

  event TargetAdded(address newTarget);

  constructor(address[] memory _targets) {
    addTargets(_targets);
  }

  function versionPaymaster()
    external
    view
    virtual
    override
    returns (string memory)
  {
    return "2.2.0";
  }

  function addTargets(address[] memory _targets) public onlyOwner {
    for (uint256 i = 0; i < _targets.length; i++) {
      address _target = _targets[i];
      targets[_target] = true;
      emit TargetAdded(_target);
    }
  }

  function preRelayedCall(
    GsnTypes.RelayRequest calldata relayRequest,
    bytes calldata signature,
    bytes calldata approvalData,
    uint256 maxPossibleGas
  )
    external
    virtual
    override
    returns (bytes memory context, bool revertOnRecipientRevert)
  {
    (relayRequest, signature, approvalData, maxPossibleGas);
    return ("", false);
  }

  function postRelayedCall(
    bytes calldata context,
    bool success,
    uint256 gasUseWithoutPost,
    GsnTypes.RelayData calldata relayData
  ) external virtual override {
    (context, success, gasUseWithoutPost, relayData);
  }
}
