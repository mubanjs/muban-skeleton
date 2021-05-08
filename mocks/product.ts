import type { RequestConfig } from '@mediamonks/monck';
import path from 'path';
import { existsSync } from 'fs';

export default {
  'GET /products': (req, res) => {
    res.send({
      products: 'todo',
    });
  },

  'GET /products/:id': (req, res) => {
    const { id } = req.params;
    const productPath = path.join(__dirname, `products/${id}.json`);
    if (existsSync(productPath)) {
      res.sendFile(productPath);
    } else {
      res.sendFile(path.join(__dirname, `products/default.json`));
    }
  },
} as RequestConfig;
