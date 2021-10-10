import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/NugGif.gif";
import newbanner from "./assets/images/logo.png"

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  font-weight: bold;
  font-size: 40px;
  color: #000000;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 350px;
    height: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const claimNFTs = (_amount) => {
    _amount = document.getElementById("inputBox").value;
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting your Official NugBudz NFT...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      // ********
      // You can change the line above to
      // .whiteListMint(blockchain.account, _amount) if you want only whitelisted
      // users to be able to mint through your website!
      // And after you're done with whitelisted users buying from your website,
      // You can switch it back to .mint(blockchain.account, _amount).
      // ********
      .send({
        gasLimit: 285000 * _amount,
        to: "0xB643fcc56a757BA431b8B1eA5d7d0994483F81ef", // the address of your contract
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((0.05 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong. Check your transaction on Etherscan to find out what happened!");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Your NugBudz NFT has been successfully minted!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--black)", fontSize: 40 }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 24, backgroundColor: "#0F4A1C"}}>
        <s.TextTitle
          style={{ display: "flex", flexDirection: "row", textAlign: "left", fontSize: 100, fontWeight: "bold", paddingRight: 10, margin: 0, 
          borderStyle: "solid", borderColor: "white", borderWidth: 0,
          borderRadius: 50, textAlign: "center", justifySelf: "center", justifyContent: "center"  }}
        >
          <a href="https://boocrew.io" style={{textDecoration: "none", color:"white"}}>NugBudz Minter</a>
        </s.TextTitle>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 24, paddingTop: 0 }}>
          <s.Container flex={1} jc={"center"} ai={"center"} style={{paddingTop: 0, flexDirection: "column"}}>
          <s.TextTitle
              style={{ 
              textAlign: "center", 
              fontSize: 40, 
              fontWeight: "bold", 
              borderStyle: "solid", 
              borderColor: "white",
              color: "white"}}>
                0.035 ETH + Gas
              </s.TextTitle>
            <StyledImg alt={"NugBudz GIF"} src={i1} style={{paddingTop: 0, borderStyle: "solid", borderColor: "black", borderWidth: 5,
                    borderRadius: 0 }}/>
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 80, fontWeight: "bold", borderStyle: "solid", borderColor: "black", 
              borderWidth: 0,
              paddingLeft: 100,
              paddingRight: 100,
              borderRadius: 0,
              marginTop: 0,
              marginBottom: 0,
              color: "white"
              }}
            >
              {blockchain.account == null ? "????" : (data.totalSupply)}/9420
            </s.TextTitle>
            {/* <s.SpacerMedium/> */}
            <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ 
              backgroundColor: "#0F4A1C", 
              padding: 24,
              paddingTop: 0,
              borderStyle: "solid", 
              borderColor: "black", 
              borderWidth: 0,
              borderRadius: 30,
              fontSize: 40 }}
          >
            {Number(data.totalSupply) == 9420 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  Dont worry, you're not missing out! You can still get NugBudz NFTs on{" "}
                  <a
                    // target={"_blank"}
                    href={"https://testnets.opensea.io/collection/rinkeby-doodlenauts"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                {/* <s.TextTitle style={{ textAlign: "center", fontSize: 30 }}>
                  1 DOODL costs .01 ETH.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription style={{ textAlign: "center", fontSize: 30 }}>
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall /> */}
                <s.TextDescription style={{ textAlign: "center", fontSize: 40 }}>
                  {feedback}
                </s.TextDescription>
                {/* <s.SpacerMedium /> */}
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center", fontSize: 80, marginBottom: 0, color: "white" }}>
                      Connect to the NugBudz NFT Minter!
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      style={{fontFamily: "coder"}}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    <s.SpacerLarge />
                    {/* <s.TextDescription style={{textAlign: "center", fontSize: 30, marginBottom: 0, paddingBottom: 0}}>
                      <a href="https://google.com">Boo Crew NFT Smart Contract</a>
                    </s.TextDescription> */}
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: "center", fontSize: 50}}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"} style={{marginTop: 0, paddingTop: 0, color: "white"}}>
                    <form>
                    I want <input 
                    id="inputBox"
                    placeholder="#" 
                    type="number" 
                    min="1" 
                    max="5"
                    style={{
                      fontSize: 60,
                      textAlign: "center",
                      backgroundColor: "black",
                      borderWidth: 4,
                      borderColor: "black",
                      borderStyle: "solid",
                      borderRadius: 40,
                      paddingRight: 10,
                      color: "white",
                      // marginBottom: 20,
                      // paddingLeft: 0,
                      // marginLeft: 0,
                      width: 80,
                      fontFamily: "coder",}}
                    /> NugBudz!
                    </form>
                    <s.SpacerSmall/>
                    <StyledButton
                     style={{fontFamily: "coder"}}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(1);
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "MINT"}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
          </s.Container>
          {/* <s.SpacerMedium /> */}
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 40}}>
                      <a 
                      href="https://rinkeby.etherscan.io/address/0xB643fcc56a757BA431b8B1eA5d7d0994483F81ef"
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: 20,
                      }}
                      >NugBudz NFT Smart Contract</a>
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          </s.TextDescription> */}
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
