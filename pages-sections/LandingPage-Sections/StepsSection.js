import { Link } from "theme-ui"

import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import InfoArea from "/components/InfoArea/InfoArea.js";

import styles from "/styles/jss/nextjs-material-kit/pages/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function StepsSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Get your feet wet</h2>
          
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Create NFTs"
              description="An NFT is a defined data structure with a file, 
              a name and a description. Consider whether it should designate something in the real work. 
              E.g. a work of art, a parcel or even some real estate."
              icon={ArrowForwardIosIcon}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Interact with NFTs and check events"
              description="The capabilities of a specific NFT is defined by the underlying contract which 
              cannot be changed. It is good practice to visit the underlying contract before you mint or buy 
              an NFT."
              icon={ArrowForwardIosIcon}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Buy and sell NFTs"
              description="he marketplace on this site offering buy and sell functionality is a separate smart 
              contract. It is a good sandbox for playing around but obviously not the big arena. However, because 
              your NFTs follow industry standards there is really nothing stopping you from going to OpenSea."
              icon={ArrowForwardIosIcon}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Link href="/preparations">
              <a class="text-indigo-500 inline-flex items-center">How to prepare for the best experience
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
              </Link>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Link href="/smartcontracts">
              <a class="text-indigo-500 inline-flex items-center">Why a smart contract is 'smart' but not smart
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
              </Link>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
