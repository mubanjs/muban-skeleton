import type { AppTemplateProps } from '../App.template';
import { imageTestDefaultMockData } from '../components/image-test/ImageTest.mocks';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-default',
    props: {
      blocks: [
        {
          name: 'image-test',
          props: {
            dataImage: `${process.env.PUBLIC_PATH}/static/images/mock-test.jpg`,
          },
        },
        {
          name: 'image-test',
          props: imageTestDefaultMockData,
        },
      ],
    },
  },
});
