import "@stdlib/deploy";
import "./constants";
import "./messages";


asm fun emptyAddress(): Address { b{00} PUSHSLICE }

contract NFTItem with WalletExitcodes, GasConstants, OpCodes {
    itemIndex: Int as uint64;
    collectionAddress: Address;

    // state init data don't have this parameters
    ownerAddress: Address? = null;
    content: Cell?         = null;

    init(itemIndex: Int, collectionAddress: Address) {
        self.itemIndex         = itemIndex;
        self.collectionAddress = collectionAddress;
    }

    fun forceChain(address: Address) {
        nativeThrowUnless(self.InvalidDestinationWorkchain, parseStdAddress(address.asSlice()).workchain == 0);
    }

    fun sendMsg(toAddress: Address, amount: Int, op: Int, queryId: Int, payload: Builder, sendMode: Int) {
        let msgBody = beginCell().storeUint(op, 32).storeUint(queryId, 64);
        
        if (payload.bits() != 0 || payload.refs() != 0) {
            msgBody.storeBuilder(payload);
        }
        
        send(SendParameters{
            bounce: false,
            to: toAddress,
            value: amount,
            body: msgBody.endCell(),
            mode: sendMode 
        });
    }
    
    receive() {} //to ignore empty messages 

    // we need it to accept deploy body from NFTCollection
    receive(msg: Slice){
        // we need this type only in init
        nativeThrowUnless(self.InvalidData, self.ownerAddress == null);

        let ownerAddress: Address = msg.loadAddress();
        let content: Cell         = msg.loadRef();    

        nativeThrowUnless(self.IncorrectDeployer, sender() == self.collectionAddress);
        self.ownerAddress = ownerAddress;
        self.content      = content;
    }

    receive(msg: Transfer) {
        // not init 
        nativeThrowUnless(self.NotInit, self.ownerAddress != null);
        nativeThrowUnless(self.IncorrectSender, sender() == self.ownerAddress);
        nativeThrowUnless(708, msg.forwardPayload.bits() >= 1);
        self.forceChain(msg.newOwner);

        let fwdFees: Int = context().readForwardFee();


        let restAmount: Int = myBalance() - self.minTonsForStorage;
        if (msg.forwardAmount > 0) {
            restAmount -= (msg.forwardAmount + fwdFees);
        }

        // when we load addr_none$00 in tact we got null 
        let needResponse: Bool = (msg.responseDestination != null);
        if (needResponse) {
            restAmount -= fwdFees;
        }

        nativeThrowUnless(self.InvalidFees, restAmount >= 0);

        if(msg.forwardAmount > 0){
            self.sendMsg(msg.newOwner, msg.forwardAmount, self.OwnershipAssigned, msg.queryId, beginCell().storeAddress(self.ownerAddress!!).storeSlice(msg.forwardPayload), SendPayGasSeparately);
        }
        if(needResponse) { 
            self.forceChain(msg.responseDestination!!);
            self.sendMsg(msg.responseDestination!!, restAmount, self.Excesses, msg.queryId, beginCell(), SendPayGasSeparately);
        }
        self.ownerAddress = msg.newOwner;
    }

    receive(msg: GetStaticData) {
        // uninit
        nativeThrowUnless(self.NotInit, self.ownerAddress != null);

        self.sendMsg(sender(), 0, self.ReportStaticData, msg.queryId, beginCell().storeUint(self.itemIndex, 256).storeAddress(self.collectionAddress), SendRemainingValue);
    }
   
    get fun get_nft_data(): NFTData {
        return NFTData{
            init: self.ownerAddress != null ? -1 : 0, // -1 is true
            itemIndex: self.itemIndex,
            collectionAddress: self.collectionAddress,
            ownerAddress: self.ownerAddress,
            content: self.content
        };
    }
}

