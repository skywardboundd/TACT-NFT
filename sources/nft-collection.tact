import "@stdlib/ownable";
import "./constants";
import "./messages";
import "./nft-item";

struct DictGet {
    item: Slice;
    flag: Int;
}

// (slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
asm fun dictGet(index: Int, dict: Cell, keySize: Int): DictGet { DICTUGET NULLSWAPIFNOT}

contract NFTCollection with ExitCodes, GasConstants, OpCodes, OwnableTransferable {
    owner: Address;
    nextItemIndex: Int as uint64;
    content: Cell;
    royaltyParams: RoyaltyParams;

    commonCode: Cell;
    commonData: Builder;

    init(owner: Address, nextItemIndex: Int, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        self.owner         = owner;
        self.nextItemIndex = nextItemIndex;
        self.content       = collectionContent;
        self.royaltyParams = royaltyParams;

        self.commonCode    = (initOf NFTItem( myAddress(), 0)).code;
        self.commonData    = beginCell().storeUint(0, 1).storeAddress(myAddress());
    }
    
    inline fun deployNFTItem(itemIndex: Int, amount: Int, initNFTBody: Cell) {
        let data: Cell = self.commonData.storeInt(itemIndex, 257).endCell();

        deploy(DeployParameters{
            value: amount,
            body: initNFTBody,
            init: StateInit{code: self.commonCode, data: data},
            mode: SendPayGasSeparately     
        })
    }

    receive() {} // igrore empty messages
    
    receive(msg: GetRoyaltyParams) {
        message(MessageParameters{
            bounce: false,
            to: sender(),
            value: 0,
            body: ReportRoyaltyParams{
                      queryId: msg.queryId,
                      params:  self.royaltyParams,
                    }.toCell(),
            mode: SendRemainingValue 
        });
    }

    receive(msg: DeployNFT) {
        throwUnless(self.IncorrectSender, self.owner == sender());
        throwUnless(self.IncorrectIndex, msg.itemIndex <= self.nextItemIndex);

        nativeReserve(0, 4);

        self.deployNFTItem(msg.itemIndex, msg.amount, msg.initNFTBody); 

        if(msg.itemIndex == self.nextItemIndex) {
            self.nextItemIndex += 1;
        }

        message(MessageParameters{ bounce: false, to: sender(), value: 0, mode: SendRemainingBalance });
    }

    receive(msg: BatchDeploy) {
        self.requireOwner();
        
        nativeReserve(0, 4);

        // not >= 250 
        let check: DictGet = dictGet(self.nextItemIndex + 249, msg.deployList, 64);
        throwUnless(self.IncorrectAmount, check.flag == 0);

        let curr: DictGet = dictGet(self.nextItemIndex, msg.deployList, 64);
        while (curr.flag != 0) {
            self.deployNFTItem(self.nextItemIndex, curr.item.loadCoins(), curr.item.loadRef());
            
            self.nextItemIndex += 1;
            curr = dictGet(self.nextItemIndex, msg.deployList, 64);
        }

        message(MessageParameters{ bounce: false, to: sender(), value: 0, mode: SendRemainingBalance }); // return tons
    }
    
    get fun get_collection_data(): CollectionData {
        let cs: Slice = self.content.beginParse();
        return CollectionData{
            nextItemIndex: self.nextItemIndex,
            collectionContent: cs.loadRef(),
            owner: self.owner
        };
    }

    get fun get_nft_address_by_index(index: Int): Address {
        let stateInit = initOf NFTItem(myAddress(), index);
        return contractAddress(stateInit);
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royaltyParams;
    }

    get fun get_nft_content(index: Int, individualNFTContent: Cell): Cell {
        let cs = self.content.beginParse();
        cs.loadRef();
        let commonContent = cs.loadRef().beginParse();
        return beginCell().storeUint(1, 8).storeSlice(commonContent).storeRef(individualNFTContent).endCell();
    }
}