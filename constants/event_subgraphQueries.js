import { gql } from "@apollo/client"

const GET_EVENTS = gql`
    {
        eventOccurrences {
            id
            imageURI
            newOwner
            owner
            timestamp
            tokenId
            tokenURI
            type
        }
    }
`

export default GET_EVENTS