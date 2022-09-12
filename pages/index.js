//import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox-index"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { jsx, Container, Box, Grid, Text, Heading } from "theme-ui";
import TextFeature from "../components/text-feature";

const data = {
  subTitle: "a behind-the-scenes look at non-fungible tokens (nft) and nft marketplaces",
  title: "",
  features: [
    {
      id: 1,
      
      altText: "Smart Features",
      title: "don't expect to get rich selling pup nfts",
      text: "this web site is designed to explain what happens beneath the hood when you mint nfts - then list your nfts for sale - and buy nft from others. it runs on the ethereum goerli testnet",
    },
    {
      id: 2,
      
      altText: "Secure Contents",
      title: "to the left you have nfts that are listed on the marketplace",
      text: "what does that mean: The owner of the nft has approved that marketplace can transfer the nft to a user provided the required amount is transferred to the marketplace",
    },
    {
      id: 2,
      
      altText: "Secure Contents",
      title: "the purchase of the nft is a transaction that involves the marketplace and a buyer",
      text: "what does that mean: the owner is not involved in the purchase transaction. he or she has approved that the marketplace can sell the nft and the received amount is stored in the marketplace until it is picked up.",
    },
    {
      id: 2,
      
      altText: "Secure Contents",
      title: "what if the website is closed",
      text: "that is the beauty of it: all funds and nfts are stored in the smart contract that lives on ethereum. if this website shuts down then the valuables are not lost. of course it might be a bit more inconvenient to sell them for a period until there is a new site but anyone with a computer could actually mint, sell or buy with a bit of effort.",
    },
  ],
};



export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl ">Recently Listed</h1>
            <div className="grid grid-cols-2">
            <div className="flex flex-wrap mt-10 ml-5">
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
                     <div>Web3 Currently Not Enabled</div>
                )} */}
            </div>
            <div className=" flex-wrap mt-10 mr-10 ml-10">
           <Box sx={styles.headingTop}>
            <TextFeature subTitle={data.subTitle} title={data.title} />
          </Box>

          <Grid gap="15px 0" columns={1} sx={styles.grid}>
            {data.features.map((item) => (
              <Box sx={styles.card} key={item.id}>
                

                <Box sx={styles.wrapper}>
                  <Heading sx={styles.wrapper.title}>{item.title}</Heading>
                  <Text sx={styles.wrapper.subTitle}>{item.text}</Text>
                </Box>
              </Box>
            ))}
          </Grid>
        
            </div>

            </div>
            
            
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
    width: ["100%", 450, 550, 350, 550, 600],
    mr: [2, 2, 2, 2, 2, 2],
    pr: [0, null, "auto", null, null, 80],
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
