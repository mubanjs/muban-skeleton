import type { AppTemplateProps } from '../App.template';
import { videoTestDefaultMockData } from '../components/video-test/VideoTest.mocks';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-default',
    props: {
      blocks: [
        {
          name: 'video-test',
          props: {
            dataVideo: `${process.env.PUBLIC_PATH}/static/video/dummy-video-1.mp4`,
          },
        },
        {
          name: 'video-test',
          props: videoTestDefaultMockData,
        },
      ],
    },
  },
});
