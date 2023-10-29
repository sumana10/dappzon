import { useEffect,useState } from 'react';
import './App.css';
import { ethers, BrowserProvider } from 'ethers';

//Components
import Navigation from "./components/Navigation";
import Section from  "./components/Section";
import Product from "./components/Product";

//ABIS

// 0x5FbDB2315678afecb367f032d93F642f64180aa3

//Config

function App() {
  const [account,setAccount]=useState(null);
  const [provider,setProvider]=useState(null);

  //lets conncect to block chain data and get the account details;
  const loadBlockChainData= async()=>{
    // console.log(window.ethereum.selectedAddress);
    // const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
    // const account= ethers.getAddress(accounts[0]);
    // setAccount(account)
    

    //Connect to Block Chain
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network= await provider.getNetwork();
    console.log(network);

  };
  useEffect(()=>{
    loadBlockChainData();
  },[])
  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
         <h2>Dappazon Best Sellers</h2>
     </div>
  );
}

export default App;
