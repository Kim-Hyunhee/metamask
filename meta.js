const config = {
  privateKey:
    "d90d5214b98a2070a0b495273e1c11785634b16f95b702a05f6a6e73a5dd606a",
  CONTRACT: "0x1e6F139Dc530cb319D6e829A0cEA086A16BfECde",
  PROVIDER: "https://goerli.infura.io/v3/dbc3288b001d4a81805dd24304e7a835",
};

const web3 = new Web3(new Web3.providers.HttpProvider(config.PROVIDER));
const $button = document.querySelector("#signTypedDataV4Button");

const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

const domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
];
const bid = [
  { name: "amount", type: "uint256" },
  { name: "bidder", type: "Identity" },
];
const identity = [
  { name: "userId", type: "uint256" },
  { name: "wallet", type: "address" },
];

const domainData = {
  name: "Ideal Farm NFT debenture",
  version: "2",
  chainId: 5,
  verifyingContract: "0x1e6F139Dc530cb319D6e829A0cEA086A16BfECde",
  salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558",
};
var message = {
  amount: 100,
  bidder: {
    userId: 323,
    wallet: "0x3549043dca2edc61597a13ef56f0881290b0910a",
  },
};
const data = JSON.stringify({
  types: {
    EIP712Domain: domain,
    Bid: bid,
    Identity: identity,
  },
  domain: domainData,
  primaryType: "Bid",
  message: message,
});

ethereumButton.addEventListener("click", () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  showAccount.innerHTML = account;
}

$button.addEventListener("click", async function (event) {
  event.preventDefault();

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const from = accounts[0];
  var params = [from, data];
  var method = "eth_signTypedData_v4";
  await window.ethereum.sendAsync(
    {
      params,
      method,
      from,
    },
    function (err, result) {
      if (err) return console.log("err", err);
      if (result.error) {
        alert(result.error.message);
      }
      if (result.error) return console.error("ERROR", result);
      // console.log("TYPED SIGNED:" + JSON.stringify(result.result));
      const signature = result.result;

      // const r = "0x" + signature.substring(0, 64);
      // const s = "0x" + signature.substring(64, 128);
      // const v = parseInt(signature.substring(128, 130), 16);

      fetch("http://localhost:8080/admin/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: JSON.parse(data),
          signature,
        }),
      });
      // .then((response) => response.json())
      // .then((data) => console.log(data));
    }
  );
});

// const signTypedDataV4Result = document.getElementById("signTypedDataV4Result");
// const signTypedDataV4VerifyResult = document.getElementById(
//   "signTypedDataV4VerifyResult"
// );
// verifyDataV4Button.onclick = async () => {
//   try {
//     const accounts = await ethereum.request({
//       method: "eth_requestAccounts",
//     });
//     const from = accounts[0];
//     const sign = signTypedDataV4Result.innerHTML;
//     const recoveredAddr = recoverTypedSignatureV4({
//       data,
//       sig: sign,
//     });
//     if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
//       console.log(`Successfully verified signer as ${recoveredAddr}`);
//       signTypedDataV4VerifyResult.innerHTML = recoveredAddr;
//     } else {
//       console.log(
//         `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
//       );
//     }
//   } catch (err) {
//     console.error(err);
//     signTypedDataV4VerifyResult.innerHTML = `Error: ${err.message}`;
//   }
// };
