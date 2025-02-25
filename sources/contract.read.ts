import { Address, contractAddress, Cell, beginCell } from "@ton/core";
import { TonClient4 } from "@ton/ton";
import { NFTCollection, RoyaltyParams } from "./output/NFT_NFTCollection";

(async (): Promise<void> => {
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com", // 🔴 Test-net API endpoint
    });

    // Parameters
    let owner = Address.parse("kQBM7QssP28PhrctDOyd47_zpFfDiQvv5V9iXizNopb1d2LB");
    let defaultCommonContent = beginCell().storeStringTail("common").endCell();
    let defaultCollectionContent = beginCell().storeStringTail("collectioncontent").endCell();

    let defaultContent = beginCell().storeRef(defaultCollectionContent).storeRef(defaultCommonContent).endCell();
        

    let royaltyParams: RoyaltyParams = { 
        $$type: "RoyaltyParams",
        nominator: 1n,
        dominator: 100n,
        owner: owner,
    };
    let nextItemIndex = 0n;
    
    let init = await NFTCollection.init(owner, nextItemIndex, defaultContent, royaltyParams);
    let contract_address = contractAddress(0, init);

    // Prepareing
    console.log("Reading Contract Info...");
    console.log(contract_address);

    // Input the contract address
    let contract = await NFTCollection.fromAddress(contract_address);
    let contract_open = await client.open(contract);
    console.log((await contract_open.getGetCollectionData()).nextItemIndex);
})();
