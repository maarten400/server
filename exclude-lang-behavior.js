({
  beforeAddUrl: ({ url }) => {
    const allowedLangs = ['en', 'nl', 'de'];

    try {
      const { hostname } = new URL(url);
      const match = hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);

      if (match) {
        const lang = match[1];
        if (allowedLangs.includes(lang)) {
          return true; // Allow URLs from en, nl, de Wikipedia
        }
        return false; // Block other Wikipedia languages
      }

      if (hostname === 'm.wikipedia.org') {
        // Redirect mobile Wikipedia to desktop
        const desktopUrl = url.replace('m.wikipedia.org', 'en.wikipedia.org');
        return { redirect: desktopUrl };
      }

      return true; // Allow non-Wikipedia URLs
    } catch (error) {
      return false; // Block invalid URLs
    }
  }
})
