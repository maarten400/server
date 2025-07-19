({
  beforeAddUrl: ({ url }) => {
    try {
      const hostname = new URL(url).hostname;
      const match = hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);
      if (match) {
        const lang = match[1];
        const allowedLangs = ['en', 'nl', 'de'];
        return allowedLangs.includes(lang);
      }
      return true; // Allow other domains
    } catch (e) {
      return false;
    }
  },

  handlePageFunction: async ({ page }) => {
    // Remove all links to disallowed Wikipedia languages before link discovery
    const allowedLangs = ['en', 'nl', 'de'];
    await page.evaluate((allowedLangs) => {
      const links = document.querySelectorAll('a[href*=".wikipedia.org"]');
      for (const link of links) {
        const href = link.getAttribute('href');
        try {
          const url = new URL(href, window.location.origin);
          const match = url.hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);
          if (match && !allowedLangs.includes(match[1])) {
            link.remove(); // Remove the link from DOM
          }
        } catch (e) {
          // Ignore malformed URLs
        }
      }
    }, allowedLangs);
  }
})
