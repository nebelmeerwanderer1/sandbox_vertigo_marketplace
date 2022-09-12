import { Alchemy, Network } from "alchemy-sdk"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { ethers} from "ethers"


    const config = {
        apiKey: "8KiFJHm2GddOzJLAlXkSHjVPDz1DNY_p",
        network: Network.ETH_GOERLI,
    };
        
    export const alchemy = new Alchemy(config);

    export const listNftsForOwner = async (owner) => {
    const response = await alchemy.nft.getNftsForOwner(owner, { 
       contractAddresses: ["0x9aa9edd751a422cdb5f7b56efa8f5c0d660fe1f0"],
        })
    const ownedList = JSON.stringify(response, null, 2)
    // console.log(ownedList)
    return ownedList
    }


