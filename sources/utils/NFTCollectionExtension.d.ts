import { Address, Cell, ContractProvider, Sender } from '@ton/core';

import * as OriginalModule from '../output/NFT_NFTCollection';

// Явно экспортируем нужную функцию
export const loadGetterTupleNFTData = OriginalModule['loadGetterTupleNFTData'];

declare module '../output/NFT_NFTCollection' {
    interface NFTCollection {
        getNextItemIndex(provider: ContractProvider): Promise<bigint>;
        getOwner(provider: ContractProvider): Promise<Address>;
    }
}