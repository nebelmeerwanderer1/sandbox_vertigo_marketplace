import { jsx } from "theme-ui";
import { Container, Grid, Box, Heading, Text } from "theme-ui";
import PatternBG from "../assets/patternBG.png";
import SectionHeader from "../components/section-header";

import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { homedir } from "os";
import styles from "../styles/Home.module.css"

//"p-5 border-b-2 flex flex-row justify-between items-center"

export default function Header() {
    return (
        <nav className="text-white bg-gray-500 bg-[url('../assets/patternBG.png')] border-b-2 flex flex-row justify-between items-center" > 
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/mint-customUri">
                    <a className="mr-4 p-6">Create NFTs</a>
                </Link>
                <Link href="/interact-customUri">
                    <a className="mr-4 p-6">Interact with NFTs</a>
                </Link>
                <Link href="/events-customUri">
                    <a className="mr-4 p-6">Check events</a>
                </Link>                
                <Link href="/marketplace">
                    <a className="mr-4 p-6">Buy and sell NFTs</a>
                </Link>
                <Link href="/mint-basicnft">
                    <a className="mr-4 p-6">(basic NFTs)</a>
                </Link>                
            </div>
            <div className="ml-auto py-2 px-4 items-end">
                    <ConnectButton moralisAuth={false} />
                </div>
         </nav> 
        
    )
}

// const styles = {
//   workflow: {
//     backgroundColor: "primary",
//     backgroundImage: `url(${PatternBG})`,
//     backgroundRepeat: `no-repeat`,
//     backgroundPosition: "center center",
//     backgroundSize: "cover",
//     position: "relative",
//     py: [8, null, 9, null, null, 10],
//     "&::before": {
//       position: "absolute",
//       content: '""',
//       top: 0,
//       right: 0,
//       background:
//         "linear-gradient(-45deg, rgba(42,72,125, 0.3) 25%, transparent 25%, transparent 50%, rgba(42,72,125, 0.3) 50%, rgba(42,72,125, 0.3) 75%, transparent 75%, transparent)",
//       width: "100%",
//       backgroundSize: "350px 350px",
//       height: "100%",
//       opacity: 0.3,
//       zIndex: 0,
//     },
//   },
//   grid: {
//     mb: -1,
//     pt: 0,
//     gridGap: [
//       "35px 0",
//       null,
//       "45px 50px",
//       null,
//       "50px 25px",
//       null,
//       null,
//       "50px 65px",
//     ],
//     gridTemplateColumns: [
//       "repeat(1,1fr)",
//       null,
//       "repeat(2,1fr)",
//       null,
//       "repeat(4,1fr)",
//     ],
//   },
// //   card: {
// //     display: "flex",
// //     flexDirection: "column",
// //     position: "relative",
// //     textAlign: ["center", null, "left"],
// //     width: ["100%", "80%", "100%"],
// //     mx: "auto",
// //     "&::before": {
// //       position: "absolute",
// //       content: '""',
// //       top: 0,
// //       left: [0, null, null, null, null, 75, null, 100],
// //       backgroundRepeat: `no-repeat`,
// //       backgroundPosition: "center center",
// //       width: 215,
// //       height: 60,
// //       opacity: 0.3,
// //       "@media screen and (max-width:1220px)": {
// //         display: "none",
// //       },
// //     },
// //     "&:nth-of-type(2n-1)::before": {
// //       backgroundImage: `url(${ArrowOdd})`,
// //     },
// //     "&:nth-of-type(2n)::before": {
// //       backgroundImage: `url(${ArrowEven})`,
// //       top: 17,
// //     },
// //     "&:last-child::before": {
// //       display: "none",
// //     },
// //   },

//   iconBox: {
//     width: ["50px", null, "60px", null, null, "70px"],
//     height: ["50px", null, "60px", null, null, "70px"],
//     flexShrink: 0,
//     borderRadius: [15, null, 23, null, null, 30],
//     backgroundColor: "white",
//     display: "flex",
//     alignItems: "center",
//     mb: [5, null, null, null, null, 6],
//     mx: ["auto", null, 0],
//     fontSize: [6, null, 7, null, null, "30px"],
//     fontWeight: 700,
//     justifyContent: "center",
//     color: "#234582",
//   },
//   wrapper: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//     mt: "-5px",
//     title: {
//       fontSize: [3, null, 4, null, null, 5],
//       color: "white",
//       lineHeight: [1.4, null, null, null, null, 1.55],
//       pr: [0, null, null, null, null, 2],
//       mb: [2, 3],
//     },

//     subTitle: {
//       fontSize: 1,
//       fontWeight: 400,
//       lineHeight: [1.85, null, null, 1.9, 2],
//       color: "white",
//       opacity: 0.65,
//       pr: [0, null, null, null, null, 5],
//     },
//   },
// };

