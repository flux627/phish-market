const hre = require("hardhat");

async function main() {
  const PhishMarket = await hre.ethers.getContractFactory("PhishMarket");
  const phishMarket = await PhishMarket.deploy("PhishMarket", "PHISH");

  await phishMarket.deployed();

  console.log("PhishMarket deployed to:", phishMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
