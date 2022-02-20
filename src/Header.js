import {useContext, useState} from "react";
import styled from "styled-components";
import {Web3ProviderContext} from "./Web3ProviderContext";
import phishLogo from "./images/phish.png"
import onlineIcon from "./images/online.png"
import {createContractHelper} from "./createContractHelper";
import PhishMarketABI from "./artifacts/contracts/PhishMarket.sol/PhishMarket.json";
import {Link} from "react-router-dom";

const phishMarketAddress = process.env.REACT_APP_CONTRACT_ADDRESS
const correctChainId = process.env.REACT_APP_LOCAL_DEV === 'true' ? 1337 : 1

function Header() {
  const { connectToWeb3, disconnectFromWeb3, activeAddress, provider, chainId } = useContext(Web3ProviderContext)
  const [isOpen, setIsOpen] = useState(false)

  const NAV_LINKS = [
    // { text: 'Twitter', href: 'https://twitter.com/shapiro500', targetBlank: true },
  ]

  function makeLinks(styledATag, onClick = () => {}, className = 'desktopNav') {
    const ATag = styled.a`${styledATag.componentStyle.rules[0]}`
    return NAV_LINKS.map((link) => {
      if (link.hide) return null
      if (link.onClick) {
        const originalOnClick = onClick
        onClick = () => {
          originalOnClick()
          link.onClick()
        }
      }
      if (link.targetBlank) {
        return <ATag className={className} onClick={onClick} href={link.href} target={'_blank'} rel={"nofollow"}>{link.text}</ATag>
      }
      return <ATag className={className} onClick={onClick} href={link.href}>{link.text}</ATag>
    })
  }

  // const phishMarket = createContractHelper(phishMarketAddress, PhishMarketABI.abi, provider, !activeAddress)
  // const onCorrectChain = !chainId || chainId === correctChainId

  const ConnectedAddress = <ConnectedAddressWrap>
    <_ConnectedAddress>
      <Online src={onlineIcon} />
      {activeAddress?.slice(0,6)}…{activeAddress?.slice(-4)}
    </_ConnectedAddress>
    <Disconnect onClick={disconnectFromWeb3}>✖</Disconnect>
  </ConnectedAddressWrap>

  const ConnectOrConnectedAddress = activeAddress ?
    [ConnectedAddress]
    : <ConnectWalletButton onClick={connectToWeb3}>Connect Wallet</ConnectWalletButton>

  const logo = <LogoDiv to="/">
    <img src={phishLogo} />phish.market
  </LogoDiv>

  return (
    <Wrap>
      <TopLinks>
        {logo}
        <Nav>
          <HamburgerDiv onClick={() => setIsOpen(!isOpen)}>
            <img width={35} height={35} src="/menu.svg"/>
          </HamburgerDiv>
          <Menu isOpen={isOpen}>
            {makeLinks(NavItem, () => setIsOpen(false), 'mobileNav')}
          </Menu>
        </Nav>
        {makeLinks(A)}
        {ConnectOrConnectedAddress}
      </TopLinks>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  margin-bottom: 35px;
`;

const TopLinks = styled.div`
  font-size: 18px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 5%;
  height: 73px;

  @media (max-width: 624px) {
      padding: 0 20px;
    }

  .desktopNav {
    @media (max-width: 624px) {
      display: none;
    }
  }
`;

const A = styled.a`
  text-align: center;
  line-height: 1.4;
`;

// mobile nav

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  @media screen and (min-width: 625px) {
    display: none;
  }
`;

const HamburgerDiv = styled.div`
  cursor: pointer;
  padding: 20px 15px 0px 0px;
`;

const LogoDiv = styled(Link)`
  font-size: 32px;
  img {
    height: 40px;
    vertical-align: middle;
    margin-right: 10px;
  }
`

const Menu = styled.div`
  display: flex;
  background: white;
  position: absolute;
  top: 65px;
  z-index: 1;
  overflow: hidden;
  flex-direction: column;
  width: 94%;
  margin-top: 5px;
  margin-left: -20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  max-height: ${( { isOpen }) => isOpen ? "300px" : "0px"};
  transition: max-height 0.3s ease-in;
`;

const NavItem = styled.a`
  color: black;
  font-weight: 400;
  padding: 20px 0px 20px 15px;
`;

const ConnectWalletButton = styled.button`
  color: inherit;
  background-color: #5dc09b;
  height: 42px;
  border-width: 0;
  padding: 11px; 
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
  font-weight: bold;
  box-shadow: #00000052 8px 8px;
  &:active {
    box-shadow: none;
    margin: 8px -8px -8px auto;
  }
`

const ConnectedAddressWrap = styled.div`
  margin-left: auto;
  display: flex;
  box-shadow: #00000052 8px 8px;
`

const _ConnectedAddress = styled.div`
  background: #5dc09b;
  padding: 5px 10px 3px 7px;
  border-radius: 0px;
  font-size: 16px;
  font-weight: bold;
  user-select: none;
  height: 34px;
  display: flex;
  align-items: center;
`

const Online = styled.img`
  width: 30px;
  align-self: center;
  display: inline-block;
  margin-right: 10px;
`

const Disconnect = styled.div`
  background: #ac4e8b;
  padding: 5px 7px 5px 7px;
  border-radius: 0px;
  font-family: monospace;
  width: 20px;
  text-align: center;
  font-size: 26px;
  line-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  height: 32px;
  &:active {
    box-shadow: none;
    margin: 8px -8px -8px 8px;
  }
`

export default Header;
