//import styles from "../styles/Home.module.css"
import { Form, useNotification, Button, Tab } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { listNftsForOwner } from "../components/interaction.js"
import NFTBox from "../components/NFTBox-generic"

//related to dropzone
import { useReducer } from "react";
import Head from "next/head";
import DropZone from "../components/DropZone";

import Landing from "../components/dragndropfiles/Landing"


import contractABI from "../constants/customUri.json"
const contractAddress = "0x2AAEE7DC30dcF135c8cAfC4aADd9D638c1eEA89A";

// ---material kit imports -------------------

//import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import Header from "../components/Header/Header.js";
import Footer from "../components/Footer/Footer.js";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
//  import Button from "../components/CustomButtons/Button.js";
import HeaderLinks from "../components/Header/HeaderLinks.js";
import Parallax from "../components/Parallax/Parallax.js";

import styles from "../styles/jss/nextjs-material-kit/pages/landingPage.js";

// Sections for this page
import ProductSection from "../pages-sections/interact-customURI-Sections/ProductSection.js";
import StepsSection from "../pages-sections/mint-customURI-Sections/StepsSection.js";
import WorkSection from "../pages-sections/LandingPage-Sections/WorkSection.js";

const dashboardRoutes = [];
const useStyles = makeStyles(styles);





export default function Home(props) {
    // ---------- material UI -------------
    const classes = useStyles();
    const { ...rest } = props;

    //----------------functionality -----------------
    
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()
    
    const [proceeds, setProceeds] = useState("0")
    const [status, setStatus] = useState("")
    const [wallet, setWallet] = useState(" ")
    const [mintstatus, setMintstatus] = useState("")
    const [updatestatus, setUpdatestatus] = useState("")
    
    const { runContractFunction } = useWeb3Contract()

    //lefthand side extra --------------       
    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    const [nftList, setNftList] = useState([]);
    const [nftPrice, setNftPrice] = useState([])

    // checks if wallet is connected -------------------------------------

    function addWalletListener() {
        if (isWeb3Enabled) {
        setWallet(account);
        setStatus("Your wallet is connected. you are ready");
        } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button");
        }
    } 

    // related to selling an nft -------------------------------------------------------------

    async function approveAndList(data) {
        console.log("Approving...")
        console.log(`nftadress: ${data.data[0].inputResult}`)
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()
               
        const approveOptions = {
            abi: contractABI,
            contractAddress: nftAddress,
            gasLimit: 150000,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            gasLimit: 150000,
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: " NFT listed !!! Yay ",
            title: "NFT listing:  ",
            position: "topR",
        })
    }

    // related to withdrawing proceeds ------------------------------------------------

    const handleWithdrawSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        } else {
           setProceeds("0") 
        }
    }

    //related to minting functionality ------------------------------------  

    const onMintPressed = async (data) => {

    if (!isWeb3Enabled) {
        setMintstatus("Connect your wallet to mint")
        return
    }
    
    // create tokenURI --
    console.log(`url: ${JSON.stringify(data)}`)    

    const info = {
      url: data.data[0].inputResult,
      name: data.data[1].inputResult, 
      description: data.data[2].inputResult,
      address: data.data[3].inputResult,
    }   
    
    console.log(info.url)
    
    const res = await fetch("/api/createTokenUri", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    });

    const tokenURI = await res.json();
    console.log(tokenURI)  
    
    //sign transaction via Metamask
    try {
        const txHash = await mintNFT(info.address, tokenURI.tokenURI)
        console.log(txHash.hash)
        setMintstatus("✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash.hash)  
             
    } catch (error) {
        setMintstatus("😥 Something went wrong: " + error.message)
        setTimeout(location.reload(), 3000)
        return        
    }
    };
    
    async function mintNFT(address, tokenURI) {
        console.log("Ok! Now time to mint")
        const mintNFT = {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "mintNFT",
            gasLimit: 150000,
            params: {
                recipient: address,
                tokenURI: tokenURI,                
            },
        }

        const txhash = await runContractFunction({
            params: mintNFT,
            onError: (error) => console.log(error),
        })
        return txhash
    }

    //related to update functionality ------------------------------------  

    const onUpdatePressed = async (data) => {

    if (!isWeb3Enabled) {
        setUpdatestatus("Connect your wallet")
        return
    }
    
    // create tokenURI --
    console.log(`url: ${JSON.stringify(data)}`)    

    const info = {
      url: data.data[1].inputResult,
      name: data.data[2].inputResult, 
      description: data.data[3].inputResult,
      tokenid: data.data[0].inputResult,
    }   
    
    console.log(info.url)
    
    const res = await fetch("/api/createTokenUri", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    });

    const tokenURI = await res.json();
    console.log(tokenURI)  
    
    //sign transaction via Metamask
    try {
        const txHash = await updateNFT(info.tokenid, tokenURI.tokenURI)
        console.log(txHash.hash)
        setUpdatestatus("✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash.hash)  
             
    } catch (error) {
        setUpdatestatus("😥 Something went wrong: " + error.message)
        setTimeout(location.reload(), 3000)
        return        
    }
    };
    
    async function updateNFT(tokenId, tokenURI) {
        console.log("Ok! Now time to mint")
        const updateNFT = {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "updateNFT",
            gasLimit: 150000,
            params: {
                tokenId: tokenId,
                tokenURI: tokenURI,                
            },
        }

        const txhash = await runContractFunction({
            params: updateNFT,
            onError: (error) => console.log(error),
        })
        return txhash
    }



    // related to transfer NFT ------------------------------------

    const transfer = async (data) => {

    if (!isWeb3Enabled) {
        setUpdatestatus("Connect your wallet")
        return
    }
    
    
    //console.log(`url: ${JSON.stringify(data)}`)    

    const info = {
      tokenId: data.data[0].inputResult,
      to: data.data[1].inputResult,
    }   
    
        
    //sign transaction via Metamask
    try {
        const txHash = await transferNFT(info.tokenId, info.to)
        console.log(`freerfer: ${txHash.hash}`)
        setUpdatestatus("✅ transferred ")  
             
    } catch (error) {
        setUpdatestatus("😥 Something went wrong: " + error.message)
        //setTimeout(location.reload(), 3000)
        return        
    }
    };
    
    async function transferNFT(tokenId, to) {
        console.log("Ok! Now time to transfer")
        console.log(tokenId)
        console.log(to)
        
        const transferNFT = {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: "safeTransferFrom(address,address,uint256)",
            gasLimit: 150000,
            params: {                
                from: account,
                to: to,
                tokenId: tokenId,                
            },
        }

        const txhash = await runContractFunction({
            params: transferNFT,
            onError: (error) => console.log(error),
        })
        return txhash
    }


    // related to dropzone functionality -------------------------

    const reducer = (state, action) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

     // destructuring state and dispatch, initializing fileList to empty array
     const [data, dispatch2] = useReducer(reducer, {
      inDropZone: false,
        fileList: [],
      });














    // when to trigger functions -----------------------------

    useEffect(() => {
        addWalletListener()
        setupUI() 
        getList()                   
        }
    , [proceeds, account, isWeb3Enabled, chainId, mintstatus, account])

    // related to displaying the nfts on the left hand side ----------------

    async function getList () {
        if (!isWeb3Enabled) {
        return }
            
        // get list of nfts owned by user (from basicnft smart contract)
        const ownerList = await listNftsForOwner(account, contractAddress)
        const obj = JSON.parse(ownerList)
            
        console.log(`ownerlist: ${obj.ownedNfts[0].contract.address}`)

            // add the price if it is listed (from theGraph eventdb)

            // for (let i = 0; i < obj.ownedNfts.length; i++) {
    
            // const tokenId = obj.ownedNfts[i].tokenId
                        
            // const token = await listedNfts.activeItems.filter(function(item) { return item.tokenId == tokenId})
            // console.log(`token: ${JSON.stringify(token)}`)
                        
            // try {
            // const rawPrice = token[0].price
            // const listPrice = ethers.utils.formatUnits(rawPrice, "ether")                   
            // console.log(`listprice: ${listPrice}`)
            // obj.ownedNfts[i].price = listPrice
            // } catch {
            // obj.ownedNfts[i].price = "not listed"
            // }
            // }

            // update useState          
        console.log(`ownerlist: ${JSON.stringify(obj.ownedNfts)}`)
        setNftList(obj)

            //console.log(JSON.stringify(nftList.ownedNfts[0]))
         }

    // the return --------------------------------------------
    
    return (


    <div>
        <Header
            color="transparent"
            routes={dashboardRoutes}
            brand="HOME"
            rightLinks={<HeaderLinks />}
            fixed
            changeColorOnScroll={{
            height: 400,
            color: "white"
            }}
            {...rest}
        />
      <Parallax filter responsive image="/img/bg3.jpg">
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>TIME TO BRING IT TO LIFE.</h1>
              <h4>
                Interact with an NFT and check events.  
              </h4>
              <br />              
            </GridItem>            
          </GridContainer>
        </div>
      </Parallax>

        <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.container}>
                <ProductSection />         
            </div>
        </div>
      <Footer />
    </div>

    )
    }

