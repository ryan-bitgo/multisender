//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultiSender {
    event SendETH(address indexed from, address indexed to, uint256 amount);

    function sendETH(
        uint256[] memory amounts,
        address payable[] memory recipients
    ) public payable {
        require(
            amounts.length == recipients.length,
            "amounts length is not equal to recipients length"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed.");
            emit SendETH(msg.sender, recipients[i], amounts[i]);
        }
    }

    function sendERC20(
        address[] memory tokenAddresses,
        uint256[] memory amounts,
        address payable[] memory recipients
    ) public {
        require(
            tokenAddresses.length == amounts.length,
            "tokens length is not equal to amounts length"
        );

        require(
            amounts.length == recipients.length,
            "amounts length is not equal to recipients length"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            IERC20 token = IERC20(tokenAddresses[i]);
            bool success = token.transferFrom(
                msg.sender,
                recipients[i],
                amounts[i]
            );
            require(success, "Transfer failed.");
        }
    }

    function sendETHAndERC20(
        address[] memory tokenAddresses,
        uint256[] memory amounts,
        address payable[] memory recipients
    ) public payable {
        require(
            tokenAddresses.length == amounts.length,
            "tokens length is not equal to amounts length"
        );

        require(
            amounts.length == recipients.length,
            "amounts length is not equal to recipients length"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            if (tokenAddresses[i] != address(0)) {
                IERC20 token = IERC20(tokenAddresses[i]);
                bool success = token.transferFrom(
                    msg.sender,
                    recipients[i],
                    amounts[i]
                );
                require(success, "Transfer failed.");
            } else {
                (bool success, ) = recipients[i].call{value: amounts[i]}("");
                require(success, "Transfer failed.");
                emit SendETH(msg.sender, recipients[i], amounts[i]);
            }
        }
    }
}
