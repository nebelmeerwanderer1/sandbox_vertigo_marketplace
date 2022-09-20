// pages/api/user.js

import {pinJSONToIPFS} from './pinata.js'
require('dotenv').config();

export default async function user(req, res) {
    console.log(req.body)
    console.log(req.query) // {} in our example

    console.log(req.method); // POST
    console.log(req.headers.host); // localhost:3000
    console.log(req.url); // /api/user        

    //make metadata
    const metadata = new Object();
    metadata.name = req.body.name;
    metadata.image = req.body.url;
    metadata.description = req.body.description;

    const selectedAddress = req.body.address;

    //pinata pin request
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
         }
         res.status(200).json({ message: "success", success, status })
    } 
    const tokenURI = pinataResponse.pinataUrl;  

    //for test runs :
    //const tokenURI = "https://ipfs.io/ipfs/QmNZtzY6vu4FXaY3qU336fqNb8MMe516xiH5yhfAXmdLsR"
           
    console.log(`jada tokenURI: ${tokenURI}`)

    res.status(200).send({ tokenURI} )
}
