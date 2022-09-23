import { gql } from "@apollo/client"

const GET_TOKEN_EVENTS = gql`
    query MyEvents($tokenId: BigInt) {
        eventOccurrences(orderBy: timestamp, where : { tokenId : $tokenId}) {
            id
            imageURI
            newOwner
            owner
            operator    
            timestamp
            tokenId
            tokenURI
            type
            }
        }
        `

export default GET_TOKEN_EVENTS