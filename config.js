function parsePort(value) {
  const port = value === undefined ? 8080 : Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
}

module.exports = { parsePort };