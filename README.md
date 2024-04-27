This is a fork of `coreui-nostr-free-react-admin-template`. That template retains all of the pages from `coreui-free-react-admin-template`, which demo all that the template is capable of. In this repo, extraneous pages that are unrelated to nostr will be deleted, and the basic nostr functions will be expanded upon and polished a bit, with several pages added, including:
- view active relays
- view my follows
- view profile of other users
- store my kind 1 notes in redux and display them (event.id only, nothing fancy)


## Deploy

To deploy this to Vercel: clone this template to your github account, connect your Vercel account to your github account, and follow the instructions:

- Go to your Vercel account, find `Add New Project`. Should see option to `Import Git Repository`. Select the repo from your github account.

Use these options:
- Framework Preset is Vite. (automatically)
- Did NOT select src as the root directory, just left it as it is.
- Under Build and Output Settings, next to Output Directory, click Override and replace `dist` with `build`.
- Under Install Command, click Override and enter `npm install` (not sure if this is necessary) -- may need to do: `npm install --legacy-peer-deps`
- No Environmental Variables.
- Click Deploy.

## Run Locally

To run on your machine locally:

### Clone

``` bash
$ git clone https://github.com/wds4/coreui-nostr-free-react-admin-template-b.git
$ cd coreui-nostr-free-react-admin-template-b
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

Code released under [the MIT license](https://github.com/coreui/coreui-free-react-admin-template/blob/main/LICENSE).
