module.exports = async (req, res) => {
  const { default: app } = await import('../server/dist/index.js');
  return app(req, res);
};
