import styles from "../styles/Home.module.css"
import { Form, useNotification, Button, Tab } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import GET_EVENTS from "../constants/event_subgraphQueries"
import { listNftsForOwner } from "../components/interaction.js"
import NFTBox from "../components/NFTBox-events-left"
import NFTEventBox from "../components/NFTBox-events-right"

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
    const [eventList, setEventList] = useState("")
    
    const { runContractFunction } = useWeb3Contract()

    //lefthand side extra --------------       
    //const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
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

    // when to trigger functions -----------------------------

    useEffect(() => {
        addWalletListener()
        getList()
                 
        }
    , [account, isWeb3Enabled, chainId])

    // related to displaying the left hand side ----------------

    async function getList () {
        if (!isWeb3Enabled) { return }
            
        // get list of nfts owned by user (from basicnft smart contract)
        const ownerList = await listNftsForOwner(account, contractAddress)
        const obj = JSON.parse(ownerList)            
        console.log(`obj: ${JSON.stringify(obj)}`)
        // update useState          
        console.log(`ownerlist: ${JSON.stringify(obj.ownedNfts)}`)
        setNftList(obj)   
    
        }

    // related to displaying the right hand side ----------------

    const { loading, error, data: listedEvents } = useQuery(GET_EVENTS, {context: {clientName: 'endpoint2'}})           

    //console.log(`listedevents: ${JSON.stringify(listedEvents)}`)
    
    // the return --------------------------------------------
    
    return (
    <div className="container mx-auto">
    <h1 className="py-4 px-4  bg-gray-500 text-white text-xl">{status}</h1>
        <div className="grid grid-cols-2">

                <div className="flex-wrap ml-10 mr-5 mt-10 bg-slate-100 "> 
                <div>
                    <h1 className="text-black text-xl ml-5 mt-5 mb-5">Your NFTs in overview</h1>
                </div>               
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
                ) : ( <div> </div> )}
                </div>  

                <div className=" flex-wrap mr-10 mt-10 ml-5  bg-slate-100">
                    <div>
                    <h1 className="text-black text-xl ml-5 mt-5 mb-5">Check the history of your NFTs</h1>
                    </div>               
                {isWeb3Enabled ? (
                    loading || !listedEvents ? (
                        <div>Loading...</div>
                    ) : ( 
                            listedEvents.eventOccurrences.map((event) => {
                            console.log(event)
                            const { type, timestamp, tokenId, tokenURI, owner, newOwner, id } = event
                            return (
                                <NFTEventBox
                                    type={type}
                                    timestamp={timestamp}
                                    tokenId={tokenId}
                                    tokenURI={tokenURI}
                                    owner={owner}
                                    newOwner={newOwner}
                                    id={id}
                                />
                               )
                            })
                           
                        )
                    ) : ( <div></div> )
                }
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