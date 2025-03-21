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

If you want to quickly check your changes for validity, run:

```shell
yarn lint
```

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

To deploy NFT Item follow some instructions in [`contract.deploy_nft.ts`](./sources/contract.nft_deploy.ts) and define in `.env`
- `COLLECTION_ADDRESS`

then 
```shell 
yarn deploynft
```

To batch NFT follow instructions in [`contract.deploy_nft.ts`](./sources/contract.batch_nft_deploy.ts)

then 
```shell
yarn batchdeploynft
```


## Testing

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
7) Get nextItemIndex in hashmap, not deleteGetMin
8) Send excess message after nft deploy to notify new owner ( how in transfer )

Code with some of this opportunities in `tact-standard` branch, this code have another exitCodes but same core functionality, it can batch deploy 

btw new code can batch deploy 142 items in 1.6 dev tact vs 130 on func originals 

## License

[MIT](./LICENSE)
