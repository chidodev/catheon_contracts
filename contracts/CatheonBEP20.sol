// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.7.5;

import "./libraries/SafeMath.sol";

import "./interfaces/IBEP20.sol";
import "./interfaces/ICatheon.sol";
import "./interfaces/IBEP20Permit.sol";
import "./interfaces/ICatheonAuthority.sol";

import "./types/BEP20Permit.sol";
import "./types/CatheonAccessControlled.sol";

contract CatheonBEP20Token is BEP20Permit, ICatheon, CatheonAccessControlled {
    using SafeMath for uint256;

    uint256 private constant MAX_UINT256 = type(uint256).max;
    uint256 private constant INITIAL_FRAGMENTS_SUPPLY = 5_000_000 * 10**9;
        
    constructor(address _authority)
        BEP20("Catheon", "CHN", 9)
        BEP20Permit("Catheon")
        CatheonAccessControlled(ICatheonAuthority(_authority))
    {
         _totalSupply = INITIAL_FRAGMENTS_SUPPLY;
         _balances[authority.governor()] = _totalSupply;
         emit Transfer(address(0), authority.governor(), _totalSupply);
    }
        
    function getOwner() external view override returns (address) {
        return authority.governor();
    }    

    // function transfer(address to, uint256 value) public override(IBEP20, BEP20) returns (bool) {
    
    //     _balances[msg.sender] = _balances[msg.sender].sub(value);
    //     _balances[to] = _balances[to].add(value);

    //     require(balanceOf(msg.sender) >= value, "Exceed: Insufficient token amount");
    //     emit Transfer(msg.sender, to, value);
    //     return true;
    // }

    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 value
    // ) public override(IBEP20, BEP20) returns (bool) {
    //     _allowances[from][msg.sender] = _allowances[from][msg.sender].sub(value);
    //     emit Approval(from, msg.sender, _allowances[from][msg.sender]);

    //     _balances[from] = _balances[from].sub(value);
    //     _balances[to] = _balances[to].add(value);

    //     require(balanceOf(from) >= value, "Exceed: Insufficient token amount");
    //     emit Transfer(from, to, value);
    //     return true;
    // }

    // function approve(address spender, uint256 value) public override(IBEP20, BEP20) returns (bool) {
    //     _approve(msg.sender, spender, value);
    //     return true;
    // }

    // function increaseAllowance(address spender, uint256 addedValue) public override returns (bool) {
    //     _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
    //     return true;
    // }

    // function decreaseAllowance(address spender, uint256 subtractedValue) public override returns (bool) {
    //     uint256 oldValue = _allowances[msg.sender][spender];
    //     if (subtractedValue >= oldValue) {
    //         _approve(msg.sender, spender, 0);
    //     } else {
    //         _approve(msg.sender, spender, oldValue.sub(subtractedValue));
    //     }
    //     return true;
    // }

   
}
