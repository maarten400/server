module.exports = {
  beforeAddUrl: ({ url, enqueueUrl }) => {
    const allowedLangs = ['en', 'nl', 'de'];
    const match = url.hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);

    if (match) {
      const lang = match[1];
      if (!allowedLangs.includes(lang)) {
        return false; // exclude non-allowed languages
      }
    }
    return true; // allow other URLs
  }
};
