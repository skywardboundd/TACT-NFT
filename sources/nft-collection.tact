import "@stdlib/ownable";
import "./constants";
import "./messages";
import "./nft-item";

contract NFTCollection with ExitCodes, GasConstants, OpCodes, OwnableTransferable {
    owner: Address;
    nextItemIndex: Int as uint64;
    content: Cell;
    royaltyParams: RoyaltyParams;

    init(owner: Address, nextItemIndex: Int, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        self.owner         = owner;
        self.nextItemIndex = nextItemIndex;
        self.content       = collectionContent;
        self.royaltyParams = royaltyParams;
    }
    
    inline fun deployNFTItem(itemIndex: Int, amount: Int, initNFTBody: InitNFTBody, code: Cell, commondata: Builder) {
        let data: Cell = commondata.storeInt(itemIndex, 257).endCell();

        deploy(DeployParameters{
            value: amount,
            body: initNFTBody.toCell(),
            init: StateInit{code: code, data: data},
            mode: SendPayGasSeparately     
        })
    }

    receive() {} // igrore empty messages
    
    receive(msg: GetRoyaltyParams) {
        send(SendParameters{
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
        nativeThrowUnless(self.IncorrectSender, self.owner == sender());
        nativeThrowUnless(self.IncorrectIndex, msg.itemIndex <= self.nextItemIndex);

        let initNFTBody = InitNFTBody{
            queryId: msg.queryId,
            owner: msg.owner,
            content: msg.content
        };

        let commonCode: Cell = (initOf NFTItem( myAddress(), 0)).code;
        let commondata: Builder = beginCell().storeUint(0, 1).storeAddress(myAddress());

        self.deployNFTItem(msg.itemIndex, msg.amount, initNFTBody, commonCode, commondata); 

        if(msg.itemIndex == self.nextItemIndex) {
            self.nextItemIndex += 1;
        }
    }

    receive(msg: BatchDeploy) {
        self.requireOwner();

        nativeReserve(0, 4);

        let check: InitNFTBodyDict? = msg.deployList.get(self.nextItemIndex + 249);
        nativeThrowUnless(self.IncorrectAmount, check == null);
        
        let commonsCode: Cell = (initOf NFTItem(myAddress(), 0)).code;
        let commonData = beginCell().storeUint(0, 1).storeAddress(myAddress());
        
        let curr: InitNFTBodyDict?  = msg.deployList.get(self.nextItemIndex);
        while (curr != null) {
            nativeThrowUnless(self.IncorrectIndexes + self.nextItemIndex, self.nextItemIndex <= self.nextItemIndex); 
            
            let initNFTBody = InitNFTBody {
                queryId: msg.queryId,
                owner: curr!!.owner,
                content: curr!!.content
            };

            self.deployNFTItem(self.nextItemIndex, curr!!.amount, initNFTBody, commonsCode, commonData);
            
            self.nextItemIndex += 1;
            curr = msg.deployList.get(self.nextItemIndex);
        }

        send(SendParameters{ bounce: false, to: sender(), value: 0, mode: SendRemainingBalance }); // return tons
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