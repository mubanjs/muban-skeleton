# Pages

The "pages" in the Muban Skeleton are purely for previewing your components (locally) before any server rendered pages
are available. Individual components can be previewed in storybook, but pages offer a more complete way of seeing
multiple components together, surrounded by an optional header or footer, or animating when they scroll into view.

Since pages are rendered by templates, which is normally done on the server, the JS components don't have any influence
on how they are rendered - they merely become active after everything has already rendered.

These component templates need data, and since the JS components can't provide that data, it has to come from somewhere
else. Each "page" is a TypeScript file that exports a `data` function, and contains all the data that is needed to
render all the templates for that page. Moreover, the data files often decide which components are rendered on the page.


## The page file

To summarize before we start, the page file:

* Is located in the `/src/pages/` folder.
* Has its filename written in `snake-case.ts`.
* Has to export a `data` function that should return an object according to the `AppTemplateProps` shape.
* Can conditionally export a function that returns metadata for the page `<head>`.
* Can exist in sub-folders.
* Will be generated as a `.html` file with the same name/path. 

In short, that should look like this.

```ts
// pages/index.ts

import { AppTemplateProps } from '../App.template';

export const data = (): AppTemplateProps => ({
  // ... page data
});
```

::: tip Ignoring files and folders
Any file or folder in the `src/pages` folder starting with a `_` will be ignored when generating 
page templates.
So if you're looking to share some data or utilities only used for pages, you can prefix the file
with a `_` and still have it located in the `src/pages` folder, without a page being created for it.
:::

### Template

For each page that we render, we start with the `appTemplate` - it also has a corresponding `App` component that will
be mounted after the page has been rendered. The `appTemplate` decides which child templates to render for each
specific page based on the data provided for that page. It does so by creating a "map" with all possible templates,
and based on the data for that page, it picks one (or multiple) templates to render, passing along the props that
belong with that child template.

::: tip Types
Note that the data function is typed as `AppTemplateProps`. This is because this function must return data that will
be passed to the `appTemplate`. In turn, the `AppTemplateProps` will include the types of its child templates, making
sure everything is typed, down to the most nested child component.
:::

The corresponding `App` component registers the same child components to initialize them whenever they are rendered
on the page.

The `App` and the `BlockRenderer` are 2 components that make use of this method of dynamically rendering a child
component. There are two variations; either rendering a single child component (selected from multiple options), or
rendering a list of child components (each one selected from multiple options). 

```ts
// App.template.ts

export type AppTemplateProps = {
  layout:
    | { name: typeof LayoutDefault.displayName, props: LayoutDefaultTemplateProps }
    | { name: typeof LayoutCustom.displayName, props: LayoutCustomTemplateProps }
};

export function appTemplate({ layout }: AppTemplateProps): string {
  return html`<div data-component=${App.displayName}>
    ${renderLazyComponentTemplate({
      [LayoutDefault.displayName]: layoutDefaultTemplate,
      [LayoutCustom.displayName]: layoutCustomTemplate,
    }, { component: layout })}
  </div>`;
}
```

Some things to highlight:

* In the App template, we can choose 1 layout to render for this page

* In the template function, we use the `renderLazyComponentTemplate` helper to:
    * register the available options, using the component `displayName` as key
    * pass either `component` (in this case) or `components` (to render multiple)

* In `AppTemplateProps`, we use a union of all the possible child components to render, for each one providing its 
  name and its props.
  
  
### Component

The component is simpler, just listing the child components to initialize, using the `lazy` helper to support code
splitting.

```ts
// App.ts

export const App = defineComponent({
  name: 'app',
  components: [
    lazy('layout-default', () => import(/* webpackExports: "lazy" */ './components/layouts/DefaultLayout')),
    lazy('layout-custom', () => import(/* webpackExports: "lazy" */ './components/layouts/CustomLayout')),
  ],
  setup() {
    return [];
  }
});
```

## Dev Server

The Dev Server makes these pages available in the browser in the following ways:

### With the .html extension

* `/index.html` loads `/src/pages/index.ts`
* `/news.html` loads `/src/pages/news.ts`

### Without the .html extension

* `/` loads `/src/pages/index.ts`
* `/news` loads `/src/pages/news.ts`

### In folders

* `/news/index.html` loads `/src/pages/news/index.ts`
* `/news/overview.html` loads `/src/pages/news/overview.ts`
* `/news` loads `/src/pages/news/index.ts`
* `/news/overview` loads `/src/pages/news/overview.ts`

Or including a trailing /

* `/news/` loads `/src/pages/news/index.ts`
* `/news/overview/` loads `/src/pages/news/overview.ts`
