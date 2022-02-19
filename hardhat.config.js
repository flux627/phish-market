require("@nomiclabs/hardhat-waffle");
const keys = require("./keys.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },

    hardhat: {
      chainId: 1337
    },

    rinkeby: {
      chainId: 4,
      url: keys.rpc,
      gasPrice: 100e9,
      accounts: {
        mnemonic: keys.mnemonic
      }
    },
  },
};

