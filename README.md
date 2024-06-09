A collection of experimental apps for bringing web of trust to nostr.

Currently two apps:

Nostrapedia: wikipedia for nostr, using [NIP-54](https://github.com/nostr-protocol/nips/blob/master/54.md)

Grapevine: calculation of the influence score as an alternative to the standard web of trust score

## Run Locally

To run on your machine locally:

### Clone

``` bash
$ git clone https://github.com/wds4/brainstorm.git
$ cd brainstorm
```

### Installation

``` bash
$ npm install
```

or

``` bash
$ yarn install
```

### Basic usage

``` bash
# dev server with hot reload at http://localhost:3000
$ npm start 
```

or 

``` bash
# dev server with hot reload at http://localhost:3000
$ yarn start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

or

```bash
# build for production with minification
$ yarn build
```

## License

Code released under [GNU Affero General Public License v3.0](https://github.com/wds4/brainstorm/blob/main/LICENSE).
