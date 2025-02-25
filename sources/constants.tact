trait OpCodes {
    const Transfer: Int = 0x5fcc3d14;
    const OwnershipAssigned: Int = 0x05138d91;
    const Excesses: Int = 0xd53276db;
    const GetStaticData: Int = 0x2fcb26a2;
    const ReportStaticData: Int = 0x8b771735;
    const GetRoyaltyParams: Int = 0x693d3950;
    const ReportRoyaltyParams: Int = 0xa8cb00ad;

    // NFTEditable
    const EditContent: Int = 0x1a0b9d51;
    const TransferEditorship: Int = 0x1c04412a;
    const EditorshipAssigned: Int = 0x511a4463; 
}

trait ExitCodes {
    const IncorrectDeployer: Int = 405;
    const IncorrectIndex: Int = 402;
    const IncorrectAmount: Int = 399;
    const IncorrectIndexes: Int = 403;
    const IncorrectAmountWithDeploy: Int = 400;

    const IncorrectSender: Int = 401;
    const IncorrectBalanceAfrerSend: Int = 706;
    const InvalidDestinationWorkchain: Int = 333;
    const InvalidData: Int = 65535; // not handled
    const NotInit: Int = 9;
    const AlreadyInit: Int = 10;
    const InvalidFees: Int = 402;
}

trait GasConstants{ 
   const minTonsForStorage: Int = 50000000;
}