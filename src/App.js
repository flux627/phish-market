import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import './App.css'
import Header from "./Header";
import {Web3Provider} from "./Web3ProviderContext";

function App() {
  return (
    <Web3Provider>
      <Wrap>
        <Header />
        <Outlet />
      </Wrap>
    </Web3Provider>
  )
}

const Wrap = styled.div`
  margin: 0 auto;
  width: 94%;
  max-width: 800px;
  padding: 0 3%;
`

export default App
