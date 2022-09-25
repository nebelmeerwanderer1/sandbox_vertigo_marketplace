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
    <div className="container mx-auto">
    <h1 className="py-4 px-4  bg-gray-500 text-white text-xl">{status}</h1>
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

                <h1 className="py-4 px-4 font-bold text-center text-xl text-slate-500"> Here you upload your asset to the InterPlanetary File System (IPFS)  - and then copy address to the forms below</h1> 
                {/* Pass state data and dispatch to the DropZone component */}
                <DropZone data={data} dispatch={dispatch2} />
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
                <p id="updatestatus" className={styles.ddescription}>
                    {updatestatus}
                </p>
            
                <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "100%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        inputWidth: "100%",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        validation: {
                            required: true
                            },
                        inputWidth: "100%",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
                customFooter={<Button type="submit" text="Submit" />} 
                />
                <p id="mintstatus" className={styles.ddescription}>
                
                </p>
                <Form
                onSubmit={transfer}
                data={[
                    {
                        name: "Token ID",
                        type: "number",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Recipient Address",
                        type: "text",
                        inputWidth: "100%",
                        validation: {
                            required: true
                            },
                        value: "",
                        key: "recipient",
                    },
                ]}
                title="Transfer your NFT!"
                id="Main Form"
                customFooter={<Button type="submit" text="Submit" />} 
                />
                <p id="mintstatus" className={styles.ddescription}>
                
                </p>
            
                <Form
                onSubmit={() => {
                    {proceeds != "0" ? (
                        runContractFunction({
                            params: {
                                abi: nftMarketplaceAbi,
                                contractAddress: marketplaceAddress,
                                functionName: "withdrawProceeds",
                                params: {},
                            },
                            onError: (error) => console.log(error),
                            onSuccess: handleWithdrawSuccess,
                        })
                    ): (
                        <div>No proceeds detected</div>
                    )
                }}} 
                data={[
                    {
                        name: "proceeds you want to withdraw",
                        type: "text",
                        inputWidth: "100%",
                        value: proceeds,
                        key: "proceeds",
                    },

                ]}

                title="Withdraw your NFT marketplace balance!"
                id="Proceeds Form"
                customFooter={<Button type="submit" text="Submit" />} 
                />            
                <div> 
                <p className={styles.dddescription}>Total: {proceeds} proceeds</p>
                </div>
            
                </div>
            </div>
                   
        </div>            
    </div>
    )
}
   
    //                     icons: 
    //                     name: "🖼 Link to asset: E.g. https://gateway.pinata.cloud/ipfs/<hash>",
    //                   
    //                     name: "🤔 Name: E.g. My first NFT!",
    //           
    //                     name: "✍️ Description: E.g. Even cooler than cryptokitties ;)",         