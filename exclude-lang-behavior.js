module.exports = {
  beforeAddUrl: ({ url }) => {
    try {
      const hostname = new URL(url).hostname;
      const match = hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);
      if (match) {
        const lang = match[1];
        const allowedLangs = ['en', 'nl', 'de'];
        return allowedLangs.includes(lang); // Only allow if it's en/nl/de
      }
      return true; // Allow all non-wikipedia.org domains
    } catch (e) {
      return false; // Block malformed URLs
    }
  }
};
