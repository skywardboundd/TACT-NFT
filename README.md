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


## Idea of this standard 

### Deploy 1 NFT
It will be much cleaner when we have message to deploy, and return all remaining tons to owner

Notify owner of NFT about this nft

### Batch deploy 
It doesn't make sense to mint old nfts, just because nft have already been initialized, so it only makes sense to mint immediately nextItemIndex and take exactly the next item via get, not delete, because if the next index will be > nextItemIndex, we will get throw immediately. 

That's why we can use map in tact, not dict-like cells with asm function ( and auto-code for building this dictionary )

## Unresolved questions
Should we check `amount > minTonsAmount` on deploy? 

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
