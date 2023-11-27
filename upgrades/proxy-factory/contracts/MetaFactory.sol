// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MetaCoin.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MetaFactory is Initializable {
    bool public hasBeenDeployed;

    mapping(address => MetaCoin) public metacoinMapping;

    event MetaCoinCreation(
        MetaCoin indexed metacoinContract,
        address indexed metacoinAddress
    );

    function initialize() public initializer {
        hasBeenDeployed = true;
    }

    function createMetacoin() public returns (address metacoinAddress) {
        MetaCoin newMetacoin = new MetaCoin();

        metacoinMapping[address(newMetacoin)] = newMetacoin;

        emit MetaCoinCreation(newMetacoin, address(newMetacoin));

        return address(newMetacoin);
    }

    function getMetacoinByAddress(address addr) public view returns (MetaCoin) {
        return metacoinMapping[addr];
    }
}
