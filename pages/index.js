//import styles from "../styles/Home.module.css"
import { Link } from "theme-ui"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox-index"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { jsx, Container, Box, Grid, Text, Heading } from "theme-ui";
import TextFeature from "../components/text-feature";


export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS, {context: {clientName: 'endpoint1'}})

    return (
        <div className="container mx-auto">
      <section class="text-gray-600 body-font">
          <div class="container px-5 py-10 mx-auto">
          <div class="flex flex-col text-center w-full mb-10">
            <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">WHAT IS HAPPENING HERE</h2>
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Non-Fungible Token Factory</h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">What happens beneath the hood when you mint Non-Fungible Tokens (NFTs), list for sale and buy from others.</p>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
          </div>


          <div class="flex flex-wrap">            
            <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">This is a hands-on experience</h2>
              <p class="leading-relaxed text-base mb-4">Experience creating and interacting with real NFTs. Use the simple experience as fuel for innovating and qualifying business potential.</p>
              
            </div>
            <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Industry standard smart contracts</h2>
              <p class="leading-relaxed text-base mb-4">NFTs are defined by smart contracts that run on the blockchain. The capabilities for an NFT collection is defined by a smart contract.</p>
              
            </div>  
            <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Genuine blockchain - connected to Ethereum</h2>
              <p class="leading-relaxed text-base mb-4">If someone asks: The contracts called from this site run on Ethereum's goerli testnet and the NFTs follow the ERC-721 standard.</p>
              
            </div>                
          </div>

          <div class="flex flex-wrap">
            <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">1st step: Create NFTs</h2>
              <p class="leading-relaxed text-base">Start by creating your NFT. An NFT is a defined data structure with a file, a name and a description.</p>
              <p class="leading-relaxed text-base mb-4">Consider whether it should designate something in the real work. E.g. a work of art, a parcel or even some real estate. </p>
              <Link href="/preparations">
              <a class="text-indigo-500 inline-flex items-center">Learn how to prepare for the best experience
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
              </Link>
            </div>
            <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">2nd Step: Interact with NFTs and check events</h2>
              <p class="leading-relaxed text-base mb-4">The capabilities of a specific NFT is defined by the underlying contract which cannot be changed. It is good practice to visit the underlying contract before you mint or buy an NFT.</p>
              <Link href="/smartcontracts">
              <a class="text-indigo-500 inline-flex items-center">Learn why a smart contract is 'smart' but not smart
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
              </Link>
            </div>
            <div class="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">3rd step: Buy and sell NFTs</h2>
              <p class="leading-relaxed text-base mb-4">The marketplace on this site offering buy and sell functionality is a separate smart contract. It is a good sandbox for playing around but obviously not the big arena. However, because your NFTs follow industry standards there is really nothing stopping you from going to OpenSea. </p>
              {/* <a class="text-indigo-500 inline-flex items-center">have a stroll on 
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a> */}
            </div>                  
          </div>
            {/* <button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button> */}
          </div>
      </section>              
        </div>
    )
}


const styles = {
  coreFeature: {
    mt: [5, 5, 5, 5, 5, 5],
    py: [0, null, null, 2, null, 7],
    position: "relative",
    "&::before": {
      position: "absolute",
      content: '""',
      top: ["auto", null, null, "50%"],
      bottom: ["100px", 0, null, "auto"],
      left: 0,
      background: "linear-gradient(-157deg, #F6FAFD, #F9FCFC, #FCFDFC)",
      height: [350, 550, "60%"],
      width: "50%",
      zIndex: -1,
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
      transform: ["translateY(0)", null, null, "translateY(-50%)"],
    },
  },
  containerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: ["column", null, null, "row"],
  },
  thumbnail: {
    pl: [0, 5, 0, null, 7, 95],
    pr: [0, 5, null, null, null, 75, 95],
    order: [2, null, null, 0],
  },
  contentBox: {
    width: ["100%", 450, 550, 350, 550, 1000],
    mr: [2, 2, 2, 2, 2, 2],
    pr: [0, null, "auto", null, null, 0],
    pl: "auto",
    flexShrink: 0,
  },
  headingTop: {
    pl: [0, null, null, null, "35px", null, "55px", 6],
    mb: [3, null, null, null, 1],
    textAlign: ["center", null, null, "left"],
  },
  grid: {
    p: ["0 0px 35px", null, null, null, "0 20px 40px", null, "0 40px 40px", 0],
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    p: [
      "0 17px 20px",
      null,
      null,
      "0 0 20px",
      "20px 15px 17px",
      null,
      null,
      "25px 30px 23px",
    ],
    backgroundColor: "white",
    borderRadius: "10px",
    transition: "all 0.3s",
    width: ["100%", "85%", null, "100%"],
    mx: "auto",
    "&:hover": {
      boxShadow: [
        "0px 0px 0px rgba(0, 0, 0, 0)",
        null,
        null,
        null,
        "0px 8px 24px rgba(69, 88, 157, 0.07)",
      ],
    },
  },

  img: {
    width: ["50px", null, "55px"],
    height: "auto",
    flexShrink: 0,
    mr: [3, 4],
  },
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    mt: "-5px",
    title: {
      fontSize: 3,
      color: "heading_secondary",
      lineHeight: 1.4,
      fontWeight: 700,
      mb: [2, null, null, null, 3],
    },

    subTitle: {
      fontSize: 1,
      fontWeight: 400,
      lineHeight: [1.85, null, 2],
    },
  },
};
