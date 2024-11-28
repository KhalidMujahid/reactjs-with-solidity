// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Deposite{
    address payable public mainAddress;
    address payable public secondaryAddress;
    uint256 public mainAddressPercentage;
    
    event Deposited(address indexed sender, uint256 amount, uint256 mainAmount, uint256 secondaryAmount);

    constructor(address payable _mainAddress, address payable _secondaryAddress, uint256 _mainAddressPercentage) {
        require(_mainAddress != address(0), "Main address cannot be zero address");
        require(_secondaryAddress != address(0), "Secondary address cannot be zero address");
        require(_mainAddressPercentage <= 100, "Percentage cannot be greater than 100");

        mainAddress = _mainAddress;
        secondaryAddress = _secondaryAddress;
        mainAddressPercentage = _mainAddressPercentage;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");

       
        uint256 mainAmount = (msg.value * mainAddressPercentage) / 100;
        uint256 secondaryAmount = msg.value - mainAmount;

       
        (bool sentToMain, ) = mainAddress.call{value: mainAmount}("");
        require(sentToMain, "Failed to send Ether to the main address");

        (bool sentToSecondary, ) = secondaryAddress.call{value: secondaryAmount}("");
        require(sentToSecondary, "Failed to send Ether to the secondary address");

        emit Deposited(msg.sender, msg.value, mainAmount, secondaryAmount);
    }

    
    function changeMainAddress(address payable _newMainAddress) external {
        require(_newMainAddress != address(0), "Address cannot be zero address");
        mainAddress = _newMainAddress;
    }

  
    function changeSecondaryAddress(address payable _newSecondaryAddress) external {
        require(_newSecondaryAddress != address(0), "Address cannot be zero address");
        secondaryAddress = _newSecondaryAddress;
    }

    function changeMainAddressPercentage(uint256 _newPercentage) external {
        require(_newPercentage <= 100, "Percentage cannot be greater than 100");
        mainAddressPercentage = _newPercentage;
    }
}
