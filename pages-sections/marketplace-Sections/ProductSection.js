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
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "/components/NFTBox-index"
import networkMapping from "/constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "/constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { jsx, Container, Box, Grid, Text, Heading } from "theme-ui";
import TextFeature from "/components/text-feature";
import { useState, useEffect } from "react"




export default function ProductSection() {
  //-------------material UI ----------------
  
  const classes = useStyles();

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

    // the return --------------------------------------------
    
  return (
    <div className={classes.section}>
      
      <div>
        <GridContainer >
        <GridItem xs={12} sm={12} md={12}>
                               
                      
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <div className="grid grid-cols-1">
             <div className="grid grid-cols-4 flex-wrap mt-10 ml-5">
                 {/* {isWeb3Enabled ? ( */}
                     {loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            console.log(nft)
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )}
                {/* ) : (
                     <div>Web3 Currently Not Enabled - it sure ain't</div>
                )} */}
            </div>
           

            </div>
                    
        </GridItem>
        <GridItem xs={12} sm={12} md={12} >
                   
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
                       
        </GridItem>
        <GridItem xs={12} sm={12} md={6}> 

        </GridItem>         
        </GridContainer>
      </div>
    </div>
  );
}


//  <section class="text-gray-600 body-font">
//         <div className="container mx-auto">

//         <h1 className="py-2 px-4  bg-gray-500 text-white text-end">{status}</h1>


//           <div class="flex flex-col text-center w-full mb-10">
//             <h2 class="text-xs text-indigo-500 tracking-widest mt-10 font-medium title-font mb-1">TIME TO BECOME INSPIRED</h2>
//             <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4  text-gray-900">The NFT Marketplace</h1>
//             {/* <p class="lg:w-2/3 mx-auto leading-relaxed text-base">What happens beneath the hood when you mint Non-Fungible Tokens (NFTs), list for sale and buy from others.</p>
//             <p class="lg:w-2/3 mx-auto leading-relaxed text-base"></p> */}
//           </div>


//           <div class="flex flex-wrap">            
//             <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
//               {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
//               <p class="leading-relaxed text-base mb-4">See what is on sale from others - compare with your own NFTs</p>
              
//             </div>
//             <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
//               {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
//               <p class="leading-relaxed text-base mb-4">If you find something interesting, go to 'check events' and see the history for the token Id.</p>
              
//             </div>
            
//             <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
//               {/* <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2> */}
//               <p class="leading-relaxed text-base mb-4">Buy directly by clicking on an NFT and approve the price plus transaction fee.</p>
              
//             </div>
                      
//           </div>   

//           <div className="grid grid-cols-1">
//                 <div>
//                 <h1 class="px-4 sm:text-xl text-2xl font-medium text-center title-font mt-10 text-gray-900">Recently Listed for sale</h1>  
//                 </div>
//           </div>

//             <div className="grid grid-cols-1">
//             <div className="grid grid-cols-4 flex-wrap mt-10 ml-5">
//                 {/* {isWeb3Enabled ? ( */}
//                     {loading || !listedNfts ? (
//                         <div>Loading...</div>
//                     ) : (
//                         listedNfts.activeItems.map((nft) => {
//                             console.log(nft)
//                             const { price, nftAddress, tokenId, seller } = nft
//                             return (
//                                 <NFTBox
//                                     price={price}
//                                     nftAddress={nftAddress}
//                                     tokenId={tokenId}
//                                     marketplaceAddress={marketplaceAddress}
//                                     seller={seller}
//                                     key={`${nftAddress}${tokenId}`}
//                                 />
//                             )
//                         })
//                     )}
//                 {/* ) : (
//                      <div>Web3 Currently Not Enabled - it sure ain't</div>
//                 )} */}
//             </div>
           

//             </div>
            
            
//         </div>
//         </section>
//     )
// }


// const styles = {
//   coreFeature: {
//     mt: [5, 5, 5, 5, 5, 5],
//     py: [0, null, null, 2, null, 7],
//     position: "relative",
//     "&::before": {
//       position: "absolute",
//       content: '""',
//       top: ["auto", null, null, "50%"],
//       bottom: ["100px", 0, null, "auto"],
//       left: 0,
//       background: "linear-gradient(-157deg, #F6FAFD, #F9FCFC, #FCFDFC)",
//       height: [350, 550, "60%"],
//       width: "50%",
//       zIndex: -1,
//       borderTopRightRadius: "50%",
//       borderBottomRightRadius: "50%",
//       transform: ["translateY(0)", null, null, "translateY(-50%)"],
//     },
//   },
//   containerBox: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexDirection: ["column", null, null, "row"],
//   },
//   thumbnail: {
//     pl: [0, 5, 0, null, 7, 95],
//     pr: [0, 5, null, null, null, 75, 95],
//     order: [2, null, null, 0],
//   },
//   contentBox: {
//     width: ["100%", 450, 550, 350, 550, 1000],
//     mr: [2, 2, 2, 2, 2, 2],
//     pr: [0, null, "auto", null, null, 0],
//     pl: "auto",
//     flexShrink: 0,
//   },
//   headingTop: {
//     pl: [0, null, null, null, "35px", null, "55px", 6],
//     mb: [3, null, null, null, 1],
//     textAlign: ["center", null, null, "left"],
//   },
//   grid: {
//     p: ["0 0px 35px", null, null, null, "0 20px 40px", null, "0 40px 40px", 0],
//   },
//   card: {
//     display: "flex",
//     alignItems: "flex-start",
//     p: [
//       "0 17px 20px",
//       null,
//       null,
//       "0 0 20px",
//       "20px 15px 17px",
//       null,
//       null,
//       "25px 30px 23px",
//     ],
//     backgroundColor: "white",
//     borderRadius: "10px",
//     transition: "all 0.3s",
//     width: ["100%", "85%", null, "100%"],
//     mx: "auto",
//     "&:hover": {
//       boxShadow: [
//         "0px 0px 0px rgba(0, 0, 0, 0)",
//         null,
//         null,
//         null,
//         "0px 8px 24px rgba(69, 88, 157, 0.07)",
//       ],
//     },
//   },

//   img: {
//     width: ["50px", null, "55px"],
//     height: "auto",
//     flexShrink: 0,
//     mr: [3, 4],
//   },
//   wrapper: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//     mt: "-5px",
//     title: {
//       fontSize: 3,
//       color: "heading_secondary",
//       lineHeight: 1.4,
//       fontWeight: 700,
//       mb: [2, null, null, null, 3],
//     },

//     subTitle: {
//       fontSize: 1,
//       fontWeight: 400,
//       lineHeight: [1.85, null, 2],
//     },
//   },
// };