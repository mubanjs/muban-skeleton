import type { RequestConfig } from '@mediamonks/monck';
import faker from 'faker';
import { imageTestDefaultMockData } from '../src/components/image-test/ImageTest.mocks';

export default {
  'GET /user/info': (_, res) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName(firstName, lastName);

    res.send({
      id: faker.random.uuid(),
      userName: username,
      email: faker.internet.email(firstName, lastName),
      firstName: firstName,
      lastName: lastName,
    });
  },

  'POST /user/login': (req, res) => {
    const { userName, password } = req.body;
    if (userName === 'john' && password === 'password') {
      res.send({
        success: true,
      });
    } else {
      res.send({
        success: false,
      });
    }
  },
  'GET /mock-test': (_, res) => {
    res.send({
      ...imageTestDefaultMockData,
      test: 'hmr',
    });
  },
} as RequestConfig;
