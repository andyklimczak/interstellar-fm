import type { ConfigContext, ExpoConfig } from 'expo/config';

// configure-pages supplies this path for project sites, user sites, and custom domains.
// Leave it empty for local development and deployments at the domain root.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'interstellar-fm',
  slug: config.slug ?? 'interstellar-fm',
  experiments: {
    ...config.experiments,
    baseUrl: process.env.GITHUB_PAGES_BASE_PATH?.replace(/\/$/, '') ?? '',
  },
});
