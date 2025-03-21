import { Address, Cell, ContractProvider, Sender } from '@ton/core';

declare module '../output/NFT_NFTCollection' {
    interface NFTCollection {
        getNextItemIndex(provider: ContractProvider): Promise<bigint>;
        getOwner(provider: ContractProvider): Promise<Address>;
    }
}