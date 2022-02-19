import {InfuraProvider, JsonRpcProvider} from "@ethersproject/providers";

let readOnlyProvider
if (process.env.REACT_APP_LOCAL_DEV === 'true') {
  readOnlyProvider = new JsonRpcProvider('http://localhost:8545')
} else {
  readOnlyProvider = new InfuraProvider('rinkeby', process.env.REACT_APP_INFURA_PROJECT_ID)
}

export { readOnlyProvider };
