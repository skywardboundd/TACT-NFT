import { Address, beginCell, Cell, Slice, ContractProvider, Sender, toNano, Builder, Dictionary, TupleItem, TupleItemInt, TupleItemSlice, TupleItemCell } from '@ton/core';
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
} from '@ton/sandbox';

import {
    NFTCollection,
    DeployNFT,
    GetRoyaltyParams,
    GetStaticData,
    BatchDeploy,
    storeRoyaltyParams,
    RoyaltyParams,
    InitNFTBody,
    loadInitNFTBody,
    ChangeOwner
} from "./output/NFT_NFTCollection";

import {
    NFTItem,
    Transfer,
    NFTData,
    storeInitNFTBody,  
}   from "./output/NFT_NFTItem";

import "@ton/test-utils";
import { randomInt } from 'crypto';

export type dictDeployNFT = {
    amount: bigint;
    initNFTBody: InitNFTBody;
};
// for correct work with dictionary 
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

const minTonsForStorage = 50000000n;
const sendTransfer = async (
    itemNFT: SandboxContract<NFTItem>,
    from: Sender,
    value: bigint,
    newOwner: Address,
    responseDestination: Address | null,
    forwardAmount: bigint,
    forwardPayload: Slice = beginCell().storeUint(0, 1).asSlice(),
) => {
    let msg: Transfer = {
        $$type: 'Transfer',
        queryId: 0n,
        newOwner: newOwner,
        responseDestination: responseDestination,
        customPayload: null, // we don't use it in contract 
        forwardAmount: forwardAmount,
        forwardPayload: forwardPayload,
    };

    return await itemNFT.send(from, { value }, msg);
};

function loadGetterTupleNFTData(source: TupleItem[]): NFTData {
    let _init = (source[0] as TupleItemInt).value;
    let _index = (source[1] as TupleItemInt).value;
    let _collectionAddress = (source[2] as TupleItemSlice).cell.asSlice().loadAddress();
    let _owner = (source[3] as TupleItemSlice).cell.asSlice().loadAddress();
    let _content = (source[4] as TupleItemCell).cell;
    return { $$type: 'NFTData' as const, init: _init, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

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

NFTItem.prototype.getOwner = async function (this: NFTItem, provider: ContractProvider): Promise<Address | null> {
    let res = await this.getGetNftData(provider);
    return res.owner;
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
        defaultContent = Cell.fromBase64("te6ccgEBAQEAAgAAAA=="); // just some content ( doesn't matter )

        itemNFT = blockchain.openContract(await NFTItem.fromInit(owner.address, 0n));
        let deployItemMsg: InitNFTBody = {
            $$type: 'InitNFTBody',
            owner: owner.address,
            content: defaultContent
        }

        let deployResult = await itemNFT.send(owner.getSender(), {value: toNano("0.1")}, beginCell().store(storeInitNFTBody(deployItemMsg)).asSlice());

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
        expect(staticData.owner).toEqualAddress(owner.address);
        expect(staticData.itemIndex).toBe(0n);
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
    
    describe("Transfer ownership Fee cases", () => {
        let balance: bigint;
        let fwdFee = 601206n;             // just run test & dump it 

        beforeEach(async () => {
            balance = await (await blockchain.getContract(itemNFT.address)).balance;
        });

        it("Transfer forward amount too much", async () => {
            // NFT should reject transfer if balance lower than forward_amount + message forward fee + minimal storage fee
            // Sending message with forward_amount of 1 TON and balance 0.1 TON
    
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, emptyAddress, toNano("1"));
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 402, // invalid fees
            });
        });
    
        it("test transfer storage fee", async () => {
            //     Now let's try forward_amount exactly equal to balance and fwd_fee 0
            //  1 TON Balance forward_amount:1 TON fwd_fee:0 (just add to transfer value) verifying that minimal storage comes into play
            //  Should fail with no actions

            // [] and {} just kinds of () for more understandable description
            
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1") + fwdFee, notOwner.address, emptyAddress, toNano("1") + balance); // balance + 1ton + fwd - (1ton + balance) = [0] + {fwdFee} and [0] < [minTonsForStorage] 
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 402, // rest amount = 0 < min_storage_fee
            });
        });
        it("test transfer forward fee 2.0", async () => {
            // Let's verify that storage fee was an error trigger by increasing balance by min_storage
            // Expect success

            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1") + minTonsForStorage + fwdFee, notOwner.address, emptyAddress, toNano("1") + balance); // balance + 1ton + minTonsForStorage + fwdFee - (1ton + balance) = [minTonsForStorage] + {fwdFee}
            
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: true
            }); 
        });
        
        fwdFee = 623605n; // just run test & dump it 
        it("test transfer forward fee single", async () => {
            // If transfer is successfull NFT supposed to send up to 2 messages
            // 1)To the owner_address with forward_amount of coins
            // 2)To the response_addr with forward_payload if response_addr is not addr_none
            // Each of those messages costs fwd_fee
            // In this case we test scenario where only single message required to be sent

            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1") + fwdFee, notOwner.address, emptyAddress, toNano("1") + balance - minTonsForStorage, beginCell().storeUint(1, 1).storeStringTail("testing").asSlice()); // balance + 1ton + fwdFee - (1ton + balance - minTonsForStorage) = [minTonsForStorage]  + {fwdFee}

            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: true
            });
            
        });

        describe("test transfer forward fee double", () => {
            beforeEach(async () => {
                fwdFee = 729606n; // just run test & dump it 
            });
            it("should false with only one fwd fee on balance", async () => {
                // If transfer is successfull NFT supposed to send up to 2 messages
                // 1)To the owner_address with forward_amount of coins
                // 2)To the response_addr with forward_payload if response_addr is not addr_none
                // Each of those messages costs fwd_fee
                // In this case we test scenario where both messages required to be sent but balance has funs only for single message
                // To do so resp_dst has be a valid address not equal to addr_none

                let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1") + fwdFee, notOwner.address, owner.address, toNano("1") + balance - minTonsForStorage, beginCell().storeUint(1, 1).storeStringTail("testing").asSlice());
        
                // 1ton + fwdFee - (1ton + balance - minTonsForStorage) = [minTonsForStorage] + {fwdFee} and {fwdFee} < {2 * fwdFee}
                expect(trxResult.transactions).toHaveTransaction({
                    from: owner.address,
                    to: itemNFT.address,   
                    success: false,
                    exitCode: 402, // invalid fees
                });
            });

            // let now check if we have 2 fwdFees on balance 
            it("should work with 2 fwdFee on balance", async () => {
                let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("1") + 2n * fwdFee, notOwner.address, owner.address, toNano("1") + balance - minTonsForStorage, beginCell().storeUint(1, 1).storeStringTail("testing").asSlice());
                // 1ton + 2 * fwdFee - (1ton + balance - minTonsForStorage) = [minTonsForStorage] + {2 * fwdFee} 
                expect(trxResult.transactions).toHaveTransaction({
                    from: owner.address,
                    to: itemNFT.address,
                    success: true,
                });
                balance = await (await blockchain.getContract(itemNFT.address)).balance;
                expect(balance < minTonsForStorage);

            });
        });
        // int __test_transfer_success_forward_no_response testing in next test suite 
    });

    describe("Transfer Ownership Tests", () => {
        it("Test ownership assigned", async () => {
            let oldOwner = await itemNFT.getOwner();
            expect(oldOwner).toEqualAddress(owner.address);
            let trxRes = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, owner.address, 1n);
    
            let newOwner = await itemNFT.getOwner();
            expect(newOwner).toEqualAddress(notOwner.address);
            expect(trxRes.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: true,
            });
        });

        it("Test transfer ownership without any messages", async () => {
            let trxRes = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, emptyAddress, 0n);
            let newOwner = await itemNFT.getOwner();
            expect(newOwner).toEqualAddress(notOwner.address);
            expect(trxRes.transactions).not.toHaveTransaction({
                from: itemNFT.address
            });
        });
    
        it("Not owner should not be able to transfer ownership", async () => {
            let trxResult = await sendTransfer(itemNFT, notOwner.getSender(), toNano("0.1"), notOwner.address, emptyAddress, 0n);
            expect(trxResult.transactions).toHaveTransaction({
                from: notOwner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 401, // not owner
            });
        });
    });

    describe("NOT INITIALIZED TESTS", () => {
        const itemIndex: bigint = 100n;
        beforeEach(async () => {
            itemNFT = blockchain.openContract(await NFTItem.fromInit(owner.address, itemIndex));
            let deployResult = await itemNFT.send(owner.getSender(), {value: toNano("0.1")}, beginCell().asSlice());
        });

        it("should not get static data", async () => {
            let staticData = await itemNFT.getGetNftData();
            expect(staticData.init).toBe(0n);
            expect(staticData.owner).toBeNull();
            expect(staticData.itemIndex).toBe(itemIndex);
            expect(staticData.content).toBeNull();
        });

        it("should not transfer ownership", async () => {
            let trxResult = await sendTransfer(itemNFT, owner.getSender(), toNano("0.1"), notOwner.address, owner.address, 0n);
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 9, // not init
            });
        });

        it("should not get static data message", async () => {
            let trxResult = await messageGetStaticData(owner, itemNFT);
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                success: false,
                exitCode: 9, // not init
            });
        });
    });
});


NFTCollection.prototype.getNextItemIndex = async function (this: NFTCollection, provider: ContractProvider): Promise<bigint> {
    let res = await this.getGetCollectionData(provider);
    return res.nextItemIndex;
};

NFTCollection.prototype.getOwner = async function (this: NFTCollection, provider: ContractProvider): Promise<Address> {
    let res = await this.getGetCollectionData(provider);
    return res.owner;
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
    let defaultNFTContent: Cell;
    let royaltyParams: RoyaltyParams;

    beforeEach(async () => {
            blockchain = await Blockchain.create();
            owner = await blockchain.treasury("owner");
            notOwner = await blockchain.treasury('notOwner');
    
            defaultCommonContent = beginCell().storeStringTail("common").endCell();
            defaultCollectionContent = beginCell().storeStringTail("collectioncontent").endCell();

            defaultNFTContent = beginCell().storeStringTail("1.json").endCell();

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
        expect(staticData.owner).toEqualAddress(owner.address);
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
        
        const deployNFT = async (itemIndex: bigint, collectionNFT: SandboxContract<NFTCollection>, sender: SandboxContract<TreasuryContract>, owner: SandboxContract<TreasuryContract>): Promise<[SandboxContract<NFTItem>, any]>  => {
            
            let initNFTBody: InitNFTBody = {
                $$type: 'InitNFTBody',
                owner: owner.address,
                content: defaultNFTContent
            }
    
            let mintMsg: DeployNFT = {
                $$type: 'DeployNFT',
                queryId: 1n, 
                itemIndex: itemIndex,
                amount: 10000000n,
                initNFTBody: beginCell().store(storeInitNFTBody(initNFTBody)).endCell(),
            };
            
            itemNFT = blockchain.openContract(await NFTItem.fromInit(collectionNFT.address, itemIndex));
            
            const trxResult = await collectionNFT.send(sender.getSender(), {value: toNano("0.1")}, mintMsg);
            return [itemNFT, trxResult];
        };
    
        it("should mint NFTItem correctly", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
            
            let [itemNFT, trx] = await deployNFT(nextItemIndex, collectionNFT, owner, owner);
            let nftData = await itemNFT.getGetNftData();
            
            expect(nftData.content).toEqualCell(defaultNFTContent);
            expect(nftData.owner).toEqualAddress(owner.address);
            expect(nftData.itemIndex).toBe(nextItemIndex);
            expect(nftData.collectionAddress).toEqualAddress(collectionNFT.address);
    
        });
    
        it("should not mint NFTItem if not owner", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
    
            let [itemNFT, trx] = await deployNFT(nextItemIndex, collectionNFT, notOwner, notOwner);
    
            expect(trx.transactions).toHaveTransaction({
                from: notOwner.address,
                to: collectionNFT.address,
                success: false,
                exitCode: 401,
            });
        });
    
        it("should not deploy previous nft", async () => {

            let nextItemIndex: bigint = await collectionNFT.getNextItemIndex()!!
            for( let i = 0; i < 10; i++) {
                let [itemNFT, trx] = await deployNFT(nextItemIndex++, collectionNFT, owner, owner);
            }
    
            let [itemNFT, trx] = await deployNFT(0n, collectionNFT, owner, owner);
            
            expect(trx.transactions).toHaveTransaction({
                from: collectionNFT.address,
                to: itemNFT.address,
                deploy: false,
                success: false,
                exitCode: 65535,
            });
            
        });
    
        it("shouldn't mint item itemIndex > nextItemIndex", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
            let [itemNFT, trx] = await deployNFT(nextItemIndex + 1n, collectionNFT, owner, owner);
            expect(trx.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: false,
                exitCode: 402
            });
        });
    
        it("test get nft by itemIndex", async () => {
            let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
            
            // deploy new nft to get itemIndex 
            let [itemNFT, trx] = await deployNFT(nextItemIndex, collectionNFT, owner, owner);
            let nftAddress = await collectionNFT.getGetNftAddressByIndex(nextItemIndex);
            let newNFT = blockchain.getContract(nftAddress);
            let getData = await (await newNFT).get('get_nft_data');
            let dataNFT = loadGetterTupleNFTData(getData.stack);
            
            expect(dataNFT.itemIndex).toBe(nextItemIndex);
            expect(dataNFT.collectionAddress).toEqualAddress(collectionNFT.address);
        });
    });

    describe("BATCH MINT TESTS", () => {
        const batchMintNFTProcess = async (collectionNFT: SandboxContract<NFTCollection>, sender: SandboxContract<TreasuryContract>, owner: SandboxContract<TreasuryContract>, count: bigint) => {
            let dct = Dictionary.empty(Dictionary.Keys.BigUint(64), dictDeployNFTItem);
            let i: bigint = 0n;
    
            let initNFTBody: InitNFTBody = {
                $$type: 'InitNFTBody',
                owner: owner.address,
                content: defaultNFTContent,
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
            
            const trxResult = await collectionNFT.send(sender.getSender(), {value: toNano("100") * (count + 10n) }, batchMintNFT);
            return trxResult;
        };
        beforeEach(async () => {});
        
        it("test max batch mint", async () => {
            let L = 1n;
            let R = 250n;
            while(R - L > 1) { 
                let M = (L + R) / 2n;
                let trxResult = await batchMintNFTProcess(collectionNFT, owner, owner, M);
                try{ 
                    expect(trxResult.transactions).toHaveTransaction({
                        from: owner.address,
                        to: collectionNFT.address,
                        success: true,
                    });
                    L = M;
                }
                catch { 
                    R = M;
                }
            }
            console.log("maximum batch amount is", L);
        });
        
        
        it("Should batch mint correctly", async () => { 
            let count = 50n;
            let trxResult = await batchMintNFTProcess(collectionNFT, owner, owner, count);
    
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: true,
            });
            itemNFT = blockchain.openContract(await NFTItem.fromInit(collectionNFT.address, count - 1n));
            
            // it was deployed, that's why we can get it
            expect(await itemNFT.getGetNftData()).toHaveProperty('itemIndex', count - 1n);
        });
    
        // this test doesn't make sense because we can only mint 130 in func & 72 on tact 1.5.4 ( 128 in tact 1.6 dev vers ) 
        it("Shouldn't batch mint more than 250 items", async () => {
            let trxResult = await batchMintNFTProcess(collectionNFT, owner, owner, 260n);
            
            expect(trxResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                success: false
            }); // in orig func contracts exit code -14, but it throw in code 399 ( we can just check )
        });
    
        it('Should not batch mint not owner', async () => {
            let trxResult = await batchMintNFTProcess(collectionNFT, notOwner, owner, 10n);
    
            expect(trxResult.transactions).toHaveTransaction({
                from: notOwner.address,
                to: collectionNFT.address,
                success: false,
                exitCode: 401
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
    
            expect(trxResult.transactions).toHaveTransaction({
                    from: owner.address,
                    to: collectionNFT.address,
                    success: true,
            });
            expect(await collectionNFT.getOwner()).toEqualAddress(notOwner.address);
        });
        it("Not owner should not be able to transfer ownership", async () => { 
            let changeOwnerMsg: ChangeOwner = { 
                $$type: 'ChangeOwner',
                queryId: 1n, 
                newOwner: owner.address,
            };
    
            const trxResult = await collectionNFT.send(notOwner.getSender(), {value: 100000000n }, changeOwnerMsg);
    
            expect(trxResult.transactions).toHaveTransaction({
                    from: notOwner.address,
                    to: collectionNFT.address,
                    success: false,
                    exitCode: 401
            });
        });
    });
});