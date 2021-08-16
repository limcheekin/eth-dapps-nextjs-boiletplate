// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// REF: https://github.com/ethereum/ethereum-org/blob/master/views/content/greeter.md
contract Greeter {    
    string public greeting;
    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    function greet(string memory name) public view returns (string memory) {
        return concat(greeting, name);
    }

    // REF: https://betterprogramming.pub/solidity-playing-with-strings-aca62d118ae5
    function concat(string memory s1, string memory s2)
        private
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(s1, s2));
    }    
}
