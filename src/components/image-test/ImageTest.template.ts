/* eslint-disable react/jsx-key */
import { html } from '@muban/muban/dist/esm/lib/template/mhtml';

export type ImageTestProps = {
  dataImage?: string;
};

export function imageTestTemplate({ dataImage }: ImageTestProps, ref) {
  return html`<div data-component="image-test">
    <div>
      <h1>Data Image</h1>
      <img src=${dataImage} />
    </div>
    <div>
      <h1>JS Image</h1>
      <img data-ref="js-image" />
    </div>
    <div>
      <h1>CSS Image</h1>
      <div class="css-image"></div>
    </div>
    <div>
      <h1>Template Image</h1>
      <img src="${process.env.PUBLIC_PATH}/static/images/template-test.jpg" />
    </div>
  </div>`;
}
