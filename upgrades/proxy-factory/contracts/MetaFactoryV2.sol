// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MetaCoinV2.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MetaFactoryV2 is Initializable {
    bool public hasBeenDeployed;

    mapping(address => MetaCoinV2) public metacoinMapping;

    event MetaCoinCreation(
        MetaCoinV2 indexed metacoinContract,
        address indexed metacoinAddress
    );

    function initialize() public initializer {
        hasBeenDeployed = true;
    }

    function createMetacoin() public returns (address metacoinAddress) {
        MetaCoinV2 newMetacoin = new MetaCoinV2();

        metacoinMapping[address(newMetacoin)] = newMetacoin;

        emit MetaCoinCreation(newMetacoin, address(newMetacoin));

        return address(newMetacoin);
    }

    function getMetacoinByAddress(
        address addr
    ) public view returns (MetaCoinV2) {
        return metacoinMapping[addr];
    }
}
