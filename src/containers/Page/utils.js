const HOST = process.env.APP;
const PORT = process.env.PORT;
const SITE_URL = `http://${HOST}:${PORT}`;

const defaultTitle = process.env.NAME;
const defaultSep = " | ";

export const getTitle = title => {
  return title ? title + defaultSep + defaultTitle : defaultTitle;
};

export const getPath = pathname => {
  return SITE_URL + pathname;
};

export const htmlAttributes = schema => {
  return { lang: "en", itemscope: undefined, itemtype: `http://schema.org/${schema || "WebPage"}` };
};

export const getMetaTags = ({ title, description, image, contentType, twitter, noCrawl, published, updated, category, tags }, pathname) => {
  const logo = /* todo svg image */ "";
  const defaultDescription = process.env.DESC;
  const defaultImage = `${SITE_URL}${logo}`;
  const defaultTwitter = "@io";

  const theTitle = title ? (title + defaultSep + defaultTitle).substring(0, 60) : defaultTitle;
  const theDescription = description ? description.substring(0, 155) : defaultDescription;
  const theImage = image ? `${SITE_URL}${image}` : defaultImage;

  const metaTags = [
    { itemprop: "name", content: theTitle },
    { itemprop: "description", content: theDescription },
    { itemprop: "image", content: theImage },
    { name: "description", content: theDescription },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: defaultTwitter },
    { name: "twitter:title", content: theTitle },
    { name: "twitter:description", content: theDescription },
    { name: "twitter:creator", content: twitter || defaultTwitter },
    { name: "twitter:image:src", content: theImage },
    { property: "og:title", content: theTitle },
    { property: "og:type", content: contentType || "website" },
    { property: "og:url", content: getPath(pathname) },
    { property: "og:image", content: theImage },
    { property: "og:description", content: theDescription },
    { property: "og:site_name", content: defaultTitle },
    noCrawl ? { name: "robots", content: "noindex, nofollow" } : {},
    published ? { name: "article:published_time", content: published } : {},
    updated ? { name: "article:modified_time", content: updated } : {},
    category ? { name: "article:section", content: category } : {},
    tags ? { name: "article:tag", content: tags } : {}
  ];
  return metaTags;
};
