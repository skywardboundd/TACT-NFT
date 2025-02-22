import "@stdlib/deploy";
import "./op-codes";
import "./messages";


asm fun emptyAddress(): Address { b{00} PUSHSLICE }

contract NFTItem with WalletExitcodes, GasConstants, OpCodes {
    index: Int as uint64;
    collectionAddress: Address;
    ownerAddress: Address? = null;
    content: Cell? = null;

    init(index: Int, collectionAddress: Address) {
        self.index = index;
        self.collectionAddress = collectionAddress;
    }

    fun forceChain(address: Address) {
        nativeThrowUnless(self.InvalidDestinationWorkchain, parseStdAddress(address.asSlice()).workchain == 0);
    }

    fun sendMsg(toAddress: Address, amount: Int, op: Int, queryId: Int, payload: Builder, sendMode: Int) {

        let msg: Builder = beginCell()
            .storeUint(0x10, 6)
            .storeAddress(toAddress)
            .storeCoins(amount)
            .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .storeUint(op, 32)
            .storeUint(queryId, 64);

        if (payload.bits() != 0 || payload.refs() != 0) {
            msg = msg.storeBuilder(payload);
        }

        nativeSendMessage(msg.endCell(), sendMode);
    }
    //to ignore empty messages 
    receive() {}

    // we need it to accept deploy body from NFTCollection
    receive(msg: Slice){
        // we need only use 
        nativeThrowUnless(self.InvalidData, self.ownerAddress == null);

        let ownerAddress: Address = msg.loadAddress();
        let content: Cell = msg.loadRef();    

        nativeThrowUnless(self.IncrorrectDeployer, sender() == self.collectionAddress);
        self.ownerAddress = ownerAddress;
        self.content = content;
    }

    receive(msg: Transfer) {
        // not init 
        nativeThrowUnless(self.IncrorrectDeployer, self.ownerAddress != null);
        
        nativeThrowUnless(self.IncorrectSender, sender() == self.ownerAddress);
        nativeThrowUnless(708, msg.forwardPayload.bits() >= 1);

        let fwdFees: Int = context().readForwardFee();
        
        self.forceChain(msg.newOwner);
        let restAmount: Int = myBalance() - self.minTonsForStorage;
        if (msg.forwardAmount > 0) {
            restAmount -= (msg.forwardAmount + fwdFees);
        }

        let needResponse: Bool = (msg.responseDestination.asSlice().preloadUint(2) != 0);

        if (needResponse) {
            restAmount -= fwdFees;
        }
        nativeThrowUnless(self.InvalidFees, restAmount >= 0);

        if(msg.forwardAmount > 0){
            self.sendMsg(msg.newOwner, msg.forwardAmount, self.OwnershipAssigned, msg.queryId, beginCell().storeAddress(self.ownerAddress!!).storeSlice(msg.forwardPayload), 1);
        }
        if(needResponse) { 
            self.forceChain(msg.responseDestination);
            self.sendMsg(msg.responseDestination, restAmount, self.Excesses, msg.queryId, beginCell(), 1);
        }
        self.ownerAddress = msg.newOwner;
    }

    receive(msg: GetStaticData) {
        // uninit
        nativeThrowUnless(self.IncrorrectDeployer, self.ownerAddress != null);

        self.sendMsg(sender(), 0, self.ReportStaticData, msg.queryId, beginCell().storeUint(self.index, 256).storeAddress(self.collectionAddress), 64);
    }
   
    get fun get_nft_data(): NFTData {
        return NFTData{
            init: self.ownerAddress != null ? -1 : 0,
            index: self.index,
            collectionAddress: self.collectionAddress,
            ownerAddress: self.ownerAddress,
            content: self.content
        };
    }
}

