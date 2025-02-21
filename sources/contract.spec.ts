import { Address, beginCell, Cell, Slice, ContractProvider, Sender, toNano, Builder, Dictionary, DictionaryKey } from '@ton/core';
import {
    Blockchain,
    SandboxContract,
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
    storeNFTInitData
} from "./output/NFT_NFTCollection";

import {
    NFTItem,
    Transfer,
    NFTData,
}   from "./output/NFT_NFTItem"
import "@ton/test-utils";
import { randomInt } from 'crypto';


// const Transfer: Int = 0x5fcc3d14;
// const OwnershipAssigned: Int = 0x05138d91;
// const Excesses: Int = 0xd53276db;
// const GetStaticData: Int = 0x2fcb26a2;
// const ReportStaticData: Int = 0x8b771735;
// const GetRoyaltyParams: Int = 0x693d3950;
// const ReportRoyaltyParams: Int = 0xa8cb00ad;

// // NFTEditable
// const EditContent: Int = 0x1a0b9d51;
// const TransferEditorship: Int = 0x1c04412a;
// const EditorshipAssigned: Int = 0x511a4463; 
export type dictDeployNFT = {
    amount: bigint;
    initNFTBody: NFTInitData;
};


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


describe("NFT Collection Contract", () => {
    let blockchain: Blockchain;
    let collectionNFT: SandboxContract<NFTCollection>;
    let itemNFT: SandboxContract<NFTItem>;

    let owner: SandboxContract<TreasuryContract>;
    let notOwner: SandboxContract<TreasuryContract>;

    let userWallet: any;

    let defaultContent: Cell;
    let royaltyParams: RoyaltyParams;

    const royaltyAsCell = (royaltyParams: RoyaltyParams): Cell => {
        return beginCell().store(storeRoyaltyParams(royaltyParams)).endCell();
    };

    NFTCollection.prototype.getNextItemIndex = async function (this: NFTCollection, provider: ContractProvider): Promise<bigint> {
        let res = await this.getGetCollectionData(provider);
        console.log(res);
        return res.nextItemIndex;
    };

    const sendReportRoyaltyParams = async (
                    from: Sender,
                    value: bigint,
                    royaltyParams: RoyaltyParams,
                ) => {
                    let msg: ReportRoaltyParams = {
                        $$type: 'ReportRoaltyParams',
                        queryId: 0n,
                        params: royaltyParams,
                    };
    
                    return await collectionNFT.send(from, { value }, msg);
                };

    const sendTransfer = async (
                    itemNFT: SandboxContract<NFTItem>,
                    from: Sender,
                    value: bigint,
                    newOwner: Address,
                    responceDestination: Address,
                    forwardAmount: bigint,
                    fornwardPayload: Slice,
                ) => {
                    let msg: Transfer = {
                        $$type: 'Transfer',
                        queryId: 0n,
                        newOwner: newOwner,
                        responseDestination: responceDestination,
                        forwardAmount: forwardAmount,
                        forwardPayload: fornwardPayload,
                    };
    
                    return await itemNFT.send(from, { value }, msg);
                };

    beforeAll(async () => {
            blockchain = await Blockchain.create();
            owner = await blockchain.treasury("owner");
            notOwner = await blockchain.treasury('notOwner');
    
            defaultContent = beginCell().storeRef(beginCell().endCell()).endCell();
            
            royaltyParams = {
                $$type: 'RoyaltyParams',
                nominator: 1n,
                dominator: 100n,
                owner: owner.address,
            } 

            collectionNFT = blockchain.openContract(await NFTCollection.fromInit(owner.address, defaultContent, royaltyParams));
            let deployCollectionMsg: ReportRoaltyParams = {
                $$type: 'ReportRoaltyParams',
                queryId: 0n,
                params: royaltyParams,
            };

            console.log(collectionNFT.address);

            let deployResult = await collectionNFT.send(owner.getSender(), {value: toNano("0.1")}, deployCollectionMsg);

            expect(deployResult.transactions).toHaveTransaction({
                from: owner.address,
                to: collectionNFT.address,
                deploy: true,
                success: true,
            });


            itemNFT = blockchain.openContract(await NFTItem.fromInit(0n, owner.address));
            let deployItemMsg: GetStaticData = {
                $$type: 'GetStaticData',
                queryId: 0n,
            }

            deployResult = await itemNFT.send(owner.getSender(), {value: toNano("0.1")}, deployItemMsg);
            
            expect(deployResult.transactions).toHaveTransaction({
                from: owner.address,
                to: itemNFT.address,
                deploy: true,
                success: true,
            });
  });

    it("should deploy correctly", async () => {
        // checking in befareAll
    });
    
    it("----ROYALTY TESTS----", async () => {});

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
        expect(currRoyaltyParams == royaltyParams);
    });

    it("owner should be able to change royalty params", async () => {
        let newRoyaltyParams: RoyaltyParams = {
            $$type: 'RoyaltyParams',
            nominator: 2n,
            dominator: 100n,
            owner: owner.address,
        } 

        sendReportRoyaltyParams(owner.getSender(), toNano("0.1"), newRoyaltyParams);

        let currRoyaltyParams = await collectionNFT.getRoyaltyParams();
        expect(currRoyaltyParams == newRoyaltyParams);
    });

    it("not owner should not be able to change royalty params", async () => {
        let newRoyaltyParams: RoyaltyParams = {
            $$type: 'RoyaltyParams',
            nominator: 2n,
            dominator: 100n,
            owner: owner.address,
        } 

        let trxResult = await sendReportRoyaltyParams(notOwner.getSender(), toNano("0.1"), newRoyaltyParams);
        
        expect(trxResult.transactions).toHaveTransaction({
            from: notOwner.address,
            to: collectionNFT.address,
            success: false,
        });
    });

    it("----NFT DEPLOY TESTS----", async () => {});

    it("should deploy NFTItem correctly", async () => {
        // checking in befareAll
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
        
        expect(nftData.content == content);
        expect(nftData.ownerAddress == owner.address);
        expect(nftData.index == nextItemIndex);
        expect(nftData.collectionAddress == collectionNFT.address);

    });

    it("should not mint NFTItem if not owner", async () => {
        let nextItemIndex = await collectionNFT.getNextItemIndex()!!;
        console.log(nextItemIndex);

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

    it("----BATCH MINT TESTS-----", async () => {});

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

    it('Should batch mint not owner', async () => {
        let trxResult = await batchMintNFTProcess(collectionNFT, notOwner, owner, 10n);

        expect(trxResult.transactions).toHaveTransaction({
            from: notOwner.address,
            to: collectionNFT.address,
            success: false,
        });
    });

});