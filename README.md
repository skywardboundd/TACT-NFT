# Tact NFT project

These contracts implement TEP 62 & TEP-66 support and have different exitCodes compared to the func implementation.

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

## Idea of this standard 
### Deploy 1 NFT
It makes sense to make sure we send at least a minimum of a tone to storage, and to return the remaining tons after such messages so we don't have to guess. Also, it makes sense to notify the new owner after the nft is deployed, as in the case of a transfer.

And it will be much cleaner when we have message to deploy

### Batch deploy 
1) It doesn't make sense to mint old nfts, just because nft have already been initialized, so it only makes sense to mint immediately nextItemIndex and take exactly the next item via get, not delete, because if the next index will be > nextItemIndex, we will get throw immediately. 

That's why we can use map in tact, not dict-like cells with asm function ( and auto-code for building this dictionary )

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

then 
```shell 
yarn deploynft
```

## Testing

```
yarn test
```

## License

[MIT](./LICENSE)
