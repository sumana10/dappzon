import { useEffect,useState } from 'react';
import './App.css';
import { ethers, BrowserProvider } from 'ethers';

//Components
import Navigation from "./components/Navigation";
import Section from  "./components/Section";
import Product from "./components/Product";

//ABIS
import Dappazon from "./abis/Dappazon.json";
//Config
import config from "./config.json"

function App() {
  const [account,setAccount]=useState(null);
  const [provider,setProvider]=useState(null);
  //for storing smart contract address here
  const [dappazon,setDappazon]=useState(null);
  //lets conncect to block chain data and get the account details;
  const loadBlockChainData= async()=>{
    // console.log(window.ethereum.selectedAddress);
    // const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
    // const account= ethers.getAddress(accounts[0]);
    // setAccount(account)
    

    //Connect to Block Chain
    //to communicate with blockchain networks, such as Ethereum.
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network= await provider.getNetwork();
 
    //Connect to Smart Contract Which was deployed in Block Chain

    const dappazon=new ethers.Contract(config[network.chainId].dappazon.address,Dappazon,provider);
    setDappazon(dappazon);

    //Load Listed Products
    console.log(dappazon)
    const items=[];

    for(var i=0;i<9;i++){
      const item=await dappazon.items(i+1);
      items.push(item)
    }

    // try {
    //   console.log(items)
    // } catch (error) {
    //   console.error(error);
    // }

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
