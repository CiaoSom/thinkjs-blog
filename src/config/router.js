module.exports = [
  // RESTFUL
  [/\/api\/(\w+)(?:\/(.*))?/, 'api/:1?id=:2', 'rest'],
  ['/page/about', 'content/page?slug=about'],
  // ['/page/links', 'content/page?slug=links'],
  ['/page/todo', 'content/page?slug=todo'],
  ['/page/archives', 'content/archives'],
  [/\/page\/(\d+)/, 'content/list?page=:1'],
  ['/category/:category', 'content/muster'],
  ['/category/:category/:page', 'content/muster'],
  ['/tag/:tag', 'content/muster'],
  ['/tag/:tag/:page', 'content/muster'],
  ['/:category/:slug', 'content/detail'],
];
