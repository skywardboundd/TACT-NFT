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
        b_0.storeUint(src.nominator, 16);
        b_0.storeUint(src.dominator, 16);
        b_0.storeAddress(src.owner);
    };
}

export function loadRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
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

 type NFTItem_init_args = {
    $$type: 'NFTItem_init_args';
    index: bigint;
    collectionAddress: Address;
}

function initNFTItem_init_args(src: NFTItem_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collectionAddress);
    };
}

async function NFTItem_init(index: bigint, collectionAddress: Address) {
    const __code = Cell.fromBase64('te6cckECDgEAAdwAART/APSkE/S88sgLAQIBYgIDAgLOBAUACaEfn+AFAgEgBgcCASAMDQLPDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAwc6m0APACBLOOFDBsIjRSMscF8uGVAfpA1DAQI/AD4AbTH9M/ghBfzD0UUjC64wIwNDQ1NYIQL8smohK64wJfBIQP8vCAICQARPpEMHC68uFNgAqwyEDdeMkATUTXHBfLhkfpAIfAB+kDSADH6ACDXScIA8uLEggr68IAboSGUUxWgod4i1wsBwwAgkgahkTbiIML/8uGSIZQQKjdb4w0CkzAyNOMNVQLwAwoLAHJwghCLdxc1BcjL/1AEzxYQJIBAcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wAAfIIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHAGom8AGCENUydtsQN0QAbXFwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAB0A8jLP1jPFgHPFszJ7VSAhpPNg');
    const __system = Cell.fromBase64('te6cckECFgEABBAAAQHAAQEFoIitAgEU/wD0pBP0vPLICwMCAWIEDwN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRPbPPLgghEFDgLIAZIwf+BwIddJwh+VMCDXCx/eIMAAItdJwSGwklt/4CCCEF/MPRS64wKCEC/LJqK64wIxAW7y4IL6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdQw+EJSMMcF8uGVfwYMAbgw0x8BghBfzD0UuvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfoAUUQUQzBsFds8fwcEpCZus/LhlfhCUnAhbpJbcJLHBeLy4ZH4QW8k2zwQOUh2JNs8+CdvEIIK+vCAoSnCAJRTl6Ch3irXCwHDACCSCKGROOIgwv/y4ZIpwgCSODjjDQUICwkKAGRsMfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4Igw+gAxcdch+gAx+gAwpwOrAAGMghAFE42RyCQgbvLQgCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAKzxYQVhBFEDQQI3FTOBBNEDxQwts8BwZVIA0CVI8hQDZUFAfbPIIQ1TJ228gQWBBHEDYQJRBJEDlBkHHbPDFakzdsMuJDEwsNABD6RDDAAPLhTQGa0x8BghAvyyaiuvLggdM/ATEibrPy4ZX4QnCCEIt3FzXIUoDL/ycg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYQNEEwgEDbPH8NAJjIgBABywVQBiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAE+gJwActqEssfyz8hzzHDAJF/lSHPMsMA4pMBzxeRMeLJAfsAANTI+EMBzH8BygBVMFA0y/8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiIW6zlX8BygDMlHAyygDiye1UAgFYEBUCEbj8/bPNs8bEWBEUAertRNDUAfhj0gABjl3T//pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBINcLAcMAjh/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIlHLXIW3iAdIAAZHUkm0B4lUwbBTg+CjXCwqDCbry4IkSAVSBAQHXAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgSAtEB2zwTAARtbQAYIW6zkXGRcOJUdDIkABG4K+7UTQ0gABh1n77K');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNFTItem_init_args({ $$type: 'NFTItem_init_args', index, collectionAddress })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const NFTItem_errors: { [key: number]: { message: string } } = {
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

const NFTItem_types: ABIType[] = [
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
]

const NFTItem_getters: ABIGetter[] = [
    {"name":"get_nft_data","arguments":[],"returnType":{"kind":"simple","type":"NFTData","optional":false}},
]

export const NFTItem_getterMapping: { [key: string]: string } = {
    'get_nft_data': 'getGetNftData',
}

const NFTItem_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"any"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Transfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetStaticData"}},
]

export class NFTItem implements Contract {
    
    static async init(index: bigint, collectionAddress: Address) {
        return await NFTItem_init(index, collectionAddress);
    }
    
    static async fromInit(index: bigint, collectionAddress: Address) {
        const init = await NFTItem_init(index, collectionAddress);
        const address = contractAddress(0, init);
        return new NFTItem(address, init);
    }
    
    static fromAddress(address: Address) {
        return new NFTItem(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  NFTItem_types,
        getters: NFTItem_getters,
        receivers: NFTItem_receivers,
        errors: NFTItem_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | Slice | Transfer | GetStaticData) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && message instanceof Slice) {
            body = message.asCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Transfer') {
            body = beginCell().store(storeTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetStaticData') {
            body = beginCell().store(storeGetStaticData(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetNftData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_nft_data', builder.build())).stack;
        const result = loadGetterTupleNFTData(source);
        return result;
    }
    
}