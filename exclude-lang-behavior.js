({
  beforeAddUrl: ({ url, enqueueUrl }) => {
    try {
      const u = new URL(url);
      const hostname = u.hostname;

      // Redirect mobile Wikipedia to desktop
      if (hostname.includes('.m.wikipedia.org')) {
        u.hostname = hostname.replace('.m.wikipedia.org', '.wikipedia.org');
        enqueueUrl(u.toString());
        return false;
      }

      // Allow only specific Wikipedia language subdomains
      const match = hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);
      if (match) {
        const lang = match[1];
        const allowedLangs = ['en', 'nl', 'de'];
        return allowedLangs.includes(lang);
      }

      return true;
    } catch {
      return false;
    }
  },

  handlePageFunction: async ({ page }) => {
    const allowedLangs = ['en', 'nl', 'de'];

    await page.evaluate((allowedLangs) => {
      const fixMobileUrl = (urlStr) => {
        try {
          const url = new URL(urlStr, window.location.origin);
          if (url.hostname.includes('.m.wikipedia.org')) {
            url.hostname = url.hostname.replace('.m.wikipedia.org', '.wikipedia.org');
            return url.toString();
          }
        } catch {}
        return urlStr;
      };

      // Fix links
      document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Remove disallowed language links
        try {
          const url = new URL(href, window.location.origin);
          const match = url.hostname.match(/^([a-z\-]+)\.wikipedia\.org$/);
          if (match && !allowedLangs.includes(match[1])) {
            link.remove();
            return;
          }

          // Fix mobile Wikipedia URLs
          if (url.hostname.includes('.m.wikipedia.org')) {
            link.setAttribute('href', fixMobileUrl(href));
          }
        } catch {}
      });

      // Fix canonical and other <link> tags
      document.querySelectorAll('link[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          link.setAttribute('href', fixMobileUrl(href));
        }
      });

      // Fix <meta content="..."> tags
      document.querySelectorAll('meta[content]').forEach((meta) => {
        const content = meta.getAttribute('content');
        if (content && content.includes('.m.wikipedia.org')) {
          meta.setAttribute('content', fixMobileUrl(content));
        }
      });

      // Fix other attributes like src/srcset (optional)
      document.querySelectorAll('[src], [srcset]').forEach((el) => {
        const src = el.getAttribute('src');
        const srcset = el.getAttribute('srcset');
        if (src && src.includes('.m.wikipedia.org')) {
          el.setAttribute('src', fixMobileUrl(src));
        }
        if (srcset && srcset.includes('.m.wikipedia.org')) {
          const newSrcset = srcset
            .split(',')
            .map((s) => {
              const parts = s.trim().split(' ');
              parts[0] = fixMobileUrl(parts[0]);
              return parts.join(' ');
            })
            .join(', ');
          el.setAttribute('srcset', newSrcset);
        }
      });
    }, allowedLangs);
  }
})
