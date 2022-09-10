import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { Alchemy, Network } from "alchemy-sdk"
import { useEffect, useState } from "react";
import {
  listNftsForOwner,
  alchemy
} from "./utils/interaction.js";

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    const [nftList, setNftList] = useState("");

   //connects to goerli      

    // const config = {
    //     apiKey: "8KiFJHm2GddOzJLAlXkSHjVPDz1DNY_p",
    //     network: Network.ETH_GOERLI,
    // };
    // const alchemy = new Alchemy(config);

    // // connect to smart contract

    const contractAddress = '0x9aa9edd751a422cdb5f7b56efa8f5c0d660fe1f0';
    const owner = "0x7Daeab3762fee8461d81E584eF0dD7887c2243a8";

    async function getList () {
            const ownerList = await listNftsForOwner()
            const obj = JSON.parse(ownerList)
            console.log(`ownerlist: ${obj.ownedNfts[1].contract.address}`)
            setNftList(obj)

    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getList()
        }
    }, [isWeb3Enabled, account])

    
    
    







    // // import all the owner's nfts

    // const owned = async () => { 
    // const response = await alchemy.nft.getNftsForOwner(owner, { 
    //    contractAddresses: ["0x9aa9edd751a422cdb5f7b56efa8f5c0d660fe1f0"],
    //     })
    //     // console.log(`owned: ${JSON.stringify(response, null, 2)}`) 
    //     return JSON.stringify(response, null, 2)
    //     }
     
     
    //     const owened = owned()
    // //.then(function(result){
    // //        console.log(result)
    // //      })
    
    // console.log(owned())

    // const count = owened.totalCount
    // console.log(count)
    
    
    const list = [];
    for (let i = 0; i < 4; i++) {
    list.push(i)
    }


    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl ">Recently Listed</h1>
            <div className="grid grid-cols-2">
            <div className="flex flex-wrap mt-10 ml-5">
                {isWeb3Enabled ? (
                    loading ? (
                        <div>Loading...</div>
                    ) : (
                        console.log(nftList.ownedNfts),
                        nftList.ownedNfts.map((nft) => {
                            // console.log(nft)
                            const { tokenId, contract } = nft
                            return (
                                <NFTBox
                                    price={""}
                                    nftAddress={contract.address}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={owner}
                                    key={`${contract.address}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
            <div className=" flex flex-wrap mt-10 mr-5">
            hallo!

            </div>

            </div>
            
            
        </div>
    )
}
