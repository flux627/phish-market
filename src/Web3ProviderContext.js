import {createContext, useEffect, useState} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {readOnlyProvider} from "./readOnlyProvider";
import {walletLinkProviderOptions} from "./walletLinkProviderOptions";


export const Web3ProviderContext = createContext({
  provider: null,
  signer: null,
  connectToWeb3: () => {},
  disconnectFromWeb3: () => {},
  activeAddress: null
})

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID // required
    }
  },
  ...walletLinkProviderOptions,
};

const web3Modal = new Web3Modal({
  network: "rinkeby", // optional
  cacheProvider: true,
  providerOptions // required
});


export function Web3Provider({ children }) {
  const [instance, setInstance] = useState(null)
  const [provider, setProvider] = useState(readOnlyProvider)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [activeAddress, setActiveAddress] = useState(null)

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', connectToWeb3)
      window.ethereum.on('chainIdChanged', connectToWeb3)
      window.ethereum.on('accountsChanged', connectToWeb3)
    }
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', connectToWeb3)
        window.ethereum.removeListener('chainIdChanged', connectToWeb3)
        window.ethereum.removeListener('accountsChanged', connectToWeb3)
      }
    }
  }, [])

  useEffect(() => {
    if (web3Modal.cachedProvider === 'injected' && window.ethereum?.isConnected) {
      connectToWeb3()
    }
  }, [])

  async function connectToWeb3() {
    const instance = await web3Modal.connect()
    const _provider = new ethers.providers.Web3Provider(instance)
    const _signer = _provider.getSigner()
    const network = await _provider.getNetwork()
    const accounts = await _provider.listAccounts()
    setProvider(_provider)
    setSigner(_signer)
    setChainId(network.chainId)
    setActiveAddress(accounts[0])
  }

  async function disconnectFromWeb3() {
    if (instance && instance.currentProvider && instance.currentProvider.close) {
      await instance.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setInstance(null)
    setProvider(readOnlyProvider)
    setSigner(null)
    setActiveAddress(null)
    setChainId(null)
  }

  return (
    <Web3ProviderContext.Provider value={{
      provider,
      signer,
      activeAddress,
      chainId,
      connectToWeb3,
      disconnectFromWeb3
    }}>
      {children}
    </Web3ProviderContext.Provider>
  )
}