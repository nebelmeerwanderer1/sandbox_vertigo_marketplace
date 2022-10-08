import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import InfoArea from "/components/InfoArea/InfoArea.js";

import styles from "/styles/jss/nextjs-material-kit/pages/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

//-----------------functionality--------------------

//import styles from "../styles/Home.module.css"
import { Form, useNotification, Button, Tab } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import nftMarketplaceAbi from "/constants/NftMarketplace.json"
import networkMapping from "/constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "/constants/subgraphQueries"
import GET_EVENTS from "/constants/event_subgraphQueries"
import GET_TOKEN_EVENTS from "/constants/tokenEvent_subgraphQueries"
import { listNftsForOwner } from "/components/interaction.js"
import NFTBox from "/components/NFTBox-events-left"
import NFTEventBox from "/components/NFTBox-events-right"

import contractABI from "/constants/customUri.json"
const contractAddress = "0x2AAEE7DC30dcF135c8cAfC4aADd9D638c1eEA89A";



export default function ProductSection() {
  //-------------material UI ----------------
  
  const classes = useStyles();

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

    
    async function onEventSearch(data) {

    setEventList(data.data[0].inputResult)

    }



    //const tokenId = "1"

    const { loading, error, data: listedEvents } = useQuery(GET_TOKEN_EVENTS, {variables: { tokenId : eventList }, context: {clientName: 'endpoint2'}})           

    //console.log(`listedevents: ${JSON.stringify(listedEvents)}`)   

      

    // the return --------------------------------------------
    
  return (
    <div className={classes.section}>
      
      <div>
        <GridContainer >
          <GridItem xs={12} sm={12} md={12}>
            <div>
                 <h1 className="text-black text-xl ml-5 mt-5 mb-5">The data of your NFTs in overview</h1>
                 </div>               
                 {isWeb3Enabled ?  ( 
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
                    ): ( <div> </div> )}
                    
                      
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <h3 className={classes.title}>Check the history of an NFT</h3>
          
        </GridItem>
          <GridItem xs={12} sm={12} md={12} >
             <Form 
                data={[
                {
                    name: "Token Id #",
                    type: "number",
                    inputWidth: "100%",
                    validation: {
                        required: true
                        },                        
                    value: "",
                    key: "tokenid",
                },
            ]}
            title=""
            id="Search Form"
            onSubmit={onEventSearch}
            customFooter={<Button type="submit" text="Submit" />}                             
            />              
            </GridItem>

          <GridItem xs={12} sm={12} md={12}>
             <div className={styles.container2}>               
                 {isWeb3Enabled ? (
                    loading ? (
                        <div>Loading...</div>
                    ) : ( 
                            listedEvents?.eventOccurrences.map((event) => {
                            console.log(event)
                            const { type, timestamp, tokenId, tokenURI, owner, newOwner, operator, id } = event
                            return (
                                <NFTEventBox
                                    type={type}
                                    timestamp={timestamp}
                                    tokenId={tokenId}
                                    tokenURI={tokenURI}
                                    owner={owner}
                                    newOwner={newOwner}
                                    operator={operator}
                                    id={id}
                                />
                               )
                            })
                           
                        )
                    ) : ( <div></div> )
                }
                </div>              
        </GridItem>
          <GridItem xs={12} sm={12} md={6}>               
          </GridItem>
          
          
        </GridContainer>
      </div>
    </div>
  );
}


// <div className="container mx-auto">
//     <h1 className="py-2 px-4  bg-gray-500 text-white text-end">{status}</h1>
//         <div className="grid grid-cols-2">

//                 <div className="flex-wrap ml-10 mr-5 mt-10 bg-slate-100 "> 
//                 <div>
//                     <h1 className="text-black text-xl ml-5 mt-5 mb-5">The data of your NFTs in overview</h1>
//                 </div>               
//                 {isWeb3Enabled ?  ( 
//                             nftList.ownedNfts?.map((nft) => {
//                             const { tokenId, contract, price } = nft
//                             return (
//                                 <NFTBox
//                                     price={price}
//                                     nftAddress={contract.address}
//                                     contractABI={contractABI}
//                                     tokenId={tokenId}
//                                     marketplaceAddress={marketplaceAddress}
//                                     seller={account}
//                                     key={`${contract.address}${tokenId}`}
//                                 />
//                                 )
//                             })                                                                            
//                         ): ( <div> </div> )}
//                 </div>  

//                 <div className=" flex-wrap mr-10 mt-10 ml-5  bg-slate-100">
//                     <div className={styles.container}>
//                     <div>
//                     <h1 className="text-black text-xl ml-5 mt-5 mb-5">Check the history of an NFT</h1>
//                     </div>
//                     <Form 
//                     data={[
//                     {
//                         name: "Token Id #",
//                         type: "number",
//                         inputWidth: "100%",
//                         validation: {
//                             required: true
//                             },                        
//                         value: "",
//                         key: "tokenid",
//                     },
//                 ]}
//                 title=""
//                 id="Search Form"
//                 onSubmit={onEventSearch}
//                 customFooter={<Button type="submit" text="Submit" />}                             
//                     />  
//                     </div>
//                     <p> <br/>  </p>

//                 <div className={styles.container2}>               
//                 {isWeb3Enabled ? (
//                     loading ? (
//                         <div>Loading...</div>
//                     ) : ( 
//                             listedEvents?.eventOccurrences.map((event) => {
//                             console.log(event)
//                             const { type, timestamp, tokenId, tokenURI, owner, newOwner, operator, id } = event
//                             return (
//                                 <NFTEventBox
//                                     type={type}
//                                     timestamp={timestamp}
//                                     tokenId={tokenId}
//                                     tokenURI={tokenURI}
//                                     owner={owner}
//                                     newOwner={newOwner}
//                                     operator={operator}
//                                     id={id}
//                                 />
//                                )
//                             })
                           
//                         )
//                     ) : ( <div></div> )
//                 }
//                 </div>

//             </div>
//         </div>            
//     </div>
//     )
// }
   
   