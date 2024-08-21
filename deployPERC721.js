const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    // Get the contract factory
    const PERC721 = await ethers.getContractFactory("PERC721");

    // Get the first signer, which will be the initial owner
    const [signer] = await ethers.getSigners();
    const initialOwner = signer.address;

    console.log("Deploying PERC721 contract...");

    // Deploy the contract
    const contract = await PERC721.deploy(initialOwner);
    await contract.waitForDeployment();

    // Get the deployed contract address
    const contractAddress = await contract.getAddress();
    console.log(`PERC721 contract deployed at address: ${contractAddress}`);

  const deployedAddressPath = path.join(__dirname, '..', 'utils', 'deployed-address.ts')
  const fileContent = `const deployedAddress = '${contractAddress}'\n\nexport default deployedAddress\n`
  fs.writeFileSync(deployedAddressPath, fileContent, { encoding: 'utf8' })
  console.log('Address written to deployed-address.ts')

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

