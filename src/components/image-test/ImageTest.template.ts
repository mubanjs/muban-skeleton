import { html } from '@muban/template';

export type ImageTestProps = {
  dataImage?: string;
};

export function imageTestTemplate({ dataImage }: ImageTestProps) {
  return html`<div data-component="image-test">
    <div>
      <h1>Data Image</h1>
      <img alt="prop" src=${dataImage} />
    </div>
    <div>
      <h1>JS Image</h1>
      <img alt="js ref" data-ref="js-image" />
    </div>
    <div>
      <h1>CSS Image</h1>
      <div alt="css" class="css-image"></div>
    </div>
    <div>
      <h1>Template Image</h1>
      <img alt="template" src="${process.env.PUBLIC_PATH}static/img/template-test.jpg" />
    </div>
  </div>`;
}
