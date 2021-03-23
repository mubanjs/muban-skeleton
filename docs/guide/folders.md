# Folders

A list of the folders and most important files inside a standard Muban project.

* `.storybook/` – Contains
  [storybook configuration](https://storybook.js.org/docs/react/configure/overview).

* `config/` - Contains the Muban Project configuration.

* `dist/` – Contains the output of a `build`.
  * `site/` – The website assets, can be moved to the CMS or deployed when a `build:preview` was 
    used.
  * `node/` – Contains a node-js project to be deployed to offer a API mock service.
  
* `docs/` – Contains this documentation

* `mocks/` – Contains API mock files used by
  [@mediamonks/monck](https://github.com/mediamonks/monck#readme).

* `scripts/` – All code to support the npm scripts (e.g. starting the dev server, generating 
  mocks, etc) 

* `src/` – All your project code.
  
  * `assets/` – All non-js/css assets (e.g. images, video, fonts, etc) that you require directly in
    your JS/CSS and gets automatically processed by webpack. These file will get a `[chunkhash]` in
    their filename to be different in each build if they have changed.
    
  * `components/` – All your Muban Components, both UI and non-UI. For UI components we try to use
    atomic design, so expect the `atoms` `molecules` and `organisms` folders in here as well.
    There's also a `layouts` folder (which can be seen as page templates).
    
  * `pages/` – Contains the page data files, used to render and preview the website pages. Pages 
    are rendered using the templates, and the `src/App.template.ts` is the entrypoint for all.
    * `static/` – Should contain assets that are used in the page data files. These will normally 
      come from the CMS, and will only be copied over to the `dist` folder when doing a 
      `build:preview`.
      
  * `public/` – Contents of this folder will be copied over to the `dist/site`, and should 
    contain files that will be accessed from the HTML templates or `fetch`. These are not 
    processed by webpack (just copied over), and the filenames will stay the same (no
    `[contenthash]` is added). In the future, we could consider versioning parts of this folder.
    
  * `styles/` - All styling (`.scss` files) for the project.
    
  * `index.ts` – Starts the Muban application using `App.ts`.
    
  * `polyfills.js` – Contains all polyfills. The `core-js` import is replaced by 
    `@babel/preset-env`. Other polyfills can be added here.
    
  * `server-buldle.ts` – Imports the `App.template.ts` and uses webpack to create a bundle to 
    create page html files out of.
