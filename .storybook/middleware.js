const { resolve } = require("path");

const ENABLE_MOCK_API_MIDDLEWARE = process.env.MOCK_API === "true";
const MOCKS_OUTPUT_DIR = resolve(process.cwd(), 'dist', 'node', "mocks");

module.exports = async router => {
  if (ENABLE_MOCK_API_MIDDLEWARE) {

    const { createMockMiddleWare } = await import('@mediamonks/monck');
    router.use('/api/', createMockMiddleWare(MOCKS_OUTPUT_DIR));
  }
}
