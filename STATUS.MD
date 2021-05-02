# Muban Skeleton

## Production build

Done
+ bundle JS and CSS
+ support lazy loading / code splitting
+ 3 build types
    + dist mode (single build, output on disk)
    + dev mode (run webpack dev server and serve files from memory, including HTMl generation)
    / watch mode (output on disk, but watch change for a quick rebuild)
+ export generated HTML pages

Todo
- exclude all templates - except the ones being actually used

### Dev mode

Done
+ run express server to server HTML and js/css
+ output HTML from express, not from JS, to better simulate a built package
+ integrate webpack-dev-middleware and webpack-hot-middleware

Todo
- implement live-reload for HTML reload (https://github.com/mubanjs/muban-skeleton/projects/1#card-58757198)
- implement proper hot-reloading for JS components - or maybe just reload the page? (https://github.com/mubanjs/muban-skeleton/projects/1#card-58757255)
- I noticed that the hot reloading for the new muban wouldn't work sometimes. E.g. when a
  variable type error is fixed, it would continue to show the error. Only upon restarting the
  server would it go away. (this is for server templates)


### Template rendering

Done
+ root template is always the "index.html" that includes the head and body with default info and app container
+ then there is a default layout template that can render blocks, with an optional header and footer
+ user can create their own layouts for other pages
+ each page can optionally specify to choose a custom layout to render
+ a layout or template decides what to render based on the provided data on the page

### Pages

Done
+ a page is a TS file that exports a data object, as an object or a function

Todo
- build up a "context" object and pass this to each page's `data` function
  https://github.com/mubanjs/muban-skeleton/projects/1#card-58757108
- besides page data, allow for setting other info like metadata (title/description/og:tags) https://github.com/mubanjs/muban-skeleton/projects/1#card-58756985

- multilanguage

### Routing

Both during dev mode, and when generating build pages, we need to know what Pages exist, and what to render.

Done
+ when no "index" file on disk is present, render auto-index instead
+ also support pages in folders
+ files on disk should be pages
  + urls should include .html
+ folder should redirect to index.html in the folder

Todo
- make "router" available to templates? (https://github.com/mubanjs/muban-skeleton/projects/1#card-58757446)

### Theming

Todo
https://github.com/mubanjs/muban-skeleton/projects/1#card-58757391
- support for themes/styles/variables
- make separate theme build
- other exceptions per theme (html? js?)
- pages per theme? theme variables?

#### Optional

Done
+ leave CSS bundled with JS files to reduce initial css load size (turned off again)

Progress
- API mocking

Todo
- create auto-index page (https://github.com/mubanjs/muban-skeleton/projects/1#card-58757343)
- export only JS / CSS solo
- typed API ??

- check non-zero error codes on build
