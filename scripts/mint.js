const hre = require("hardhat");
const pinataSDK = require('@pinata/sdk')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET)

async function pin(filename) {
  const filePath = path.join(process.cwd(), 'nft-data', process.argv[2], filename)
  if (!fs.existsSync(filePath)) {
    throw Error(`Not found- ${filePath}`)
  }
  const result = await pinata.pinFromFS(filePath)
  return result.IpfsHash
}

async function updateMetadata(imageCid, htmlCid) {
  const filePath = path.join(process.cwd(), 'nft-data', process.argv[2], 'metadata.json')
  if (!fs.existsSync(filePath)) {
    throw Error(`Not found- ${filePath}`)
  }
  const metadata = JSON.parse(fs.readFileSync(filePath))
  metadata.image = `ipfs://${imageCid}`
  metadata.dangerousHtml = `ipfs://${htmlCid}`
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2))
}

async function main() {
  if (!process.argv[2]) {
    throw Error('Must specify directory name')
  }
  if (!(await pinata.testAuthentication())) {
    throw Error('Wrong Pinata api key or secret')
  }

  const imageCid = await pin('image.png')
  const htmlCid = await pin('nft.html')
  await updateMetadata(imageCid, htmlCid)
  const metadataCid = await pin('metadata.json')

  const signers = await hre.ethers.getSigners()
  const phishMarket = await hre.ethers.getContractAt(
    "PhishMarket",
    process.env.REACT_APP_CONTRACT_ADDRESS,
    signers[0],
  );
  const tx = await phishMarket.mint(metadataCid)
  await tx.wait()

  console.log("Minted!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
