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

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    queryId: bigint;
    newOwner: Address;
    responseDestination: Address;
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
        b_0.storeCoins(src.forwardAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    let _forwardAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0;
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    builder.writeAddress(source.responseDestination);
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
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function loadTupleGetStaticData(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function loadGetterTupleGetStaticData(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function storeTupleGetStaticData(source: GetStaticData) {
    let builder = new TupleBuilder();
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
    index: bigint;
    collectionAddress: Address;
    ownerAddress: Address | null;
    content: Cell | null;
}

export function storeNFTData(src: NFTData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.init, 257);
        b_0.storeUint(src.index, 64);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.ownerAddress);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadNFTData(slice: Slice) {
    let sc_0 = slice;
    let _init = sc_0.loadIntBig(257);
    let _index = sc_0.loadUintBig(64);
    let _collectionAddress = sc_0.loadAddress();
    let _ownerAddress = sc_0.loadMaybeAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NFTData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

function loadTupleNFTData(source: TupleReader) {
    let _init = source.readBigNumber();
    let _index = source.readBigNumber();
    let _collectionAddress = source.readAddress();
    let _ownerAddress = source.readAddressOpt();
    let _content = source.readCellOpt();
    return { $$type: 'NFTData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

function loadGetterTupleNFTData(source: TupleReader) {
    let _init = source.readBigNumber();
    let _index = source.readBigNumber();
    let _collectionAddress = source.readAddress();
    let _ownerAddress = source.readAddressOpt();
    let _content = source.readCellOpt();
    return { $$type: 'NFTData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

function storeTupleNFTData(source: NFTData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.init);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collectionAddress);
    builder.writeAddress(source.ownerAddress);
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

export type NFTInitData = {
    $$type: 'NFTInitData';
    ownerAddress: Address;
    content: Cell;
}

export function storeNFTInitData(src: NFTInitData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.ownerAddress);
        b_0.storeRef(src.content);
    };
}

export function loadNFTInitData(slice: Slice) {
    let sc_0 = slice;
    let _ownerAddress = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    return { $$type: 'NFTInitData' as const, ownerAddress: _ownerAddress, content: _content };
}

function loadTupleNFTInitData(source: TupleReader) {
    let _ownerAddress = source.readAddress();
    let _content = source.readCell();
    return { $$type: 'NFTInitData' as const, ownerAddress: _ownerAddress, content: _content };
}

function loadGetterTupleNFTInitData(source: TupleReader) {
    let _ownerAddress = source.readAddress();
    let _content = source.readCell();
    return { $$type: 'NFTInitData' as const, ownerAddress: _ownerAddress, content: _content };
}

function storeTupleNFTInitData(source: NFTInitData) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.ownerAddress);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserNFTInitData(): DictionaryValue<NFTInitData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNFTInitData(src)).endCell());
        },
        parse: (src) => {
            return loadNFTInitData(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    nextItemIndex: bigint;
    collectionContent: Cell;
    ownerAddress: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeRef(src.collectionContent);
        b_0.storeAddress(src.ownerAddress);
    };
}

export function loadCollectionData(slice: Slice) {
    let sc_0 = slice;
    let _nextItemIndex = sc_0.loadUintBig(64);
    let _collectionContent = sc_0.loadRef();
    let _ownerAddress = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, ownerAddress: _ownerAddress };
}

function loadTupleCollectionData(source: TupleReader) {
    let _nextItemIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    let _ownerAddress = source.readAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, ownerAddress: _ownerAddress };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    let _nextItemIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    let _ownerAddress = source.readAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, ownerAddress: _ownerAddress };
}

function storeTupleCollectionData(source: CollectionData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.nextItemIndex);
    builder.writeCell(source.collectionContent);
    builder.writeAddress(source.ownerAddress);
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
        let b_0 = builder;
        let b_1 = builder;
        b_1.storeUint(src.nominator, 16);
        b_1.storeUint(src.dominator, 16);
        b_1.storeAddress(src.owner);
        b_0.storeRef(b_1);
    };
}

export function loadRoyaltyParams(slice: Slice) {
    let sc_0 = slice.loadRef().beginParse();
    let _nominator = sc_0.loadUintBig(16);
    let _dominator = sc_0.loadUintBig(16);
    let _owner = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams' as const, nominator: _nominator, dominator: _dominator, owner: _owner };
}

function loadTupleRoyaltyParams(source: TupleReader) {
    let _nominator = source.readBigNumber();
    let _dominator = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, nominator: _nominator, dominator: _dominator, owner: _owner };
}

function loadGetterTupleRoyaltyParams(source: TupleReader) {
    let _nominator = source.readBigNumber();
    let _dominator = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, nominator: _nominator, dominator: _dominator, owner: _owner };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
    let builder = new TupleBuilder();
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
        let b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadGetRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function loadGetterTupleGetRoyaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
    let builder = new TupleBuilder();
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
        let b_0 = builder;
        b_0.storeUint(1, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.itemIndex, 64);
        b_0.storeCoins(src.amount);
        b_0.storeRef(src.initNFTBody);
    };
}

export function loadDeployNFT(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _itemIndex = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _initNFTBody = sc_0.loadRef();
    return { $$type: 'DeployNFT' as const, queryId: _queryId, itemIndex: _itemIndex, amount: _amount, initNFTBody: _initNFTBody };
}

function loadTupleDeployNFT(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _itemIndex = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _initNFTBody = source.readCell();
    return { $$type: 'DeployNFT' as const, queryId: _queryId, itemIndex: _itemIndex, amount: _amount, initNFTBody: _initNFTBody };
}

function loadGetterTupleDeployNFT(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _itemIndex = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _initNFTBody = source.readCell();
    return { $$type: 'DeployNFT' as const, queryId: _queryId, itemIndex: _itemIndex, amount: _amount, initNFTBody: _initNFTBody };
}

function storeTupleDeployNFT(source: DeployNFT) {
    let builder = new TupleBuilder();
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
        let b_0 = builder;
        b_0.storeUint(2, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeRef(src.deployList);
    };
}

export function loadBatchDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _deployList = sc_0.loadRef();
    return { $$type: 'BatchDeploy' as const, queryId: _queryId, deployList: _deployList };
}

function loadTupleBatchDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _deployList = source.readCell();
    return { $$type: 'BatchDeploy' as const, queryId: _queryId, deployList: _deployList };
}

function loadGetterTupleBatchDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _deployList = source.readCell();
    return { $$type: 'BatchDeploy' as const, queryId: _queryId, deployList: _deployList };
}

function storeTupleBatchDeploy(source: BatchDeploy) {
    let builder = new TupleBuilder();
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
        let b_0 = builder;
        b_0.storeUint(3, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
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

export type ReportRoaltyParams = {
    $$type: 'ReportRoaltyParams';
    queryId: bigint;
    params: RoyaltyParams;
}

export function storeReportRoaltyParams(src: ReportRoaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeRoyaltyParams(src.params));
    };
}

export function loadReportRoaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _params = loadRoyaltyParams(sc_0);
    return { $$type: 'ReportRoaltyParams' as const, queryId: _queryId, params: _params };
}

function loadTupleReportRoaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _params = loadTupleRoyaltyParams(source);
    return { $$type: 'ReportRoaltyParams' as const, queryId: _queryId, params: _params };
}

function loadGetterTupleReportRoaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _params = loadGetterTupleRoyaltyParams(source);
    return { $$type: 'ReportRoaltyParams' as const, queryId: _queryId, params: _params };
}

function storeTupleReportRoaltyParams(source: ReportRoaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleRoyaltyParams(source.params));
    return builder.build();
}

function dictValueParserReportRoaltyParams(): DictionaryValue<ReportRoaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportRoaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoaltyParams(src.loadRef().beginParse());
        }
    }
}

export type NFTItem$Data = {
    $$type: 'NFTItem$Data';
    index: bigint;
    collectionAddress: Address;
    ownerAddress: Address | null;
    content: Cell | null;
}

export function storeNFTItem$Data(src: NFTItem$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.index, 256);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.ownerAddress);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadNFTItem$Data(slice: Slice) {
    let sc_0 = slice;
    let _index = sc_0.loadUintBig(256);
    let _collectionAddress = sc_0.loadAddress();
    let _ownerAddress = sc_0.loadMaybeAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NFTItem$Data' as const, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

function loadTupleNFTItem$Data(source: TupleReader) {
    let _index = source.readBigNumber();
    let _collectionAddress = source.readAddress();
    let _ownerAddress = source.readAddressOpt();
    let _content = source.readCellOpt();
    return { $$type: 'NFTItem$Data' as const, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

function loadGetterTupleNFTItem$Data(source: TupleReader) {
    let _index = source.readBigNumber();
    let _collectionAddress = source.readAddress();
    let _ownerAddress = source.readAddressOpt();
    let _content = source.readCellOpt();
    return { $$type: 'NFTItem$Data' as const, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, content: _content };
}

function storeTupleNFTItem$Data(source: NFTItem$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index);
    builder.writeAddress(source.collectionAddress);
    builder.writeAddress(source.ownerAddress);
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
        let b_0 = builder;
        b_0.storeRef(src.dict);
        if (src.item !== null && src.item !== undefined) { b_0.storeBit(true).storeRef(src.item.asCell()); } else { b_0.storeBit(false); }
        if (src.itemIndex !== null && src.itemIndex !== undefined) { b_0.storeBit(true).storeUint(src.itemIndex, 64); } else { b_0.storeBit(false); }
        b_0.storeUint(src.flag, 256);
    };
}

export function loadDictDelete(slice: Slice) {
    let sc_0 = slice;
    let _dict = sc_0.loadRef();
    let _item = sc_0.loadBit() ? sc_0.loadRef()?.asSlice() ?? null : null;
    let _itemIndex = sc_0.loadBit() ? sc_0.loadUintBig(64) : null;
    let _flag = sc_0.loadUintBig(256);
    return { $$type: 'DictDelete' as const, dict: _dict, item: _item, itemIndex: _itemIndex, flag: _flag };
}

function loadTupleDictDelete(source: TupleReader) {
    let _dict = source.readCell();
    let _item = source.readCellOpt()?.asSlice() ?? null;
    let _itemIndex = source.readBigNumberOpt();
    let _flag = source.readBigNumber();
    return { $$type: 'DictDelete' as const, dict: _dict, item: _item, itemIndex: _itemIndex, flag: _flag };
}

function loadGetterTupleDictDelete(source: TupleReader) {
    let _dict = source.readCell();
    let _item = source.readCellOpt()?.asSlice() ?? null;
    let _itemIndex = source.readBigNumberOpt();
    let _flag = source.readBigNumber();
    return { $$type: 'DictDelete' as const, dict: _dict, item: _item, itemIndex: _itemIndex, flag: _flag };
}

function storeTupleDictDelete(source: DictDelete) {
    let builder = new TupleBuilder();
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
    royaltyParams: RoyaltyParams;
}

export function storeNFTCollection$Data(src: NFTCollection$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeRef(src.content);
        b_0.store(storeRoyaltyParams(src.royaltyParams));
    };
}

export function loadNFTCollection$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _nextItemIndex = sc_0.loadUintBig(64);
    let _content = sc_0.loadRef();
    let _royaltyParams = loadRoyaltyParams(sc_0);
    return { $$type: 'NFTCollection$Data' as const, owner: _owner, nextItemIndex: _nextItemIndex, content: _content, royaltyParams: _royaltyParams };
}

function loadTupleNFTCollection$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _nextItemIndex = source.readBigNumber();
    let _content = source.readCell();
    const _royaltyParams = loadTupleRoyaltyParams(source);
    return { $$type: 'NFTCollection$Data' as const, owner: _owner, nextItemIndex: _nextItemIndex, content: _content, royaltyParams: _royaltyParams };
}

function loadGetterTupleNFTCollection$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _nextItemIndex = source.readBigNumber();
    let _content = source.readCell();
    const _royaltyParams = loadGetterTupleRoyaltyParams(source);
    return { $$type: 'NFTCollection$Data' as const, owner: _owner, nextItemIndex: _nextItemIndex, content: _content, royaltyParams: _royaltyParams };
}

function storeTupleNFTCollection$Data(source: NFTCollection$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.nextItemIndex);
    builder.writeCell(source.content);
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
    collectionContent: Cell;
    royaltyParams: RoyaltyParams;
}

function initNFTCollection_init_args(src: NFTCollection_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.collectionContent);
        b_0.store(storeRoyaltyParams(src.royaltyParams));
    };
}

async function NFTCollection_init(owner: Address, collectionContent: Cell, royaltyParams: RoyaltyParams) {
    const __code = Cell.fromBase64('te6cckECEwEAAf4AART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgPr0QY4BIrfAA6GmBgLjYSK3wfSAYAOmP6Z/2omh9IGmf6mpqGEEINJ6cqClAXUcUG6+CgOhBCFRlgFa4QAhkZYKoAueLEn0BCmW1CeWP5Z+A54tkwCB9gHAbKLnjgvlwyJLgAPGBEuABcYEZAmAB8YEvgsIH+XhAYHCAIBIAkKAGA1AtM/UxO78uGSUxO6AfoA1DAoEDRZ8AaOEgGkQ0PIUAXPFhPLP8zMzMntVJJfBeIApjVwA9QwjjeAQPSWb6UgjikGpCCBAPq+k/LBj96BAZMhoFMlu/L0AvoA1DAiVEsw8AYjupMCpALeBJJsIeKz5jAyUERDE8hQBc8WE8s/zMzMye1UACgB+kAwQUTIUAXPFhPLP8zMzMntVAIBIAsMAD1FrwBHAh8AV3gBjIywVYzxZQBPoCE8trEszMyXH7AIAC0AcjLP/gozxbJcCDIywET9AD0AMsAyYAAbPkAdMjLAhLKB8v/ydCACASAPEAAlvILfaiaH0gaZ/qamoYLehqGCxABDuLXTHtRND6QNM/1NTUMBAkXwTQ1DHUMNBxyMsHAc8WzMmAIBIBESAC+12v2omh9IGmf6mpqGDYg6GmH6Yf9IBhAALbT0faiaH0gaZ/qamoYCi+CeAI4APgCwWurO9Q==');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNFTCollection_init_args({ $$type: 'NFTCollection_init_args', owner, collectionContent, royaltyParams })(builder);
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
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
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
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
}

const NFTCollection_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"NFTData","header":null,"fields":[{"name":"init","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collectionAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"NFTInitData","header":null,"fields":[{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"nextItemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collectionContent","type":{"kind":"simple","type":"cell","optional":false}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoyaltyParams","header":null,"fields":[{"name":"nominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"dominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetRoyaltyParams","header":1765620048,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployNFT","header":1,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"itemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"initNFTBody","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"BatchDeploy","header":2,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"deployList","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ChangeOwner","header":3,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ReportRoaltyParams","header":2831876269,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"params","type":{"kind":"simple","type":"RoyaltyParams","optional":false}}]},
    {"name":"NFTItem$Data","header":null,"fields":[{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"collectionAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"DictDelete","header":null,"fields":[{"name":"dict","type":{"kind":"simple","type":"cell","optional":false}},{"name":"item","type":{"kind":"simple","type":"slice","optional":true}},{"name":"itemIndex","type":{"kind":"simple","type":"uint","optional":true,"format":64}},{"name":"flag","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"NFTCollection$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"nextItemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"royaltyParams","type":{"kind":"simple","type":"RoyaltyParams","optional":false}}]},
]

const NFTCollection_getters: ABIGetter[] = [
    {"name":"get_collection_data","arguments":[],"returnType":{"kind":"simple","type":"CollectionData","optional":false}},
    {"name":"get_nft_address_by_index","arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"royalty_params","arguments":[],"returnType":{"kind":"simple","type":"RoyaltyParams","optional":false}},
    {"name":"get_nft_content","arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"individualNFTContent","type":{"kind":"simple","type":"cell","optional":false}}],"returnType":{"kind":"simple","type":"cell","optional":false}},
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
    
    static async init(owner: Address, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        return await NFTCollection_init(owner, collectionContent, royaltyParams);
    }
    
    static async fromInit(owner: Address, collectionContent: Cell, royaltyParams: RoyaltyParams) {
        const init = await NFTCollection_init(owner, collectionContent, royaltyParams);
        const address = contractAddress(0, init);
        return new NFTCollection(address, init);
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
        let builder = new TupleBuilder();
        let source = (await provider.get('get_collection_data', builder.build())).stack;
        const result = loadGetterTupleCollectionData(source);
        return result;
    }
    
    async getGetNftAddressByIndex(provider: ContractProvider, index: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(index);
        let source = (await provider.get('get_nft_address_by_index', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getRoyaltyParams(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('royalty_params', builder.build())).stack;
        const result = loadGetterTupleRoyaltyParams(source);
        return result;
    }
    
    async getGetNftContent(provider: ContractProvider, index: bigint, individualNFTContent: Cell) {
        let builder = new TupleBuilder();
        builder.writeNumber(index);
        builder.writeCell(individualNFTContent);
        let source = (await provider.get('get_nft_content', builder.build())).stack;
        let result = source.readCell();
        return result;
    }
    
}