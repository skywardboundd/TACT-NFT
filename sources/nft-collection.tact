import "@stdlib/ownable";
import "./constants";
import "./messages";
import "./nft-item";

contract NFTCollection with WalletExitcodes, GasConstants, OpCodes, OwnableTransferable {
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
    
    fun deployNFTItem(itemIndex: Int, amount: Int, initNFTBody: InitNFTBody) {
        let stateInit: StateInit = initOf NFTItem(itemIndex, myAddress());
        let nftAddress: Address  = contractAddress(stateInit);

        send(SendParameters{
            to: nftAddress,
            value: amount,
            body: initNFTBody.toCell(),
            code: stateInit.code,
            data: stateInit.data,
            mode: SendPayGasSeparately     
        });
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
        self.requireOwner();
        nativeThrowUnless(self.IncorrectIndex, msg.itemIndex <= self.nextItemIndex);

        let initNFTBody = InitNFTBody{
            queryId: msg.queryId,
            owner: msg.owner,
            content: msg.content
        };

        self.deployNFTItem(msg.itemIndex, msg.amount, initNFTBody); 

        if(msg.itemIndex == self.nextItemIndex) {
            self.nextItemIndex += 1;
        }
    }

    receive(msg: BatchDeploy) {
        self.requireOwner();

        nativeReserve(0, 4);

        let counter: Int          = 0;
        let curr: InitNFTBodyDict? = msg.deployList.get(counter);
        
        while (curr != null) {
            counter += 1;
            
            nativeThrowIf(self.IncorrectAmount, counter >= 250);
            nativeThrowUnless(self.IncorrectIndexes + counter, curr!!.index <= self.nextItemIndex);

            let initNFTBody = InitNFTBody {
                queryId: msg.queryId,
                owner: curr!!.owner,
                content: curr!!.content
            };

            self.deployNFTItem(curr!!.index, curr!!.amount, initNFTBody);
            if (curr!!.index == self.nextItemIndex) {
                self.nextItemIndex += 1;
            }

            curr = msg.deployList.get(counter);
        }

        send(SendParameters{ bounce: false, to: sender(), value: 0, mode: 128 }); // return tons
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
        let stateInit = initOf NFTItem(index, myAddress());
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