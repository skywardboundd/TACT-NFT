import { Address, Cell, ContractProvider, Sender } from '@ton/core';

declare module '../output/NFT_NFTItem' {
    interface NFTItem {
        getOwner(provider: ContractProvider): Promise<Address | null>;
    }
}