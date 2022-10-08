import "../styles/globals.css"
import styles from "../styles/Home.module.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"

//------------- material kit -------------------

import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
//import Head from "next/head";
import Router from "next/router";

import PageChange from "../components/PageChange/PageChange.js";

import "/styles/scss/nextjs-material-kit.scss?v=1.2.0";



const endpoint1 = new HttpLink({    
    uri: "https://api.studio.thegraph.com/query/33778/nft-marketplace-v1/v0.0.1",
})

const endpoint2 = new HttpLink({    
    uri: "https://api.studio.thegraph.com/query/33778/inheritance-nfts/v0.0.10",
})

const client = new ApolloClient({
    link: ApolloLink.split(
        operation => operation.getContext().clientName === 'endpoint2',
        endpoint2, //if above 
        endpoint1
    ),
    cache: new InMemoryCache(),
})




function MyApp ({ Component, pageProps }) {
    return (
        <div>
            <React.Fragment>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        {/* <Header /> */}
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
            </React.Fragment>
        </div>
    )
}

export default MyApp
