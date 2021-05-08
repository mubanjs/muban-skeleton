import { createMockMiddleWare } from '@mediamonks/monck';
import { paths } from '../config/paths';

const middleware = (router) => {
  router.use('/api/', createMockMiddleWare(paths.mockPath));
  router.use('/api/', (req, res) => res.sendStatus(404));
};
export default middleware;
