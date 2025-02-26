import { beginCell, contractAddress, toNano, TonClient4, WalletContractV4, internal, fromNano, Cell, address } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { NFTCollection, RoyaltyParams, DeployNFT } from "./output/NFT_NFTCollection";

import * as dotenv from "dotenv";
import { NFTItem, storeDeployNFT } from "./output/NFT_NFTItem";
dotenv.config();


/*
    (Remember to install dependencies by running "yarn install" in the terminal)
    Here are the instructions to deploy the contract:
    1. Create new walletV4r2 or use existing one.
    2. Enter your mnemonics in .env file.
    3. On line 35 select the network you want to deploy the contract.
    (// - comments out the line, so you can switch between networks)
    (testnet is chosen by default, if you are not familiar with it, read https://tonkeeper.helpscoutdocs.com/article/100-how-switch-to-the-testnet)
    4. Change content according to standard https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md 
    5. Run "yarn build" to compile the contract.
    6. Run this script by "yarn deploy"
 */


(async () => {
    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://testnet-v4.tonhubapi.com",
        //endpoint: "https://mainnet-v4.tonhubapi.com",
    });

    let mnemonics = (process.env.MNEMONICS || "").toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.
    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    console.log(deployer_wallet.address);

    let deployer_wallet_contract = client4.open(deployer_wallet);

    
    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well=
    let addressNFTCollection = process.env.COLLECTION_ADDRESS!!.toString();
    let deployAmount = toNano("0.01");
    
    let contract = await NFTCollection.fromAddress(address(addressNFTCollection));
    let contract_open = await client4.open(contract);
    let nextItemIndex: bigint = (await contract_open.getGetCollectionData()).nextItemIndex;

    console.log(nextItemIndex);
    // send a message on new address contract to deploy it
    let seqno: number = await deployer_wallet_contract.getSeqno();
    console.log("🛠️Preparing new outgoing massage from deployment wallet. \n" + deployer_wallet_contract.address);
    console.log("Seqno: ", seqno + "\n");

    // Get deployment wallet balance
    let balance: bigint = await deployer_wallet_contract.getBalance();

    console.log("Current deployment wallet balance = ", fromNano(balance).toString(), "💎TON");
    console.log("Deploying collection");

    let owner = deployer_wallet_contract.address;
    let content = beginCell().storeStringTail(nextItemIndex.toString() + ".json").endCell();

    console.log(content.toBoc().toString('hex'));


    let msg_body: DeployNFT = {
        $$type: "DeployNFT",
        queryId: 0n,
        itemIndex: nextItemIndex,
        amount: deployAmount,
        owner: owner,
        content: content,
    }

    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: addressNFTCollection,
                value: deployAmount,
                body: beginCell().store(storeDeployNFT(msg_body)).endCell()
            }),
        ],
    });

    let init = await NFTItem.init(nextItemIndex, address(addressNFTCollection));
    let itemNFTAddress = contractAddress(workchain, init);

    console.log("New nft item: ", itemNFTAddress);

    console.log("====== Deployment message sent to =======\n", addressNFTCollection);
})();