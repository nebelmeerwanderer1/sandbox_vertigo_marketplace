import { Alchemy, Network } from "alchemy-sdk"

    const config = {
        apiKey: "8KiFJHm2GddOzJLAlXkSHjVPDz1DNY_p",
        network: Network.ETH_GOERLI,
    };
    
    export const alchemy = new Alchemy(config);


    export const listNftsForOwner = async () => {
    const response = await alchemy.nft.getNftsForOwner("0x7Daeab3762fee8461d81E584eF0dD7887c2243a8", { 
       contractAddresses: ["0x9aa9edd751a422cdb5f7b56efa8f5c0d660fe1f0"],
        })
    const ownedList = JSON.stringify(response, null, 2)
    // console.log(ownedList)
    return ownedList
    }


