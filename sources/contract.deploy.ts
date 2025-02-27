import { beginCell, contractAddress, toNano, TonClient4, WalletContractV4, internal, fromNano, Cell } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { NFTCollection, RoyaltyParams } from "./output/NFT_NFTCollection";

import * as dotenv from "dotenv";
dotenv.config();


/*
    (Remember to install dependencies by running "yarn install" in the terminal)
    Here are the instructions to deploy the contract:
    1. Create new walletV4r2 or use existing one.
    2. Enter your mnemonics in .env file.
    3. On line 28 select the network you want to deploy the contract.
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

    let collectionLink = process.env.COLLECTION_LINK!!.toString();
    let commonLink = process.env.COMMON_LINK!!.toString();

    
    let collectionData = beginCell().storeUint(1, 8).storeStringTail(collectionLink).endCell(); // Snake string
    let commonData = beginCell().storeStringTail(commonLink).endCell(); // Snake string

    let defaultContent = beginCell().storeRef(collectionData).storeRef(commonData).endCell();
    
    let nextItemIndex = 0n;
    let owner = deployer_wallet_contract.address; // can be changed to any address

    let royaltyOwner = deployer_wallet_contract.address;

    let royaltyParams: RoyaltyParams = {
        $$type: 'RoyaltyParams',
        nominator: 1n,
        dominator: 100n,
        owner: royaltyOwner,
    } 

    // Compute init data for deployment
    // NOTICE: the parameters inside the init functions were the input for the contract address
    // which means any changes will change the smart contract address as well
    let init = await NFTCollection.init(owner, nextItemIndex, defaultContent, royaltyParams);
    let addressNFTCollection = contractAddress(workchain, init);
    let deployAmount = toNano("0.15");

    // send a message on new address contract to deploy it
    let seqno: number = await deployer_wallet_contract.getSeqno();
    console.log("🛠️Preparing new outgoing massage from deployment wallet. \n" + deployer_wallet_contract.address);
    console.log("Seqno: ", seqno + "\n");

    // Get deployment wallet balance
    let balance: bigint = await deployer_wallet_contract.getBalance();

    console.log("Current deployment wallet balance = ", fromNano(balance).toString(), "💎TON");
    console.log("Deploying collection");

    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: addressNFTCollection,
                value: deployAmount,
                init: {
                    code: init.code,
                    data: init.data,
                },
                body: null
            }),
        ],
    });
    console.log("====== Deployment message sent to =======\n", addressNFTCollection);
})();