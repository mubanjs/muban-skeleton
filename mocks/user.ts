import type { RequestConfig } from '@mediamonks/monck';
import faker from 'faker';

export default {
  'GET /user/info': (req, res) => {
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
} as RequestConfig;
