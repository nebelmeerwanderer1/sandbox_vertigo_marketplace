//import styles from "../styles/Home.module.css"
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
            <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">TIME TO PREPARE</h2>
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Basic web3 kit</h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Taking these steps will get you up and running - not just for this particular site.</p>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
          </div>


          <div class="flex flex-wrap">            
            <div class="xl:w-1/2 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Get a wallet and an account</h2>
              <p class="leading-relaxed text-base">In order to own an nft you need an account. Download a wallet to get an account. For instance metamask</p>
              <a className="leading-relaxed text-base mb-4 underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"https://metamask.io/download/"} target="popup">Download Metamask</a>
            </div>
            <div class="xl:w-1/2 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Connect to the correct blockchain</h2>
              <p class="leading-relaxed text-base mb-4">This is a demo site, so we run on a testnet: Ethereum Goerli.</p>
              <a className="leading-relaxed text-base mb-4 underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"https://blog.cryptostars.is/goerli-g%C3%B6rli-testnet-network-to-metamask-and-receiving-test-ethereum-in-less-than-2-min-de13e6fe5677"} target="popup">How to connect Metamask to Goerli Network</a>
              
            </div>     
            <div class="xl:w-1/2 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Get some coins</h2>
              <p class="leading-relaxed text-base mb-4">Normally you would need a bit of ETH or some other coin to pay for transaction fees but since this is a testnet you don't need that right now - Goerli eth is good enough.</p>
              
            </div>  
            <div class="xl:w-1/2 lg:w-1/2 md:w-full px-8 py-3 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Get some Goerli Coins</h2>
              <p class="leading-relaxed text-base">you can get some goerli eth here (will take you 30-60 mins) but get an account first.</p>
              <a className="leading-relaxed text-base mb-4 underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"https://goerli-faucet.pk910.de/"} target="popup">Goerli Faucet</a>
              
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