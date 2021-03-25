/* eslint-disable react/jsx-key */
import { html } from '@muban/muban/dist/esm/lib/template/mhtml';

export type VideoTestProps = {
  dataVideo?: string;
};

export function videoTestTemplate({ dataVideo }: VideoTestProps, ref) {
  return html`<div data-component="video-test">
    <h1>Video Test</h1>
    <div>
      <h2>Data Video</h2>
      <video controls>
        <source type="video/mp4" src=${dataVideo} />
      </video>
    </div>
    <div>
      <h2>JS Video</h2>
      <video controls>
        <source type="video/mp4" data-ref="js-video" src="" />
      </video>
    </div>
    <div>
      <h2>Template Video</h2>
      <video controls>
        <source type="video/mp4" src="${process.env.PUBLIC_PATH}/static/video/dummy-video-1.mp4" />
      </video>
    </div>
  </div>`;
}
