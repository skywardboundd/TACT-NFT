import "@stdlib/deploy";
import "./op-codes";
import "./messages";
import "./nft-item";

struct DictDelete {
    dict: Cell;
    item: Slice?;
    itemIndex: Int? as uint64;
    flag: Int as uint256;
}

// (cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
asm fun deleteGetMin(dict: Cell, keySize: Int): DictDelete {DICTUREMMIN NULLSWAPIFNOT2 }

contract NFTCollection with WalletExitcodes, GasConstants, OpCodes {
    owner: Address;
    nextItemIndex: Int as uint64;
    content: Cell;
    royaltyParams: RoyaltyParams;

    init(owner: Address, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        self.owner = owner;
        self.nextItemIndex = 0;
        self.content = collectionContent;
        self.royaltyParams = royaltyParams;
    }

    fun deployNFTItem(itemIndex: Int, amount: Int, initNFTBody: Cell) {
        let stateInit: StateInit = initOf NFTItem(itemIndex, myAddress());
        let nftAddress: Address = contractAddress(stateInit);

        send(SendParameters{
            to: nftAddress,
            value: amount,
            body: initNFTBody,
            code: stateInit.code,
            data: stateInit.data,
            mode: 1,
            bounce: false,

        });
    }

    receive(msg: GetRoyaltyParams) {
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            body: ReportRoaltyParams{
                queryId: msg.queryId,
                params: self.royaltyParams,
            }.toCell(),
            mode: 64 
        });
    }

    receive(msg: DeployNFT) {
        nativeThrowUnless(self.IncorrectSender, sender() == self.owner); 
        nativeThrowUnless(self.IncorrectIndex, msg.itemIndex <= self.nextItemIndex);

        self.deployNFTItem(msg.itemIndex, msg.amount, msg.initNFTBody); 

        if(msg.itemIndex == self.nextItemIndex) {
            self.nextItemIndex += 1;
        }
    }

    receive(msg: BatchDeploy) {
        nativeThrowUnless(self.IncorrectSender, sender() == self.owner);

        let counter: Int = 0;
        
        let curr: DictDelete = deleteGetMin(msg.deployList, 64);
        while (curr.flag != 0) {
            counter += 1;
            
            nativeThrowIf(self.IncorrectAmount, counter >= 250);
            nativeThrowUnless(self.IncorrectIndexes + counter, curr.itemIndex!! <= self.nextItemIndex);

            self.deployNFTItem(curr.itemIndex!!, curr.item!!.loadCoins(), curr.item!!.loadRef());
            if (curr.itemIndex!! == self.nextItemIndex) {
                self.nextItemIndex += 1;
            }

            msg.deployList = curr.dict;
            curr = deleteGetMin(msg.deployList, 64);
        }
    }

    receive(msg: ReportRoaltyParams) {
        nativeThrowUnless(self.IncorrectSender, sender() == self.owner);
        self.royaltyParams = msg.params;
    }

    receive(msg: ChangeOwner)  {
        nativeThrowUnless(self.IncorrectSender, sender() == self.owner);
        self.owner = msg.newOwner;
    }
    
    get fun get_collection_data(): CollectionData {
        let cs: Slice = self.content.beginParse();
        return CollectionData{
            nextItemIndex: self.nextItemIndex,
            collectionContent: cs.loadRef(),
            ownerAddress: self.owner
        };
    }

    get fun get_nft_address_by_index(index: Int): Address {
        let stateInit = initOf NFTItem(index, myAddress());
        return contractAddress(stateInit);
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royaltyParams;
    }
}