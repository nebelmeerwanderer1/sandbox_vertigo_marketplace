import { Alchemy, Network } from "alchemy-sdk"
//import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { ethers} from "ethers"


    const config = {
        apiKey: "8KiFJHm2GddOzJLAlXkSHjVPDz1DNY_p",
        network: Network.ETH_GOERLI,
    };
        
    export const alchemy = new Alchemy(config);

    export const listNftsForOwner = async (owner, contractAddress) => {
        console.log(`owner in listNftsforOwner: ${owner}`)
    const response = await alchemy.nft.getNftsForOwner(owner, { 
       contractAddresses: [contractAddress],
        })
    const ownedList = JSON.stringify(response, null, 2)
    // console.log(ownedList)
    return ownedList
    }


