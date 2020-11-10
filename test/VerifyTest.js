const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const EthCrypto = require("eth-crypto");

const Verify = artifacts.require("Verify");

contract("Verify - Test Verify contract", (accounts) => {


  let contractInstance;
  let signerIdentity;

  beforeEach(async () => {

    signerIdentity = EthCrypto.createIdentity();

    // Deploy Verify contract
    contractInstance = await Verify.new(signerIdentity.address, {from: accounts[0]} );

  });

  it("Send message and verify", async () => {

    const message = EthCrypto.hash.keccak256([
      { type: "uint256", value: "5" },
      { type: "string", value: "Banana" }
    ]);
    const signature = EthCrypto.sign(signerIdentity.privateKey, message);

    console.log(`\nmessage: ${message}`);
    console.log(`signature: ${signature}`);
    console.log(`signer public key: ${signerIdentity.address}`);

    const result = await contractInstance.splitSignature(signature);
    console.log('\nv,r,s = ',result);

    const signerAddr = await contractInstance.recoverSigner(message, signature);
    console.log('Signer Address = ', signerAddr);

    const isValid = await contractInstance.isValidData(5, "Banana", signature);
    console.log('\nisValidData = ',isValid);
  })

})
