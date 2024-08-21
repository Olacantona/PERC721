const { ethers, network } = require('hardhat');
const { encryptDataField } = require('@swisstronik/utils');
const fs = require('fs');
const path = require('path');
const deployedAddress = require('../utils/deployed-address');

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpclink = network.config.url;

  const [encryptedData] = await encryptDataField(rpclink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x2B3A246155cD4eA03b7648f61910f2B0eD248242";

  const [signer] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory('PERC721');
  const contract = contractFactory.attach(contractAddress);

  const mintFunctionName = 'mint';
  const recipientAddress = signer.address
  const tokenId = 1; // Replace with the token ID you want to mint

  const mintTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(mintFunctionName,))
  
  const mintReceipt = await mintTx.wait();
  console.log('Mint Transaction Hash: ', `https://explorer-evm.testnet.swisstronik.com/tx/${mintTx.hash}`);

  const mintEvent = mintReceipt.logs
    .map((log) => {
      try {
        return contract.interface.parseLog(log);
      } catch (e) {
        return null;
      }
    })
    .find((event) => event && event.name === 'Transfer'); // Assuming the mint event is 'Transfer' for ERC721

  const mintedTokenId = mintEvent?.args?.tokenId;
  console.log('Minted NFT ID: ', mintedTokenId.toString());

  const filePath = path.join(__dirname, '../utils/tx-hash.txt');
  fs.writeFileSync(filePath, `NFT ID ${tokenId} : https://explorer-evm.testnet.swisstronik.com/tx/${mintTx.hash}\n`, {
    flag: 'a',
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
