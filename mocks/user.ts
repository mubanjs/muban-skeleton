import type { RequestConfig } from '@mediamonks/monck';
import path from 'path';
import faker from 'faker';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { imageTestDefaultMockData } from '../src/components/image-test/ImageTest.mocks'

const __dirname = dirname(fileURLToPath(import.meta.url));

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

  'GET /product/:id': (req, res) => {
    const { id } = req.params;
    const productPath = path.join(__dirname, `products/${id}.json`);
    if (existsSync(productPath)) {
      res.sendFile(productPath);
    } else {
      res.sendFile(path.join(__dirname, `products/default.json`));
    }
  },
  'GET /mock-test': (_, res) => {
    res.send({
      ...imageTestDefaultMockData,
      test: 'hmr'
    });
  },
} as RequestConfig;
