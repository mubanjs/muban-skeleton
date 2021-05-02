import type { RequestConfig } from '@mediamonks/monck';

export default {
  'GET /mocks/imageTest': (req, res) => {
    res.send(require('../src/components/image-test/ImageTest.mocks'));
  },
} as RequestConfig;
