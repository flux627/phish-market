import { ethers } from "ethers";
import {readOnlyProvider} from "./readOnlyProvider";

export function createContractHelper(address, abi, provider, readOnly) {
  if (readOnly) {
    const contractHelper = {
      reader: new ethers.Contract(address, abi, readOnlyProvider),
    }
    contractHelper.interface = contractHelper.reader.interface
    return contractHelper
  }
  const signer = provider.getSigner()
  const contractHelper = {
    reader: new ethers.Contract(address, abi, provider),
    signer: new ethers.Contract(address, abi, signer),
  }
  contractHelper.interface = contractHelper.reader.interface
  return contractHelper
}
