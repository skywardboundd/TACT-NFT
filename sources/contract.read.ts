import { Address, contractAddress, Cell } from "@ton/core";
import { TonClient4 } from "@ton/ton";
import { NFTCollection } from "./output/sample_NFTCollection";

(async (): Promise<void> => {
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com", // 🔴 Test-net API endpoint
    });

    // Parameters
    let owner = Address.parse("kQBM7QssP28PhrctDOyd47_zpFfDiQvv5V9iXizNopb1d2LB");
    let content = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
    let nftItemCode = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
    let royaltyParams = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
    
    let init = await NFTCollection.init(owner, content, nftItemCode, royaltyParams);
    let contract_address = contractAddress(0, init);

    // Prepareing
    console.log("Reading Contract Info...");
    console.log(contract_address);

    // Input the contract address
    let contract = await NFTCollection.fromAddress(contract_address);
    let contract_open = await client.open(contract);
    console.log("Counter Value: " + (await contract_open.getCounter()));
})();
