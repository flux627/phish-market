import {useContext, useEffect, useState} from "react";
import InnerHTML from 'dangerously-set-html-content'
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {createContractHelper} from "./createContractHelper";
import phishMarketArtifact from "./artifacts/contracts/PhishMarket.sol/PhishMarket.json";
import {Web3ProviderContext} from "./Web3ProviderContext";

export function TokenView() {
  const { tokenIdStr } = useParams()
  const tokenId = parseInt(tokenIdStr)
  const [tokenIdInvalid, setTokenIdInvalid] = useState(false)
  const [metadataCid, setMetadataCid] = useState()
  const [metadata, setMetadata] = useState()
  const [htmlCid, setHtmlCid] = useState()
  const [dangerousHtml, setDangerousHtml] = useState()

  const { provider } = useContext(Web3ProviderContext)

  const phishMarket = createContractHelper(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    phishMarketArtifact.abi,
    provider,
    true
  )

  useEffect(() => {
    phishMarket.reader.tokenURI(tokenId)
      .then((tokenUri) => {
        setMetadataCid(tokenUri.split('ipfs://')[1])
      })
      .catch((e) => {
        setTokenIdInvalid(true)
      })
  }, [])

  useEffect(() => {
    if (!metadataCid) return
    fetch(`https://gateway.pinata.cloud/ipfs/${metadataCid}`)
      .then((result) => {
        result.json().then(setMetadata)
      })
  }, [metadataCid])

  useEffect(() => {
    if (!metadata) return
    setHtmlCid(metadata.dangerousHtml.split('ipfs://')[1])
  }, [metadata])

  useEffect(() => {
    if (!htmlCid) return
    fetch(`https://gateway.pinata.cloud/ipfs/${htmlCid}`)
      .then((result) => {
        result.text().then(setDangerousHtml)
      })
  }, [htmlCid])

  if (tokenIdInvalid) {
    return <div>
      Invalid token ID!
    </div>
  }

  return <div>
    <div>{`${tokenId}: ${metadata ? metadata.name : '...'}`}</div>
    {dangerousHtml && <DangerBox><InnerHTML html={dangerousHtml} /></DangerBox>}
    {metadata?.description && <div>Description:<br />{metadata.description}</div>}
  </div>
}

const DangerBox = styled.div`
  width: 600px;
  height: 600px;
  margin: 40px auto;
  border: #ffffff82 3px solid;
  background: #00000026;
  box-shadow: #00000052 8px 8px;
  display: grid;
  align-items: stretch;
`