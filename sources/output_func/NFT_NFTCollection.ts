import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    queryId: bigint;
    newOwner: Address;
    responseDestination: Address | null;
    customPayload: Cell | null;
    forwardAmount: bigint;
    forwardPayload: Slice;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    let _responseDestination = sc_0.loadMaybeAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forwardAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0;
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    let _responseDestination = source.readAddressOpt();
    let _customPayload = source.readCellOpt();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    let _responseDestination = source.readAddressOpt();
    let _customPayload = source.readCellOpt();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    queryId: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function loadTupleGetStaticData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function loadGetterTupleGetStaticData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function storeTupleGetStaticData(source: GetStaticData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type NFTData = {
    $$type: 'NFTData';
    init: bigint;
    itemIndex: bigint;
    collectionAddress: Address;
    owner: Address | null;
    content: Cell | null;
}

export function storeNFTData(src: NFTData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.init, 257);
        b_0.storeUint(src.itemIndex, 64);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.owner);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadNFTData(slice: Slice) {
    const sc_0 = slice;
    const _init = sc_0.loadIntBig(257);
    const _index = sc_0.loadUintBig(64);
    const _collectionAddress = sc_0.loadAddress();
    const _owner = sc_0.loadMaybeAddress();
    const _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NFTData' as const, init: _init, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

function loadTupleNFTData(source: TupleReader) {
    const _init = source.readBigNumber();
    const _index = source.readBigNumber();
    const _collectionAddress = source.readAddress();
    const _owner = source.readAddressOpt();
    const _content = source.readCellOpt();
    return { $$type: 'NFTData' as const, init: _init, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

function loadGetterTupleNFTData(source: TupleReader) {
    const _init = source.readBigNumber();
    const _index = source.readBigNumber();
    const _collectionAddress = source.readAddress();
    const _owner = source.readAddressOpt();
    const _content = source.readCellOpt();
    return { $$type: 'NFTData' as const, init: _init, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

function storeTupleNFTData(source: NFTData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.init);
    builder.writeNumber(source.itemIndex);
    builder.writeAddress(source.collectionAddress);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserNFTData(): DictionaryValue<NFTData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNFTData(src)).endCell());
        },
        parse: (src) => {
            return loadNFTData(src.loadRef().beginParse());
        }
    }
}

export type InitNFTBody = {
    $$type: 'InitNFTBody';
    owner: Address;
    content: Cell;
}

export function storeInitNFTBody(src: InitNFTBody) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
    };
}

export function loadInitNFTBody(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _content = sc_0.loadRef();
    return { $$type: 'InitNFTBody' as const, owner: _owner, content: _content };
}

function loadTupleInitNFTBody(source: TupleReader) {
    const _owner = source.readAddress();
    const _content = source.readCell();
    return { $$type: 'InitNFTBody' as const, owner: _owner, content: _content };
}

function loadGetterTupleInitNFTBody(source: TupleReader) {
    const _owner = source.readAddress();
    const _content = source.readCell();
    return { $$type: 'InitNFTBody' as const, owner: _owner, content: _content };
}

function storeTupleInitNFTBody(source: InitNFTBody) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserInitNFTBody(): DictionaryValue<InitNFTBody> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInitNFTBody(src)).endCell());
        },
        parse: (src) => {
            return loadInitNFTBody(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    nextItemIndex: bigint;
    collectionContent: Cell;
    owner: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeRef(src.collectionContent);
        b_0.storeAddress(src.owner);
    };
}

export function loadCollectionData(slice: Slice) {
    const sc_0 = slice;
    const _nextItemIndex = sc_0.loadUintBig(64);
    const _collectionContent = sc_0.loadRef();
    const _owner = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, owner: _owner };
}

function loadTupleCollectionData(source: TupleReader) {
    const _nextItemIndex = source.readBigNumber();
    const _collectionContent = source.readCell();
    const _owner = source.readAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, owner: _owner };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    const _nextItemIndex = source.readBigNumber();
    const _collectionContent = source.readCell();
    const _owner = source.readAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, owner: _owner };
}

function storeTupleCollectionData(source: CollectionData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nextItemIndex);
    builder.writeCell(source.collectionContent);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type RoyaltyParams = {
    $$type: 'RoyaltyParams';
    nominator: bigint;
    dominator: bigint;
    owner: Address;
}

export function storeRoyaltyParams(src: RoyaltyParams) {
    return (builder: Builder) => {
        const b_0 = builder;

        let b_1 = beginCell();
        b_1.storeUint(src.nominator, 16);
        b_1.storeUint(src.dominator, 16);
        b_1.storeAddress(src.owner);

        b_0.storeRef(b_1.endCell());
    };
}

export function loadRoyaltyParams(slice: Slice) {
    const sc_0 = slice.loadRef().beginParse();
    const _nominator = sc_0.loadUintBig(16);
    const _dominator = sc_0.loadUintBig(16);
    const _owner = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams' as const, nominator: _nominator, dominator: _dominator, owner: _owner };
}

function loadTupleRoyaltyParams(source: TupleReader) {
    const _nominator = source.readBigNumber();
    const _dominator = source.readBigNumber();
    const _owner = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, nominator: _nominator, dominator: _dominator, owner: _owner };
}

function loadGetterTupleRoyaltyParams(source: TupleReader) {
    const _nominator = source.readBigNumber();
    const _dominator = source.readBigNumber();
    const _owner = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, nominator: _nominator, dominator: _dominator, owner: _owner };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nominator);
    builder.writeNumber(source.dominator);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type GetRoyaltyParams = {
    $$type: 'GetRoyaltyParams';
    queryId: bigint;
}

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadGetRoyaltyParams(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function loadGetterTupleGetRoyaltyParams(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadGetRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type DeployNFT = {
    $$type: 'DeployNFT';
    queryId: bigint;
    itemIndex: bigint;
    amount: bigint;
    initNFTBody: Cell;
}

export function storeDeployNFT(src: DeployNFT) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.itemIndex, 64);
        b_0.storeCoins(src.amount);
        b_0.storeRef(src.initNFTBody);
    };
}

export function loadDeployNFT(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _itemIndex = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _initNFTBody = sc_0.loadRef();
    return { $$type: 'DeployNFT' as const, queryId: _queryId, itemIndex: _itemIndex, amount: _amount, initNFTBody: _initNFTBody };
}

function loadTupleDeployNFT(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _itemIndex = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _initNFTBody = source.readCell();
    return { $$type: 'DeployNFT' as const, queryId: _queryId, itemIndex: _itemIndex, amount: _amount, initNFTBody: _initNFTBody };
}

function loadGetterTupleDeployNFT(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _itemIndex = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _initNFTBody = source.readCell();
    return { $$type: 'DeployNFT' as const, queryId: _queryId, itemIndex: _itemIndex, amount: _amount, initNFTBody: _initNFTBody };
}

function storeTupleDeployNFT(source: DeployNFT) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.itemIndex);
    builder.writeNumber(source.amount);
    builder.writeCell(source.initNFTBody);
    return builder.build();
}

function dictValueParserDeployNFT(): DictionaryValue<DeployNFT> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployNFT(src)).endCell());
        },
        parse: (src) => {
            return loadDeployNFT(src.loadRef().beginParse());
        }
    }
}

export type BatchDeploy = {
    $$type: 'BatchDeploy';
    queryId: bigint;
    deployList: Cell;
}

export function storeBatchDeploy(src: BatchDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeRef(src.deployList);
    };
}

export function loadBatchDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _deployList = sc_0.loadRef();
    return { $$type: 'BatchDeploy' as const, queryId: _queryId, deployList: _deployList };
}

function loadTupleBatchDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _deployList = source.readCell();
    return { $$type: 'BatchDeploy' as const, queryId: _queryId, deployList: _deployList };
}

function loadGetterTupleBatchDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _deployList = source.readCell();
    return { $$type: 'BatchDeploy' as const, queryId: _queryId, deployList: _deployList };
}

function storeTupleBatchDeploy(source: BatchDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeCell(source.deployList);
    return builder.build();
}

function dictValueParserBatchDeploy(): DictionaryValue<BatchDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBatchDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadBatchDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ReportRoyaltyParams = {
    $$type: 'ReportRoyaltyParams';
    queryId: bigint;
    params: RoyaltyParams;
}

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeRoyaltyParams(src.params));
    };
}

export function loadReportRoyaltyParams(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _params = loadRoyaltyParams(sc_0);
    return { $$type: 'ReportRoyaltyParams' as const, queryId: _queryId, params: _params };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _params = loadTupleRoyaltyParams(source);
    return { $$type: 'ReportRoyaltyParams' as const, queryId: _queryId, params: _params };
}

function loadGetterTupleReportRoyaltyParams(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _params = loadGetterTupleRoyaltyParams(source);
    return { $$type: 'ReportRoyaltyParams' as const, queryId: _queryId, params: _params };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleRoyaltyParams(source.params));
    return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type NFTItem$Data = {
    $$type: 'NFTItem$Data';
    itemIndex: bigint;
    collectionAddress: Address;
    owner: Address | null;
    content: Cell | null;
}

export function storeNFTItem$Data(src: NFTItem$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.itemIndex, 64);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.owner);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadNFTItem$Data(slice: Slice) {
    const sc_0 = slice;
    const _index = sc_0.loadUintBig(64);
    const _collectionAddress = sc_0.loadAddress();
    const _owner = sc_0.loadMaybeAddress();
    const _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NFTItem$Data' as const, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

function loadTupleNFTItem$Data(source: TupleReader) {
    const _index = source.readBigNumber();
    const _collectionAddress = source.readAddress();
    const _owner = source.readAddressOpt();
    const _content = source.readCellOpt();
    return { $$type: 'NFTItem$Data' as const, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

function loadGetterTupleNFTItem$Data(source: TupleReader) {
    const _index = source.readBigNumber();
    const _collectionAddress = source.readAddress();
    const _owner = source.readAddressOpt();
    const _content = source.readCellOpt();
    return { $$type: 'NFTItem$Data' as const, itemIndex: _index, collectionAddress: _collectionAddress, owner: _owner, content: _content };
}

function storeTupleNFTItem$Data(source: NFTItem$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.itemIndex);
    builder.writeAddress(source.collectionAddress);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserNFTItem$Data(): DictionaryValue<NFTItem$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNFTItem$Data(src)).endCell());
        },
        parse: (src) => {
            return loadNFTItem$Data(src.loadRef().beginParse());
        }
    }
}

export type DictDelete = {
    $$type: 'DictDelete';
    dict: Cell;
    item: Slice | null;
    itemIndex: bigint | null;
    flag: bigint;
}

export function storeDictDelete(src: DictDelete) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.dict);
        if (src.item !== null && src.item !== undefined) { b_0.storeBit(true).storeRef(src.item.asCell()); } else { b_0.storeBit(false); }
        if (src.itemIndex !== null && src.itemIndex !== undefined) { b_0.storeBit(true).storeUint(src.itemIndex, 64); } else { b_0.storeBit(false); }
        b_0.storeUint(src.flag, 256);
    };
}

export function loadDictDelete(slice: Slice) {
    const sc_0 = slice;
    const _dict = sc_0.loadRef();
    const _item = sc_0.loadBit() ? sc_0.loadRef()?.asSlice() ?? null : null;
    const _itemIndex = sc_0.loadBit() ? sc_0.loadUintBig(64) : null;
    const _flag = sc_0.loadUintBig(256);
    return { $$type: 'DictDelete' as const, dict: _dict, item: _item, itemIndex: _itemIndex, flag: _flag };
}

function loadTupleDictDelete(source: TupleReader) {
    const _dict = source.readCell();
    const _item = source.readCellOpt()?.asSlice() ?? null;
    const _itemIndex = source.readBigNumberOpt();
    const _flag = source.readBigNumber();
    return { $$type: 'DictDelete' as const, dict: _dict, item: _item, itemIndex: _itemIndex, flag: _flag };
}

function loadGetterTupleDictDelete(source: TupleReader) {
    const _dict = source.readCell();
    const _item = source.readCellOpt()?.asSlice() ?? null;
    const _itemIndex = source.readBigNumberOpt();
    const _flag = source.readBigNumber();
    return { $$type: 'DictDelete' as const, dict: _dict, item: _item, itemIndex: _itemIndex, flag: _flag };
}

function storeTupleDictDelete(source: DictDelete) {
    const builder = new TupleBuilder();
    builder.writeCell(source.dict);
    builder.writeSlice(source.item?.asCell());
    builder.writeNumber(source.itemIndex);
    builder.writeNumber(source.flag);
    return builder.build();
}

function dictValueParserDictDelete(): DictionaryValue<DictDelete> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDictDelete(src)).endCell());
        },
        parse: (src) => {
            return loadDictDelete(src.loadRef().beginParse());
        }
    }
}

export type NFTCollection$Data = {
    $$type: 'NFTCollection$Data';
    owner: Address;
    nextItemIndex: bigint;
    content: Cell;
    nftItemCode: Cell;
    royaltyParams: RoyaltyParams;
}

export function storeNFTCollection$Data(src: NFTCollection$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeRef(src.content);
        b_0.storeRef(src.nftItemCode);
        b_0.store(storeRoyaltyParams(src.royaltyParams));
    };
}

export function loadNFTCollection$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _nextItemIndex = sc_0.loadUintBig(64);
    const _content = sc_0.loadRef();
    const _nftItemCode = sc_0.loadRef();
    const _royaltyParams = loadRoyaltyParams(sc_0);
    return { $$type: 'NFTCollection$Data' as const, owner: _owner, nextItemIndex: _nextItemIndex, content: _content, nftItemCode: _nftItemCode, royaltyParams: _royaltyParams };
}

function loadTupleNFTCollection$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _nextItemIndex = source.readBigNumber();
    const _content = source.readCell();
    const _nftItemCode = source.readCell();
    const _royaltyParams = loadTupleRoyaltyParams(source);
    return { $$type: 'NFTCollection$Data' as const, owner: _owner, nextItemIndex: _nextItemIndex, content: _content, nftItemCode: _nftItemCode, royaltyParams: _royaltyParams };
}

function loadGetterTupleNFTCollection$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _nextItemIndex = source.readBigNumber();
    const _content = source.readCell();
    const _nftItemCode = source.readCell();
    const _royaltyParams = loadGetterTupleRoyaltyParams(source);
    return { $$type: 'NFTCollection$Data' as const, owner: _owner, nextItemIndex: _nextItemIndex, content: _content, nftItemCode: _nftItemCode, royaltyParams: _royaltyParams };
}

function storeTupleNFTCollection$Data(source: NFTCollection$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.nextItemIndex);
    builder.writeCell(source.content);
    builder.writeCell(source.nftItemCode);
    builder.writeTuple(storeTupleRoyaltyParams(source.royaltyParams));
    return builder.build();
}

function dictValueParserNFTCollection$Data(): DictionaryValue<NFTCollection$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNFTCollection$Data(src)).endCell());
        },
        parse: (src) => {
            return loadNFTCollection$Data(src.loadRef().beginParse());
        }
    }
}

 type NFTCollection_init_args = {
    $$type: 'NFTCollection_init_args';
    owner: Address;
    nextItemIndex: bigint;
    collectionContent: Cell;
    nftItemCode: Cell;
    royaltyParams: RoyaltyParams;
}

function initNFTCollection_init_args(src: NFTCollection_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.nextItemIndex, 64);
        b_0.storeRef(src.collectionContent);
        b_0.storeRef(src.nftItemCode);
        b_0.store(storeRoyaltyParams(src.royaltyParams));
    };
}

async function NFTCollection_init(owner: Address, nextItemIndex: bigint, collectionContent: Cell, royaltyParams: RoyaltyParams) {
    const __code = Cell.fromBase64('te6cckECEwEAAf4AART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgPr0QY4BIrfAA6GmBgLjYSK3wfSAYAOmP6Z/2omh9IGmf6mpqGEEINJ6cqClAXUcUG6+CgOhBCFRlgFa4QAhkZYKoAueLEn0BCmW1CeWP5Z+A54tkwCB9gHAbKLnjgvlwyJLgAPGBEuABcYEZAmAB8YEvgsIH+XhAYHCAIBIAkKAGA1AtM/UxO78uGSUxO6AfoA1DAoEDRZ8AaOEgGkQ0PIUAXPFhPLP8zMzMntVJJfBeIApjVwA9QwjjeAQPSWb6UgjikGpCCBAPq+k/LBj96BAZMhoFMlu/L0AvoA1DAiVEsw8AYjupMCpALeBJJsIeKz5jAyUERDE8hQBc8WE8s/zMzMye1UACgB+kAwQUTIUAXPFhPLP8zMzMntVAIBIAsMAD1FrwBHAh8AV3gBjIywVYzxZQBPoCE8trEszMyXH7AIAC0AcjLP/gozxbJcCDIywET9AD0AMsAyYAAbPkAdMjLAhLKB8v/ydCACASAPEAAlvILfaiaH0gaZ/qamoYLehqGCxABDuLXTHtRND6QNM/1NTUMBAkXwTQ1DHUMNBxyMsHAc8WzMmAIBIBESAC+12v2omh9IGmf6mpqGDYg6GmH6Yf9IBhAALbT0faiaH0gaZ/qamoYCi+CeAI4APgCwWurO9Q==');
    const builder = beginCell();
    let nftItemCode = Cell.fromBase64('te6cckECDgEAAdwAART/APSkE/S88sgLAQIBYgIDAgLOBAUACaEfn+AFAgEgBgcCASAMDQLPDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAwc6m0APACBLOOFDBsIjRSMscF8uGVAfpA1DAQI/AD4AbTH9M/ghBfzD0UUjC64wIwNDQ1NYIQL8smohK64wJfBIQP8vCAICQARPpEMHC68uFNgAqwyEDdeMkATUTXHBfLhkfpAIfAB+kDSADH6ACDXScIA8uLEggr68IAboSGUUxWgod4i1wsBwwAgkgahkTbiIML/8uGSIZQQKjdb4w0CkzAyNOMNVQLwAwoLAHJwghCLdxc1BcjL/1AEzxYQJIBAcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wAAfIIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHAGom8AGCENUydtsQN0QAbXFwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAB0A8jLP1jPFgHPFszJ7VSAhpPNg')
    initNFTCollection_init_args({ $$type: 'NFTCollection_init_args', owner, nextItemIndex, collectionContent, nftItemCode, royaltyParams })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const NFTCollection_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough Toncoin` },
    38: { message: `Not enough extra currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
}

const NFTCollection_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":true}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"NFTData","header":null,"fields":[{"name":"init","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"itemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collectionAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"InitNFTBody","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"nextItemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collectionContent","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoyaltyParams","header":null,"fields":[{"name":"nominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"dominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetRoyaltyParams","header":1765620048,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployNFT","header":1,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"itemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"initNFTBody","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"BatchDeploy","header":2,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"deployList","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ChangeOwner","header":3,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ReportRoyaltyParams","header":2831876269,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"params","type":{"kind":"simple","type":"RoyaltyParams","optional":false}}]},
    {"name":"NFTItem$Data","header":null,"fields":[{"name":"itemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collectionAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"DictDelete","header":null,"fields":[{"name":"dict","type":{"kind":"simple","type":"cell","optional":false}},{"name":"itemIndex","type":{"kind":"simple","type":"uint","optional":true,"format":64}},{"name":"item","type":{"kind":"simple","type":"slice","optional":true}},{"name":"flag","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"NFTCollection$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"nextItemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"royaltyParams","type":{"kind":"simple","type":"RoyaltyParams","optional":false}}]},
]

const NFTCollection_getters: ABIGetter[] = [
    {"name":"get_collection_data","methodId":102491,"arguments":[],"returnType":{"kind":"simple","type":"CollectionData","optional":false}},
    {"name":"get_nft_address_by_index","methodId":92067,"arguments":[{"name":"itemIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"royalty_params","methodId":85719,"arguments":[],"returnType":{"kind":"simple","type":"RoyaltyParams","optional":false}},
    {"name":"get_nft_content","methodId":68445,"arguments":[{"name":"itemIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"individualNFTContent","type":{"kind":"simple","type":"cell","optional":false}}],"returnType":{"kind":"simple","type":"cell","optional":false}},
]

export const NFTCollection_getterMapping: { [key: string]: string } = {
    'get_collection_data': 'getGetCollectionData',
    'get_nft_address_by_index': 'getGetNftAddressByIndex',
    'royalty_params': 'getRoyaltyParams',
    'get_nft_content': 'getGetNftContent',
}

const NFTCollection_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetRoyaltyParams"}},
    {"receiver":"internal","message":{"kind":"typed","type":"DeployNFT"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BatchDeploy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ChangeOwner"}},
]

export class NFTCollection implements Contract {
    
    static async init(owner: Address, collectionContent: Cell, royaltyParams: RoyaltyParams, nextItemIndex: bigint = 0n) {
        return await NFTCollection_init(owner, nextItemIndex, collectionContent, royaltyParams);
    }
    
    static async fromInit(owner: Address, nextItemIndex: bigint = 0n, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        const __gen_init = await NFTCollection_init(owner, nextItemIndex, collectionContent, royaltyParams);
        const address = contractAddress(0, __gen_init);
        return new NFTCollection(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new NFTCollection(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  NFTCollection_types,
        getters: NFTCollection_getters,
        receivers: NFTCollection_receivers,
        errors: NFTCollection_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | GetRoyaltyParams | DeployNFT | BatchDeploy | ChangeOwner) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetRoyaltyParams') {
            body = beginCell().store(storeGetRoyaltyParams(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DeployNFT') {
            body = beginCell().store(storeDeployNFT(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BatchDeploy') {
            body = beginCell().store(storeBatchDeploy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ChangeOwner') {
            body = beginCell().store(storeChangeOwner(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetCollectionData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get(102491 as any, builder.build())).stack;
        const result = loadGetterTupleCollectionData(source);
        return result;
    }
    
    async getGetNftAddressByIndex(provider: ContractProvider, itemIndex: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(itemIndex);
        const source = (await provider.get(92067 as any, builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getRoyaltyParams(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get(85719 as any, builder.build())).stack;
        const result = loadGetterTupleRoyaltyParams(source);
        return result;
    }
    
    async getGetNftContent(provider: ContractProvider, itemIndex: bigint, individualNFTContent: Cell) {
        const builder = new TupleBuilder();
        builder.writeNumber(itemIndex);
        builder.writeCell(individualNFTContent);
        const source = (await provider.get(68445 as any, builder.build())).stack;
        const result = source.readCell();
        return result;
    }
    
}