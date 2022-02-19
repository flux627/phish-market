import {useContext, useEffect, useState} from "react";
import {createContractHelper} from "./createContractHelper";
import phishMarketArtifact from "./artifacts/contracts/PhishMarket.sol/PhishMarket.json"
import {Web3ProviderContext} from "./Web3ProviderContext";
import {GalleryItem} from "./GalleryItem";
import styled from "styled-components";

export function Gallery() {
  const { provider } = useContext(Web3ProviderContext)
  const [totalSupply, setTotalSupply] = useState(0)
  const [metadataUris, setMetadataUris] = useState([])

  const phishMarket = createContractHelper(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    phishMarketArtifact.abi,
    provider,
    true
  )

  useEffect(() => {
    phishMarket.reader.totalSupply()
      .then((supply) => {
        setTotalSupply(supply.toNumber())
      })
  }, [provider])

  useEffect(() => {
    // if (totalSupply === 0) return
    const metadataUriPromises = []
    for (let i = 0; i < totalSupply; i++) {
      metadataUriPromises.push(phishMarket.reader.tokenURI(i))
    }
    Promise.all(metadataUriPromises).then(setMetadataUris)
  }, [provider, totalSupply])

  const galleryItems = metadataUris.map(
    (metadataUri, i) => <GalleryItem tokenId={i} metadataUri={metadataUri} />
  )

  return <GalleryWrap>
    {galleryItems}
  </GalleryWrap>
}

const GalleryWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
`