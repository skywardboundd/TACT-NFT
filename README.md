# Tact NFT project

This project is a port of the contracts from Func NFT TEP-62 & supporting TEP-66.
contract works *identically* to the reference FunC implementation in https://github.com/ton-blockchain/token-contract/tree/main/nft.

## How to use

First, let's install all the dependencies:

```shell
yarn install
```

Now we're ready to build our contract:

```shell
yarn build
```

Once you've built our contract, you can deploy it:

```shell
yarn deploy
```
Let's look at some other useful commands.

To test TACT contracts run:

```shell
yarn test
```

To test func contracts change output folder in contract.spec.ts imports,to output_func and then 
```shell
yarn test 
``` 


If you want to quickly check your changes for validity, run:

```shell
yarn lint
```

## Idea of this standard 
### Deploy 1 NFT
It makes sense to make sure we send at least a minimum of a tone to storage, and to return the remaining tons after such messages so we don't have to guess. Also, it makes sense to notify the new owner after the nft is deposited, as in the case of a transfer.

And it will be much cleaner when we have message to deploy

### Batch deploy 
1) It doesn't make sense to mint old nfts, just messages will come as they have already been initialized, so it only makes sense to mint immediately nextItemIndex and take exactly the next item via get, not delete, because if the next index will be > nextItemIndex, we will get throw immediately. 

That's why we can use map in tact, not dict-like cells with asm function ( and auto-code for building this dictionary)

2) Return remaining tons to owner

## Deployment

To deploy a NFT collection follow some instructions in [`contract.deploy.ts`](./sources/contract.deploy.ts) and define in `.env` values:
- `MNEMONICS` 
if nft collection have Off-chain data : 
- `COLLECTION_LINK` ( collection metadata )
- `COMMON_LINK` 

then 
```shell 
yarn deploy
```

To deploy NFT Item follow some instructions in [`contract.deploy_nft.ts`](./sources/contract.deploy_nft.ts) and define in `.env`
- `COLLECTION_ADDRESS`
- `NEXT_ITEM_INDEX`

then 
```shell 
yarn deploynft
```

## Testing

MORE COMMENTS FOR TESTS IN `main` BRANCH

Test TACT contracts with /ouput/ folder, test func contracts with /output_func/ contracts in 
1) [`contract.spec.ts`](./sources/contract.spec.ts) 
2) [`NFTCollectionExtension.d.ts`](./sources/utils/NFTCollectionExtension.d.ts) 
3) [`NFTItemExtension.d.ts`](./sources/utils/NFTItemExtension.d.ts) 

P.S. or just replace `output/NFT` with `output_func/NFT` in all files except README

And then 

```shell 
yarn test
```

## Opportuinies if we do not need identically interfaces 
1) Use ^Struct in future versions of tact
2) Use opcode with deploying NFT 
3) If we can check some conditionals after loadData(), in our case it is in NFTItem owner != null
4) Using TupleBool 
5) Either type in TACT
6) With another way to use addr_none$00 in tact we can delete ? in responceDestination var  
7) Calculate gasPerItem and require to have in batch deploy count * gasPerItem ( and have in a message count of items, keys can be 1...count, to just iterate, not delete and get min ) 
8) Send excess message after nft deploy with amount myBalance() - self.minTonsForStorage
9) Use `trait Ownable` 

## Some bags ( or fithes :) ) 
1) TACT can have only 2 references in root of c4, can't have more 
2) in Init any `Int as uintX` or smth like that always saves as uint257, have to fix .ts files 

## License

[MIT](./LICENSE)
