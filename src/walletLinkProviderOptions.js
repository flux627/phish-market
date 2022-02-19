import { WalletLink } from 'walletlink';

const chainId = 1; // Select the appropriate chain ID
export const walletLinkProviderOptions = {
  'custom-walletlink': {
    display: {
      logo: 'assets/coinbase-wallet.svg', // Path to wallet link logo. Source https://github.com/walletlink/walletlink/blob/master/web/src/images/wallets/coinbase-wallet.svg
      name: 'WalletLink',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'Five Penguins', // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
      chainId,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};
