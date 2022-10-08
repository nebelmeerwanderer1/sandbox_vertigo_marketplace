//import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox-index"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { jsx, Container, Box, Grid, Text, Heading } from "theme-ui";
import TextFeature from "../components/text-feature";
import { useState, useEffect } from "react"

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
import ProductSection from "../pages-sections/marketplace-Sections/ProductSection.js";
// import StepsSection from "../pages-sections/mint-customURI-Sections/StepsSection.js";
// import WorkSection from "../pages-sections/LandingPage-Sections/WorkSection.js";

const dashboardRoutes = [];
const useStyles = makeStyles(styles);



export default function Home(props) {
  // ---------- material UI -------------
    const classes = useStyles();
    const { ...rest } = props;

    //----------------functionality -----------------
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS, {context: {clientName: 'endpoint1'}})

    const [status, setStatus] = useState("")
    const [wallet, setWallet] = useState(" ")

    function addWalletListener() {
        if (isWeb3Enabled) {
        setWallet(account);
        setStatus("Your wallet is connected. you are ready");
        } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button");
        }
    } 

    useEffect(() => {
        addWalletListener()
                          
        }
    , [account, isWeb3Enabled, chainId])

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
              <h1 className={classes.title}>TIME TO TRADE.</h1>
              <h4>
                This NFT smart contract has the standard set of capabilities, except that you can update properties.
                However, the events give you a full trail of current and previous properties so nothing is lost.   
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
     