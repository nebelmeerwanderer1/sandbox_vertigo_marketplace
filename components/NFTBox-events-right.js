import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"


const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTEventBox({ type, timestamp, tokenId, tokenURI, owner, newOwner, operator, id }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    //const [tokenURI, setTokenURI] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

        
    const date = new Date(timestamp*1000)
    const GMTtimestamp = date.toGMTString()

    // const { runContractFunction: getTokenURI } = useWeb3Contract({
    //     abi: contractABI,
    //     contractAddress: nftAddress,
    //     functionName: "tokenURI",
    //     params: {
    //         tokenId: tokenId,
    //     },
    // })

    // const { runContractFunction: buyItem } = useWeb3Contract({
    //     abi: nftMarketplaceAbi,
    //     contractAddress: marketplaceAddress,
    //     functionName: "buyItem",
    //     msgValue: price,
    //     params: {
    //         nftAddress: nftAddress,
    //         tokenId: tokenId,
    //     },
    // })

    async function updateUI() {
        // const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        // console.log(`nftAbi is ${JSON.stringify(nftAbi)}`)
        // console.log(`The nftAddress is ${nftAddress}`)
        // console.log(`The TokenId is ${tokenId}`)

        // We are going to cheat a little here...
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            //setTokenURI(tokenURI)
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
        // get the tokenURI
        // using the image tag from the tokenURI, get the image
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = owner === account || owner === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(owner || "", 10)

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }
    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    return (
        <div>
            <div>
                
                    <div>
                        {/* <UpdateListingModal
                            
                            //isVisible={showModal}
                            tokenId={tokenId}
                            // marketplaceAddress={nftAddress}
                            // nftAddress={nftAddress}
                            onClose={hideModal}
                        /> */}
                                               
                            <div className="p-2 bg-slate-300 text-gray-600">
                            <div className="p-2 bg-white text-gray-600">
                                <div className="flex flex-col items-left gap-2 text-xs">
                                    <div className="font-bold  "> Token Id: {tokenId} </div>
                                    <div className="italic"> Event: </div>
                                    <div className="ml-5"> type : {type} </div>
                                    <div className="ml-5"> time : {GMTtimestamp}</div>                                    
                                    <div className="italic"> Ownership change (if transfer event) or new operator:  </div>
                                    <div className="ml-5"> owner : {owner} </div>
                                    <div className="ml-5"> new owner : {newOwner} </div>
                                    <div className="ml-5"> operator : {operator} </div>
                                    <div className="italic"> Content change (if create or update event) : </div>
                                    <div className="ml-5"> token URI : {tokenURI}  </div>
                                    <div className="ml-10"> name : {tokenName} </div>
                                    <div className="ml-10"> description : {tokenDescription} </div>
                                    <div className="ml-10"> ImageURI: </div>                                    
                                    <a className="ml-10 underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={imageURI} target="popup"> {imageURI} </a>                                    
                                    
                                </div>
                            </div>
                            </div>
                        
                    </div>
                
            </div>
        </div>
    )
}
