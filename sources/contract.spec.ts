import { Address, beginCell, Cell, Slice, ContractProvider, Sender, toNano, Builder, Dictionary, DictionaryKey, openContract, TupleReader, TupleItem, TupleItemInt, TupleItemSlice, TupleItemCell } from '@ton/core';
import {
    Blockchain,
    SandboxContract,
    SmartContract,
    TreasuryContract,
    internal
} from '@ton/sandbox';

import {
    NFTCollection,
    DeployNFT,
    GetRoyaltyParams,
    GetStaticData,
    BatchDeploy,
    ReportRoaltyParams,
    CollectionData,
    storeRoyaltyParams,
    RoyaltyParams,
    NFTInitData,
    loadNFTInitData,
    ChangeOwner
} from "./output_func/NFT_NFTCollection";

import {
    NFTItem,
    Transfer,
    NFTData,
    loadNFTData,
    storeNFTInitData,  
}   from "./output_func/NFT_NFTItem";

import "@ton/test-utils";
import { randomInt } from 'crypto';
import { TonClient } from '@ton/ton';

export type dictDeployNFT = {
    amount: bigint;
    initNFTBody: NFTInitData;
};


const minTonsForStorage = 50000000n;
const sendTransfer = async (
    itemNFT: SandboxContract<NFTItem>,
    from: Sender,
    value: bigint,
    newOwner: Address,
    responceDestination: Address | null,
    forwardAmount: bigint,
    fornwardPayload: Slice = beginCell().storeUint(0, 1).asSlice(),
) => {
    let msg: Transfer = {
        $$type: 'Transfer',
        queryId: 0n,
        newOwner: newOwner,
        responseDestination: responceDestination,
        kind: 0n,
        forwardAmount: forwardAmount,
        forwardPayload: fornwardPayload,
    };

    return await itemNFT.send(from, { value }, msg);
};

function loadGetterTupleNFTData(source: TupleItem[]): NFTData {
    let _init = (source[0] as TupleItemInt).value;
    let _index = (source[1] as TupleItemInt).value;
    let _collectionAddress = (source[2] as TupleItemSlice).cell.asSlice().loadAddress();
    let _ownerAddress = (source[3] as TupleItemSlice).cell.asSlice().loadAddress();
    let _content = (source[4] as TupleItemCell).cell;
    return { $$type: 'NFTData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

export const dictDeployNFTItem = {
    serialize: (src: dictDeployNFT, builder: Builder) => {
        builder.storeCoins(src.amount).storeRef(beginCell().store(storeNFTInitData(src.initNFTBody)).endCell());
    },
    parse: (src: Slice) => {
        return {
            amount: src.loadCoins(),
            initNFTBody: loadNFTInitData(src.loadRef().asSlice()),
        };
    },
};


const Op = {
    transferNFT: 0x5fcc3d14,
    ownershipAssigment: 0x05138d91,
    excess: 0xd53276db,
    getStaticData: 0x2fcb26a2,
    reportStaticData: 0x8b771735,
    getRoyaltyParams: 0x693d3950,
    reportRoyaltyParams: 0xa8cb00ad,

    editContent: 0x1a0b9d51,
    transferEditorship: 0x1c04412a,
    editorshipAssigned: 0x511a4463
}


// import { findErrorCodeByMessage } from './utils/error';

NFTItem.prototype.getOwner = async function (this: NFTItem, provider: ContractProvider): Promise<Address | null> {
    let res = await this.getGetNftData(provider);
    return res.ownerAddress;
};

describe("NFT Item Contract", () => {
    let blockchain: Blockchain;
    let itemNFT: SandboxContract<NFTItem>;
    let owner: SandboxContract<TreasuryContract>;
    let notOwner: SandboxContract<TreasuryContract>;
    let defaultContent: Cell;
    let emptyAddress: Address | null;
    

    
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        owner = await blockchain.treasury("owner");
        notOwner = await blockchain.treasury('notOwner');

        emptyAddress = null
        let xd = beginCell().storeAddress(emptyAddress).endCell();
        // console.log(xd.asBuilder().bits);

        defaultContent = beginCell().storeRef(beginCell().endCell()).endCell();

        itemNFT = blockchain.openContract(await NFTItem.fromInit(0n, owner.address));
        let deployItemMsg: NFTInitData = {
            $$type: 'NFTInitData',
            ownerAddress: owner.address,
            content: defaultContent
        }

        let deployResult = await itemNFT.send(owner.getSender(), {value: toNano("0.1")}, beginCell().store(storeNFTInitData(deployItemMsg)).asSlice());
        // console.log(itemNFT.getOwner());
        // // console.log(beginCell().store(storeNFTInitData(deployItemMsg)).asSlice());
        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: itemNFT.address,
            deploy: true,
            success: true,
        });

    });

    const messageGetStaticData = async (sender: SandboxContract<TreasuryContract>, itemNFT: SandboxContract<NFTItem>) => {
        let msg: GetStaticData = {
            $$type: 'GetStaticData',
            queryId: 1n
        };

        const trxResult = await itemNFT.send(sender.getSender(), {value: toNano("0.1")}, msg);
        return trxResult;
    };


    it("should deploy correctly", async () => {
        // checking in beforeEach
    });
    
    it("should get nft data correctly", async () => {
        let staticData = await itemNFT.getGetNftData();
        
        expect(staticData.init).toBe(-1n);
        expect(staticData.ownerAddress).toEqualAddress(owner.address);
        expect(staticData.index).toBe(0n);
        expect(staticData.content).toEqualCell(defaultContent);
    });

    
    it("should get static data correctly", async () => {
        let trxResult = await messageGetStaticData(owner, itemNFT);
        expect(trxResult.transactions).toHaveTransaction({
            from: owner.address,
            to: itemNFT.address,
            success: true,
        });

    });

    describe("Transfer ownership reject cases", () => {
        it("Transfer forward amount too much", async () => {
            // NFT should reject transfer if balance lower than forward_amount + message forward fee + minimal storage fee
            // Sending message with forward_amount of 1 TON and balance 0.1 TON
    
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, emptyAddress, toNano("1"));
            // console.log(trxResult.transactions);
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 402, // invalid fees
            });
        });
    
        it("test transfer storage fee", async () => {
            //     Now let's try forward_amount exactly equal to balance and fwd_fee 0
            //  1 TON Balance forward_amount:1 TON fwd_fee:0 verifying that minimal storage comes into play
            //  Should fail with no actions
    
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1"), notOwner.address, owner.address, toNano("1.1"));
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 402, // rest amount < min_storage_fee
            });
    
            // Let's verify that storage fee was an error trigger by increasing balance by min_storage
            // Expect success
    
            trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1") + 2n * minTonsForStorage, notOwner.address, owner.address, toNano("1.1"));
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: true
            });
        });
    
        // TODO fix this test ( empty address need ) 
        
    
        it("test transfer forward fee single", async () => {
            // If transfer is successfull NFT supposed to send up to 2 messages
            // 1)To the owner_address with forward_amount of coins
            // 2)To the response_addr with forward_payload if response_addr is not addr_none
            // Each of those messages costs fwd_fee
            // In this case we test scenario where only single message required to be sent
            // To do so resp_dst has be a valid address not equal to addr_none
            let fwd_fee = toNano("0.01");
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), fwd_fee, notOwner.address, owner.address, toNano("0.1") - minTonsForStorage, beginCell().storeUint(1, 1).storeStringTail("testing").asSlice());
            // expect(trxResult.transactions).toHaveTransaction({
            //     from: owner.address,
            //     to: itemNFT.address,
            //     success: true,
            // });
        });
    
        it("test transfer forward fee double", async () => {
            // If transfer is successfull NFT supposed to send up to 2 messages
            // 1)To the owner_address with forward_amount of coins
            // 2)To the response_addr with forward_payload if response_addr is not addr_none
            // Each of those messages costs fwd_fee
            // In this case we test scenario where both messages required to be sent but balance has funs only for single message
            // To do so resp_dst has be a valid address not equal to addr_none
            let fwd_fee = toNano("0.01");
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), fwd_fee, notOwner.address, owner.address, toNano("0.1") - minTonsForStorage, beginCell().storeUint(1, 1).storeStringTail("testing").asSlice());
    
            // expect(trxResult.transactions).toHaveTransaction({
            //     from: owner.address,
            //     to: itemNFT.address,   
            //     success: false,
            //     exitCode: 402, // invalid fees
            // });
        });
    
        it("test success no forward no response", async () => {
            // forward_amount:0 resp_dst:addr_none
            // On successfull execution only address change should occur.
            // Expect no messages to be sent.
    
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, emptyAddress, 0n);
        });
    });

    describe("Transfer Ownership Tests", () => {
        it("Test ownership assigned", async () => {
            let oldOwner = await itemNFT.getOwner();
            expect(oldOwner).toEqualAddress(owner.address);
            let trxRes = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, owner.address, 1n);
    
            // console.log(trxRes.transactions);
            let newOwner = await itemNFT.getOwner();
            expect(newOwner).toEqualAddress(notOwner.address);
            expect(trxRes.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: true,
            });
        });
    
        it("Not owner should not be able to transfer ownership", async () => {
            let trxResult = await sendTransfer(itemNFT, notOwner.getSender(), toNano("0.1"), notOwner.address, emptyAddress, 0n);
            expect(trxResult.transactions).toHaveTransaction({
                from: notOwner.address,
                to: itemNFT.address,
                success: false,
            });
        });

        it("should transfer ownership correctly", async () => {});
    });

    describe("NOT INITIALIZED TESTS", () => {
        const index: bigint = 100n;
        beforeEach(async () => {
            itemNFT = blockchain.openContract(await NFTItem.fromInit(index, owner.address));
            let deployResult = await itemNFT.send(owner.getSender(), {value: toNano("0.1")}, beginCell().asSlice());
        });

        it("should not get static data", async () => {
            let staticData = await itemNFT.getGetNftData();
            expect(staticData.init).toBe(0n);
            expect(staticData.ownerAddress).toBeNull();
            expect(staticData.index).toBe(index);
            expect(staticData.content).toBeNull();
        });

        it("should not transfer ownership", async () => {
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, owner.address, 0n);
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
            });
        });

        it("should not get static data message", async () => {
            
        });
    });
});


NFTCollection.prototype.getNextItemIndex = async function (this: NFTCollection, provider: ContractProvider): Promise<bigint> {
    let res = await this.getGetCollectionData(provider);
    return res.nextItemIndex;
};

NFTCollection.prototype.getOwner = async function (this: NFTCollection, provider: ContractProvider): Promise<Address> {
    let res = await this.getGetCollectionData(provider);
    return res.ownerAddress;
};
describe("NFT Collection Contract", () => {
    let blockchain: Blockchain;
    let collectionNFT: SandboxContract<NFTCollection>;
    let itemNFT: SandboxContract<NFTItem>;

    let owner: SandboxContract<TreasuryContract>;
    let notOwner: SandboxContract<TreasuryContract>;

    let defaultContent: Cell;
    let defaultCommonContent: Cell;
    let defaultCollectionContent: Cell;
    let royaltyParams: RoyaltyParams;

    beforeEach(async () => {
            blockchain = await Blockchain.create();
            owner = await blockchain.treasury("owner");
            notOwner = await blockchain.treasury('notOwner');
    
            defaultCommonContent = beginCell().storeStringTail("common").endCell();
            defaultCollectionContent = beginCell().storeStringRefTail("collectioncontent").endCell();

            defaultContent = beginCell().storeRef(defaultCollectionContent).storeRef(defaultCommonContent).endCell();
                
            royaltyParams = {
                $$type: 'RoyaltyParams',
                nominator: 1n,
                dominator: 100n,
                owner: owner.address,
            } 

            collectionNFT = blockchain.openContract(await NFTCollection.fromInit(owner.address, 0n, defaultContent, royaltyParams));
            let deployCollectionMsg: GetRoyaltyParams = {
                $$type: 'GetRoyaltyParams',
                queryId: 0n
            };

            let deployResult = await collectionNFT.send(owner.getSender(), {value: toNano("0.1")}, deployCollectionMsg);
            expect(deployResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                deploy: true,
                success: true,
            });
  });

    it("should deploy correctly", async () => {
        // checking in beforeEach
    });
    
    it("should get static data correctly", async () => {
        let staticData = await collectionNFT.getGetCollectionData();
        expect(staticData.ownerAddress).toEqualAddress(owner.address);
        expect(staticData.nextItemIndex).toBe(0n);
        expect(staticData.collectionContent).toEqualCell(defaultCollectionContent);
    });

    it("should get nft content correctly", async () => {
        let content = await collectionNFT.getGetNftContent(0n, defaultContent);
        let expectedContent = beginCell().storeUint(1, 8).storeSlice(defaultCommonContent.asSlice()).storeRef(defaultContent).endCell();
        expect(content).toEqualCell(expectedContent);

    });

    describe("ROYALTY TESTS", () => {
        it("test royalty msg", async () => {
            let queryId  = randomInt( 1337 ) + 1;
    
            let msg: GetRoyaltyParams = { 
                $$type: 'GetRoyaltyParams',
                queryId: BigInt(queryId),
            };
    
            const trxResult = await collectionNFT.send(owner.getSender(), {value: toNano("0.1")}, msg);
    
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: true,
            });
    
            let exceptedMsg: Cell = beginCell().storeUint(Op.reportRoyaltyParams, 32)
                                                .storeUint(queryId, 64)
                                                .storeUint(royaltyParams.nominator, 16)
                                                .storeUint(royaltyParams.dominator, 16)
                                                .storeAddress(royaltyParams.owner)
                                                .endCell();
            expect(trxResult.transactions).toHaveTransaction({
                from: collectionNFT.address,
                to: owner.address,
                body: exceptedMsg,
            });
        });
        
        it("test royalty getter", async () => {
            let currRoyaltyParams = await collectionNFT.getRoyaltyParams();
            expect(beginCell().store(storeRoyaltyParams(currRoyaltyParams)).asSlice()).toEqualSlice(beginCell().store(storeRoyaltyParams(royaltyParams)).asSlice());
        });
    });
    
    describe("NFT DEPLOY TESTS", () => {
        it("should deploy NFTItem correctly", async () => {
            // checking in beforeEach
        });
        
        const deployNFT = async (index: bigint, collectionNFT: SandboxContract<NFTCollection>, sender: SandboxContract<TreasuryContract>, owner: SandboxContract<TreasuryContract>): Promise<[SandboxContract<NFTItem>, any]>  => {
            let content = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
            
            let initNFTBody: NFTInitData = {
                $$type: 'NFTInitData',
                ownerAddress: owner.address,
                content: content
            }
    
            let mintMsg: DeployNFT = {
                $$type: 'DeployNFT',
                queryId: 1n, 
                itemIndex: index,
                amount: 10000000n,
                initNFTBody: beginCell().store(storeNFTInitData(initNFTBody)).endCell(),
            };
            
            itemNFT = blockchain.openContract(await NFTItem.fromInit(index, collectionNFT.address));
            
            const trxResult = await collectionNFT.send(sender.getSender(), {value: toNano("0.1")}, mintMsg);
            return [itemNFT, trxResult];
        };
    
        it("should mint NFTItem correctly", async () => {
            let content = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
            
            let [itemNFT, trx] = await deployNFT(nextItemIndex, collectionNFT, owner, owner);
            let nftData = await itemNFT.getGetNftData();
            
            expect(nftData.content).toEqualCell(content);
            expect(nftData.ownerAddress).toEqualAddress(owner.address);
            expect(nftData.index).toBe(nextItemIndex);
            expect(nftData.collectionAddress).toEqualAddress(collectionNFT.address);
    
        });
    
        it("should not mint NFTItem if not owner", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
    
            let [itemNFT, trx] = await deployNFT(nextItemIndex, collectionNFT, notOwner, notOwner);
    
            expect(trx.transactions).toHaveTransaction({
                from: notOwner.address,
                to: collectionNFT.address,
                success: false,
            });
        });
    
        it("should not deploy previous nft", async () => {
            let content = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
    
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!
            for( let i = 0; i < 10; i++) {
                let [itemNFT, trx] = await deployNFT(nextItemIndex++, collectionNFT, owner, owner);
            }
    
            let [itemNFT, trx] = await deployNFT(0n, collectionNFT, owner, owner);
    
            expect(trx.transactions).toHaveTransaction({
                from: collectionNFT.address,
                to: itemNFT.address,
                deploy: false,
                success: false,
            });
            
        });
    
        it("shouldn't mint item index > nextItemIndex", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
            let [itemNFT, trx] = await deployNFT(nextItemIndex + 1n, collectionNFT, owner, owner);
            expect(trx.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: false,
            });
        });
    
        it("test get nft by index", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
            
            // deploy new nft to get index 
            let [itemNFT, trx] = await deployNFT(nextItemIndex, collectionNFT, owner, owner);
            let nftAddress = await collectionNFT.getGetNftAddressByIndex(nextItemIndex);
            let newNFT = blockchain.getContract(nftAddress);
            let getData = await (await newNFT).get('get_nft_data');
            let dataNFT = loadGetterTupleNFTData(getData.stack);
            
            expect(dataNFT.index).toBe(nextItemIndex);
            expect(dataNFT.collectionAddress).toEqualAddress(collectionNFT.address);
        });
    });

    describe("BATCH MINT TESTS", () => {
        const batchMintNFTProcess = async (collectionNFT: SandboxContract<NFTCollection>, sender: SandboxContract<TreasuryContract>, owner: SandboxContract<TreasuryContract>, count: bigint) => {
            let content = Cell.fromBase64("te6ccgEBAQEAAgAAAA==");
            let dct = Dictionary.empty(Dictionary.Keys.BigUint(64), dictDeployNFTItem);
            let i: bigint = 0n;
    
            let initNFTBody: NFTInitData = {
                $$type: 'NFTInitData',
                ownerAddress: owner.address,
                content: content,
            }
    
            while (i < count) {
                dct.set(i, {
                        amount: 10000000n,
                        initNFTBody: initNFTBody
                    }
                );
                i += 1n;
            }
    
            let batchMintNFT: BatchDeploy = {
                $$type: 'BatchDeploy',
                queryId: 0n,
                deployList: beginCell().storeDictDirect(dct).endCell(),
            }
            
            const trxResult = await collectionNFT.send(sender.getSender(), {value: 100000000n * (count + 10n) }, batchMintNFT);
            return trxResult;
        };
    
        it("Should batch mint correctly", async () => { 
            let trxResult = await batchMintNFTProcess(collectionNFT, owner, owner, 10n);
    
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: true,
            });
            itemNFT = blockchain.openContract(await NFTItem.fromInit(9n, collectionNFT.address));
            
            // it was deployed, that's why we can get it
            expect(await itemNFT.getGetNftData()).toHaveProperty('index', 9n);
        });
    
        it("Shouldn't batch mint more than 250 items", async () => { 
            let trxResult = await batchMintNFTProcess(collectionNFT, owner, owner, 251n);
            
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: false,
            });
        });
    
        it('Should not batch mint not owner', async () => {
            let trxResult = await batchMintNFTProcess(collectionNFT, notOwner, owner, 10n);
    
            expect(trxResult.transactions).toHaveTransaction({
                from: notOwner.address,
                to: collectionNFT.address,
                success: false,
            });
        });
    });

    describe("TRANSFER OWNERSHIP TEST", () => {    
        it("Owner should be able to transfer ownership", async () => { 
            let changeOwnerMsg: ChangeOwner = { 
                $$type: 'ChangeOwner',
                queryId: 1n, 
                newOwner: notOwner.address,
            };
    
            const trxResult = await collectionNFT.send(owner.getSender(), {value: 100000000n }, changeOwnerMsg);
    
            expect(trxResult.transactions).toHaveTransaction(
                {
                    from: owner.address,
                    to: collectionNFT.address,
                    success: true,
                }
            );
            expect(await collectionNFT.getOwner()).toEqualAddress(notOwner.address);
        });
        it("Not owner should not be able to transfer ownership", async () => { 
            let changeOwnerMsg: ChangeOwner = { 
                $$type: 'ChangeOwner',
                queryId: 1n, 
                newOwner: owner.address,
            };
    
            const trxResult = await collectionNFT.send(notOwner.getSender(), {value: 100000000n }, changeOwnerMsg);
    
            expect(trxResult.transactions).toHaveTransaction(
                {
                    from: notOwner.address,
                    to: collectionNFT.address,
                    success: false,
                }
            );
        });
    });
});