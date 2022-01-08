const Web3 = require("web3");

const web3 = new Web3("https://polygon-rpc.com/");
const fs = require("fs");
const mulAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
        ],
        internalType: "struct Multicall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      { internalType: "bytes[]", name: "returnData", type: "bytes[]" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const mulContract = "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507";
const erc721Abi = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
const tokenAddress = "0x2d8f2307c958e467e41bc1e7cbe00166b9daea24";
const mulContractIns = new web3.eth.Contract(mulAbi, mulContract);
const tokenIns = new web3.eth.Contract(erc721Abi, tokenAddress);

async function start() {
  let arr = [];
  for (let i = 1; i <= 1000; i++) {
    const data = tokenIns.methods.ownerOf(i).encodeABI();
    arr.push({
      target: tokenAddress,
      callData: data,
    });
  }
  const res = await mulContractIns.methods.aggregate(arr).call();
  console.log(res[1].map((it) => "0x" + it.slice(-40)));
}
start();
