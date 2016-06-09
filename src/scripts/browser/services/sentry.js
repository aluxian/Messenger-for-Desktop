import raven from 'raven';

export function getClient () {
  return new raven.Client(global.manifest.sentry.dsn, {
    release: global.manifest.version,
    name: global.manifest.productName
  });
}
