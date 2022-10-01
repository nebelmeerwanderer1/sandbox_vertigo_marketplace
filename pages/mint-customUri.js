import styles from "../styles/Home.module.css"
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
import React, { useReducer } from "react";
import Head from "next/head";
import DropZone from "../components/DropZone";

import Landing from "../components/dragndropfiles/Landing"


import contractABI from "../constants/customUri.json"
const contractAddress = "0x2AAEE7DC30dcF135c8cAfC4aADd9D638c1eEA89A";

export default function Home() {
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

    // related to withdrawing proceeds ------------------------------------------------    

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
                    
            // update useState          
        console.log(`ownerlist: ${JSON.stringify(obj.ownedNfts)}`)
        setNftList(obj)

            //console.log(JSON.stringify(nftList.ownedNfts[0]))
         }

    // the return --------------------------------------------
    
    return (
        <section class="text-gray-600 body-font">
    <div className="container mx-auto">
    <h1 className="py-2 px-4  bg-gray-500 text-white text-end">{status}</h1>

    <div class="flex flex-col text-center w-full mb-10">
            <h2 class="text-xs text-indigo-500 tracking-widest mt-10 font-medium title-font mb-1">TIME TO BECOME CREATIVE</h2>
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4  text-gray-900">How to mint a Non-fungible Token (NFT)</h1>
            {/* <p class="lg:w-2/3 mx-auto leading-relaxed text-base">What happens beneath the hood when you mint Non-Fungible Tokens (NFTs), list for sale and buy from others.</p>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base"></p> */}
          </div>


          <div class="flex flex-wrap">            
            <div class="xl:w-1/5 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
              <p class="leading-relaxed text-base mb-4">1: Upload an asset - file or image - to the Inter Planetary File System (IPFS).</p>
              
            </div>
            <div class="xl:w-1/5 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
              <p class="leading-relaxed text-base mb-4">2: Copy the link to the 'Mint NFT' form. Add name and description.</p>
              
            </div>
            
            <div class="xl:w-1/5 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
              <p class="leading-relaxed text-base mb-4">3: Submit the form to the blockchain and pay the transaction fee.</p>
              
            </div>
            <div class="xl:w-1/5 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
              <p class="leading-relaxed text-base mb-4">4. If you want to update an existing NFT instead, then use the 'Update NFT' form.</p>
              
            </div><div class="xl:w-1/5 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
              <p class="leading-relaxed text-base">5: Go to the smart contract on etherscan and follow the creation process.</p>
              <a className="leading-relaxed text-base mb-4 underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"https://goerli.etherscan.io/address/0x2aaee7dc30dcf135c8cafc4aadd9d638c1eea89a"} target="popup">Link</a>  
            </div>           
          </div>   

            <div className="grid grid-cols-2">
                <div>
                <h1 class="px-4 sm:text-xl text-2xl font-medium text-center title-font mt-10 text-gray-900">Your NFTs</h1>  
                </div>
                <div>
                <h1 class="px-4 sm:text-xl text-2xl font-medium text-center title-font mt-10 text-gray-900">Mint and update forms</h1>    
                </div>
            </div>


        <div className="grid grid-cols-2">

                <div className="flex-wrap ml-10 mr-10 mt-10">  
                            
                {isWeb3Enabled ? (
                    loading ? (
                        <div>Loading...</div>
                    ) : (
                        nftList.ownedNfts?.map((nft) => {
                            const { tokenId, contract, price } = nft
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={contract.address}
                                    contractABI={contractABI}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={account}
                                    key={`${contract.address}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div> </div>
                )}
                </div>  

                <div className=" flex-wrap mr-5 mt-10  bg-slate-100"> 
                <div className={styles.container}>
                <p id="status" className={styles.ddescription}>
                {/* {status} */}
                </p>                
                {/* Pass state data and dispatch to the DropZone component */}                
                <Landing />
                {/* <DropZone data={data} dispatch={dispatch2} /> */}
                <p>
                     <br></br> 
                </p>
                <Form 
                    data={[
                    {
                        name: "Link to asset: E.g. https://gateway.pinata.cloud/ipfs/<hash>",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "url",
                    },
                    {
                        name: "Name: E.g. My first NFT!",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "name",
                    },
                    {
                        name: "Description: E.g. Even cooler than cryptokitties ;)",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "description",
                    },
                    {
                        name: "Owner's address: E.g. you or your best friend",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },                        
                        value: "",
                        key: "owner",
                    },
                ]}
                title="Mint your NFT!"
                id="Mint Form" 
                onSubmit={onMintPressed}
                customFooter={<Button type="submit" text="Submit" />}              
                />
                <p id="mintstatus" className={styles.ddescription}>
                {mintstatus}
                </p>
                <Form 
                    data={[
                    {
                        name: "Token Id # of the NFT that you want to update",
                        type: "number",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },                        
                        value: "",
                        key: "tokenid",
                    },
                    {
                        name: "New link to asset: E.g. https://gateway.pinata.cloud/ipfs/<hash>",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "url",
                    },
                    {
                        name: "New name: E.g. My first NFT!",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "name",
                    },
                    {
                        name: "New description: E.g. Even cooler than cryptokitties ;)",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "description",
                    },  
                ]}
                title="Update your NFT!"
                id="Update Form" 
                onSubmit={onUpdatePressed}
                customFooter={<Button type="submit" text="Submit" />}              
                />               
                </div>
            </div>
                   
        </div>            
    </div>
    </section>
    )
}      