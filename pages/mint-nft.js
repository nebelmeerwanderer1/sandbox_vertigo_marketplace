import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis, useWeb3Contract } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { Alchemy, Network } from "alchemy-sdk"
import { useEffect, useState } from "react"
import { ethers} from "ethers"
import {
  listNftsForOwner,
  alchemy,
  nftPriceList
} from "../components/interaction.js";
import nftAbi from "../constants/BasicNft.json"

//above: A-side  -- below: B-side
import { Form, useNotification, Button } from "web3uikit"


export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    //special lefthand side        
    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    const [nftList, setNftList] = useState([]);
    const [nftPrice, setNftPrice] = useState([])

    //special right hand side
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()

   
    async function getList () {
            
            // get list of nfts owned by user (from basicnft smart contract)
            const ownerList = await listNftsForOwner(account)
            const obj = JSON.parse(ownerList)
            
            console.log(`ownerlist: ${obj.ownedNfts[1].contract.address}`)

            // add the price if it is listed (from theGraph eventdb)

            for (let i = 0; i < obj.ownedNfts.length; i++) {
    
            const tokenId = obj.ownedNfts[i].tokenId
                        
            const token = await listedNfts.activeItems.filter(function(item) { return item.tokenId == tokenId})
            console.log(`token: ${JSON.stringify(token)}`)
                        
            try {
            const rawPrice = token[0].price
            const listPrice = ethers.utils.formatUnits(rawPrice, "ether")                   
            console.log(`listprice: ${listPrice}`)
            obj.ownedNfts[i].price = listPrice
            } catch {
            obj.ownedNfts[i].price = "not listed"
            }
            }

            // update useState          
            console.log(`ownerlist: ${JSON.stringify(obj.ownedNfts)}`)
            setNftList(obj)

            //console.log(JSON.stringify(nftList.ownedNfts[0]))
         }

    useEffect(() => {
        if (isWeb3Enabled) {
            getList()
        }
    }, [isWeb3Enabled, account])


    // right hand side function: mint

    const nftAddress = "0x9aa9edd751a422cdb5f7b56efa8f5c0d660fe1f0"

    async function mintToken () {
        console.log("OK, time to mint....")

        const mintTokenOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "mintNft",
            gasLimit: 150000,
            }

        await runContractFunction({
            params: mintTokenOptions,
            onSuccess: handleMintSuccess,
            onError: (error) => {
                console.log(error)
            },

        })
    }
    
    async function handleMintSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT minted!!!",
            title: "NFT minting: ",
            position: "topR",
        })
    }
    

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl ">Your Non-Fungible Tokens</h1>
            <div className="grid grid-cols-2">
            <div className="flex flex-wrap mt-10 ml-5">
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
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={account}
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
            <div className={styles.container}>
            <Button
                    onClick={mintToken} 
                        // runContractFunction({
                        //     params: {
                        //         abi: nftMarketplaceAbi,
                        //         contractAddress: marketplaceAddress,
                        //         functionName: "withdrawProceeds",
                        //         params: {},
                        //     },
                        //     onError: (error) => console.log(error),
                        //     onSuccess: handleWithdrawSuccess,
                        // )
                    
                    text="Mint"
                    type="button"
                />
             <br/>
             
             hallo!
            
            </div>
            </div>
                   
            </div>
            
            
        </div>
    )
}
