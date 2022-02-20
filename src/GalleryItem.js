import {useEffect, useState} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

export function GalleryItem({ tokenId, metadataUri }) {
  const [metadata, setMetadata] = useState()
  const [imageCid, setImageCid] = useState()

  const metadataCid = metadataUri.split('ipfs://')[1]

  useEffect(() => {
    fetch(`https://gateway.pinata.cloud/ipfs/${metadataCid}`)
      .then((result) => {
        result.json().then(setMetadata)
      })
  }, [])

  useEffect(() => {
    if (!metadata) return
    setImageCid(metadata.image.split('ipfs://')[1])
  }, [metadata])

  return <ItemWrap to={`token/${tokenId}`}>
    {imageCid && <ImagePreviewWrap><ImagePreview src={`https://gateway.pinata.cloud/ipfs/${imageCid}`} /></ImagePreviewWrap>}
    <Title>{`${tokenId}: ${metadata ? metadata.name : '...'}`}</Title>
  </ItemWrap>
}

const Title = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`

const ImagePreview = styled.img`
  width: 300px;
  align-self: center;
`

const ImagePreviewWrap = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
`

const ItemWrap = styled(Link)`
  width: 300px;
  background: #aaa;
  border: double 11px white;
  padding: 10px;
  box-shadow: #00000052 8px 8px;
  
  &:active {
    box-shadow: none;
    margin: 8px -8px -8px 8px;
  }
`

const separator = styled.div`

`