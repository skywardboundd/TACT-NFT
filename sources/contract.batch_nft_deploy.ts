import { beginCell, contractAddress, toNano, TonClient4, WalletContractV4, internal, fromNano, Cell, address, Slice, Builder, Dictionary } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { NFTCollection, RoyaltyParams, DeployNFT, InitNFTBody, storeInitNFTBody, loadInitNFTBody, BatchDeploy, storeBatchDeploy } from "./output/NFT_NFTCollection";

import * as dotenv from "dotenv";
import { NFTItem, storeDeployNFT } from "./output/NFT_NFTItem";
dotenv.config();


/*
    (Remember to install dependencies by running "yarn install" in the terminal)
    Here are the instructions to deploy the contract:
    1. Create new walletV4r2 or use existing one.
    2. Enter your mnemonics in .env file.
    3. On line 47 select the network you want to deploy the contract.
    (// - comments out the line, so you can switch between networks)
    (testnet is chosen by default, if you are not familiar with it, read https://tonkeeper.helpscoutdocs.com/article/100-how-switch-to-the-testnet)
    4. Change content according to standard https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md 
    5. Load in code your owner list with amounts 
    6. Run "yarn build" to compile the contract.
    7. Run this script by "yarn batchdeploynft"
 */

export type dictDeployNFT = {
    amount: bigint;
    initNFTBody: InitNFTBody;
};

export const dictDeployNFTItem = {
    serialize: (src: dictDeployNFT, builder: Builder) => {
        builder.storeCoins(src.amount).storeRef(beginCell().store(storeInitNFTBody(src.initNFTBody)).endCell());
    },
    parse: (src: Slice) => {
        return {
            amount: src.loadCoins(),
            initNFTBody: loadInitNFTBody(src.loadRef().asSlice()),
        };
    },
};


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
    let deployItemAmount = toNano("0.005");
    let deployAmount = toNano("0.3");
    
    let contract = await NFTCollection.fromAddress(address(addressNFTCollection));
    let contract_open = await client4.open(contract);
    let nextItemIndex: bigint = (await contract_open.getGetCollectionData()).nextItemIndex;


    // send a message on new address contract to deploy it
    let seqno: number = await deployer_wallet_contract.getSeqno();
    console.log("🛠️Preparing new outgoing massage from deployment wallet. \n" + deployer_wallet_contract.address);
    console.log("Seqno: ", seqno + "\n");

    // Get deployment wallet balance
    let balance: bigint = await deployer_wallet_contract.getBalance();

    console.log("Current deployment wallet balance = ", fromNano(balance).toString(), "💎TON");
    console.log("Deploying collection");

    let owner = deployer_wallet_contract.address;
    
    let dct = Dictionary.empty(Dictionary.Keys.BigUint(64), dictDeployNFTItem);
    
    let i: bigint = 0n;
    for(i; i < 10n; i++) {
        let content = beginCell().storeStringTail(nextItemIndex.toString() + ".json").endCell();

        let initNFTBody: InitNFTBody = {
            $$type: 'InitNFTBody',
            queryId: 0n,
            owner: owner,
            content: content,
        }

        dct.set(nextItemIndex, { 
            amount: deployItemAmount,
            initNFTBody: initNFTBody
        });
        nextItemIndex += 1n;
    }

    let msg_body: BatchDeploy = {
        $$type: "BatchDeploy",
        queryId: 0n,
        deployList: beginCell().storeDictDirect(dct).endCell()
    };

    await deployer_wallet_contract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: addressNFTCollection,
                value: deployAmount,
                body: beginCell().store(storeBatchDeploy(msg_body)).endCell()
            }),
        ],
    });

    console.log("====== Deployment message sent to =======\n", addressNFTCollection);
})();