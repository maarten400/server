({
  beforeAddUrl: ({ url }) => {
    const allowedLangs = ['en', 'nl', 'de'];
    try {
      const hostname = new URL(url).hostname;
      const match = hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);
      if (match) {
        return allowedLangs.includes(match[1]);
      }
      return true;
    } catch {
      return false;
    }
  }
})
