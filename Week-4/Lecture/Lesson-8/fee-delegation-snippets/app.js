const { Wallet, TxType, parseKlay } = require("@kaiachain/ethers-ext/v6");
const ethers = require("ethers");
const axios = require("axios");


const senderAddr = "0x6C4ED74027ab609f506efCdd224041c9F5b5CDE1";
const senderPriv =
  "0xda74a57d673dbd2fb21f4e2d577b7c7bb252e89b2f53949b5fc4327c3e6119a2";
const recieverAddr = "0x6C4ED74027ab609f506efCdd224041c9F5b5CDE1";

//testnet
const feePayerServer = "https://fee-delegation-kairos.kaia.io";
// const feePayerServer = "http://localhost:3000";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://public-en-kairos.node.kaia.io"
  );
  const senderWallet = new Wallet(senderPriv, provider);

  // value transfer
  let tx = {
    type: TxType.FeeDelegatedValueTransfer,
    to: recieverAddr,
    value: parseKlay("0.000001"),
    from: senderAddr,
    gasLimit: 40000,
  };

// smart contract execution
// const abi = ["function store(uint256 num)"];
// const contractAddr = "0x33F6E024F486dff955381b8EDF532c9fE77CeF61";
// const contract = new ethers.Contract(contractAddr, abi, provider);
//   const encodedData = contract.interface.encodeFunctionData("store", ["0x123"]);

//   let tx = {
//     type: TxType.FeeDelegatedSmartContractExecution,
//     from: senderAddr,
//     to: contractAddr,
//     value: 0,
//     data: encodedData,
//   };


  // Populate transaction
  tx = await senderWallet.populateTransaction(tx);
  console.log(tx);

  const senderTxHashRLP = await senderWallet.signTransaction(tx);
  console.log("senderTxHashRLP", senderTxHashRLP);

//   let feePayerWallet = senderWallet;
//   const sentTx = await feePayerWallet.sendTransactionAsFeePayer(senderTxHashRLP);
//   console.log("sentTx", sentTx);

//   const rc = await sentTx.wait();
//   console.log("receipt", rc);

//   return;

  /* signed tx from user on frontend side */
  const signedTxRLPEncoded = {
    raw: senderTxHashRLP
  };
  try {
    const response = await axios.post(`${feePayerServer}/api/signAsFeePayer`, {
      userSignedTx: signedTxRLPEncoded
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.data;
    console.log(data.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.error("Bad Request (400):", error.response.data);
      // Handle 400 error specifically
      throw new Error(`Fee delegation failed: ${error.response.data.message || 'Bad request'}`);
    }
    throw error; // Re-throw other errors
  }
}

/*
Testnet
{
  _type: 'TransactionReceipt',
  blockHash: '0xae220a685bff85161b9c617b918f6b98582d4bd230b2f0442da2b5f57308d200',
  blockNumber: 185171309,
  contractAddress: null,
  cumulativeGasUsed: '31000',
  from: '0x6C4ED74027ab609f506efCdd224041c9F5b5CDE1',
  gasPrice: '27500000000',
  blobGasUsed: null,
  blobGasPrice: null,
  gasUsed: '31000',
  hash: '0x55b0fc049c369b295f1358d0fc3b845db7de7dd76d9c0a402cc24350aaf08958',
  index: 0,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1,
  to: '0x6C4ED74027ab609f506efCdd224041c9F5b5CDE1'
}
*/

main();
