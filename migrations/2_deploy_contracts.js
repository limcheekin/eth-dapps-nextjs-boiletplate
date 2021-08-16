const Greeter = artifacts.require("Greeter");

module.exports = function (deployer) {
    const greeting = 'Hello, ';
    deployer.deploy(Greeter, greeting);
};
