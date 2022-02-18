// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.7.5;

import "./libraries/Address.sol";
import "./libraries/SafeMath.sol";

import "./types/ERC20Permit.sol";

import "./interfaces/IxCatheon.sol";
import "./interfaces/IStaking.sol";

contract xCatheon is IxCatheon, ERC20Permit {
    /* ========== DEPENDENCIES ========== */

    using SafeMath for uint256;

    /* ========== EVENTS ========== */

    event LogSupply(uint256 indexed epoch, uint256 totalSupply);
    
    event LogStakingContractUpdated(address stakingContract);

    /* ========== MODIFIERS ========== */

    modifier onlyStakingContract() {
        require(msg.sender == stakingContract, "StakingContract:  call is not staking contract");
        _;
    }

    /* ========== STATE VARIABLES ========== */
    address internal initializer;
    address public stakingContract; // staking contract address 


    /* ========== CONSTRUCTOR ========== */

    constructor() ERC20("xCatheon", "xCHN", 9) ERC20Permit("Staked Catheon") {
        initializer = msg.sender;      
    }

 
    // do this last
    function initialize(address _stakingContract) external {
        require(msg.sender == initializer, "Initializer:  caller is not initializer");
        require(_stakingContract != address(0), "Staking contract address is not zero.");
        stakingContract = _stakingContract;
        emit LogStakingContractUpdated(stakingContract);
        initializer = address(0);
    }

   
    function approve(address spender, uint256 value) public override(IERC20, ERC20) returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public override returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public override returns (bool) {
        uint256 oldValue = _allowances[msg.sender][spender];
        if (subtractedValue >= oldValue) {
            _approve(msg.sender, spender, 0);
        } else {
            _approve(msg.sender, spender, oldValue.sub(subtractedValue));
        }
        return true;
    }

    /* ========== INTERNAL FUNCTIONS ========== */

    function _approve(
        address owner,
        address spender,
        uint256 value
    ) internal virtual override {
        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    /* ========== VIEW FUNCTIONS ========== */

    function balanceOf(address who) public view override(IERC20, ERC20) returns (uint256) {
        return _balances[who];
    }


    function allowance(address owner_, address spender) public view override(IERC20, ERC20) returns (uint256) {
        return _allowances[owner_][spender];
    }


    function mint(address account_, uint256 amount_) external override onlyStakingContract {
        _mint(account_, amount_);
    }

    function burn(uint256 amount) external override onlyStakingContract {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account_, uint256 amount_) external override onlyStakingContract {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) internal onlyStakingContract {
        uint256 decreasedAllowance_ = allowance(account_, msg.sender).sub(
            amount_,
            "ERC20: burn amount exceeds allowance"
        );

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }

}
