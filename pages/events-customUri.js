//import styles from "../styles/Home.module.css"
import { Form, useNotification, Button, Tab } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import GET_EVENTS from "../constants/event_subgraphQueries"
import GET_TOKEN_EVENTS from "../constants/tokenEvent_subgraphQueries"
import { listNftsForOwner } from "../components/interaction.js"
import NFTBox from "../components/NFTBox-events-left"
import NFTEventBox from "../components/NFTBox-events-right"

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
import ProductSection from "../pages-sections/events-customUri-Sections/ProductSection.js";

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
              <h1 className={classes.title}>TIME TO CHECK HISTORY.</h1>
              <h4>
                Check the events in the history of an NFT. You can also check the NFTs owned by others.      
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

    
         