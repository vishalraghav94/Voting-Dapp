const fs = require('fs');
const candidates = require('./candidates.js');
const solc = require('solc');
const web3 = require('./web3Instance.js');
const code = fs.readFileSync('Voting.sol').toString();
const compiledCode = solc.compile(code);
const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
const contract = web3.eth.contract(abiDefinition);
const byteCode = compiledCode.contracts[':Voting'].bytecode;

const deployedContract = contract.new(candidates, {data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
module.exports = deployedContract;