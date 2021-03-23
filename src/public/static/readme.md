This folder will be copied over along with everything else inside the `public` folder, and
should mainly be used to any files that are not directly loaded through webpack, but should
be part of the build.

Examples of this are assets that are referenced in the HTML or loaded through `fetch`.

Don't add anything in here that is directly imported in JavaScript or linked in the SCSS files.
Also don't add anything referenced from your page data files.
