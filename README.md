# Tact NFT project

This project is a port of the contracts from Func NFT TEP-62 & supporting TEP-66.

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

## Deployment

To deploy a contract, follow these steps:

1. Define the [`contract.tact`](./sources/contract.tact) file that will be used as entry point of your contract.
2. Customize the [`contract.deploy.ts`](./sources/contract.deploy.ts) file based on your `contract.tact` to generate a deployment link. It is crucial to ensure the proper invocation of the `init()` function within the contract.

If you rename `contract.tact`, be sure to update [`tact.config.json`](./tact.config.json) accordingly. For a description of `tact.config.json`, see the [Configuration page in the Tact documentation](https://docs.tact-lang.org/book/config).

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

## Opportuinies 
1) Use ^Struct in future versions of tact 
2) Use opcode with deploying NFT 
3) If we can check some conditionals after loadData(), in our case it is in NFTItem owner != null
4) Using TupleBool 
5) Either type in TACT
6) With another way to use addr_none$00 in tact we can delete ? in responceDestination var  

## Some bags ( or fithes :) ) 
1) TACT can have only 2 references in root of c4, can't have more 
2) in Init any `Int as uintX` or smth like that always saves as uint257, have to fix .ts files 

## License

[MIT](./LICENSE)
