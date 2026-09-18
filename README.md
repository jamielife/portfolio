# myPortfolioWebsite

## Project URL
 - https://jamietaylor.me/

## Local setup
```sh
mise install
mise exec node@16.20.2 -- npm ci --legacy-peer-deps
```

This Expo 44 project uses Node.js 16.20.2, pinned in `mise.toml`. Its legacy peer dependencies require `--legacy-peer-deps` for installation.

## Run locally
```sh
BROWSER=chromium mise exec node@16.20.2 -- npm start -- --clear
```

Press `w` in Expo to open the web build, or browse to `http://localhost:19006`. The `BROWSER=chromium` prefix avoids an unavailable `zen-browser` launcher.

### Dependency recovery

Do not delete `package-lock.json` for routine installs: it pins legacy versions that are compatible with Expo 44 and its Webpack toolchain. If the lockfile or `node_modules` must be reset, restore the tracked dependency files and reinstall:

```sh
git restore package.json package-lock.json
rm -rf node_modules
mise exec node@16.20.2 -- npm ci --legacy-peer-deps
```

Upgrade the Expo toolchain before changing to a current Node LTS release.

## PocketBase API

The portfolio and PocketBase run from `https://jamietaylor.me`: the site is served from `/`, the API from `/api/`, and the PocketBase Dashboard from `/_/`. The public API only exposes records where `hidden` is `false`; all writes require a PocketBase superuser account.

### Deploy in Coolify

Update the existing portfolio **Application** to use `pocketbase/Dockerfile` as its Dockerfile and the repository root as its build context. This single build compiles the Expo web app and has PocketBase serve it from `pb_public`.

- Domain: `jamietaylor.me`
- Internal port: `8080`
- Persistent volume: `/pb/pb_data`
- Environment variable: `PB_ENCRYPTION_KEY` set to a newly generated, private 32-character value

Keep the existing `jamietaylor.me` DNS record pointed at the Coolify server. PocketBase is configured for the production site and local Expo web server as CORS origins. The first deployment applies the committed collection migration automatically.

After the deployment is healthy, open `https://jamietaylor.me/_/` and create the first superuser in the one-time setup screen. Do not store that account or its password in this repository. Use the Dashboard only for records; collection schema changes belong in `pocketbase/pb_migrations`.

Coolify's persistent volume keeps the SQLite database across redeploys, but it is not a substitute for verified backups. Keep the configured nightly Coolify backup and periodically restore a backup into a non-production instance before retiring Supabase.

### Import Supabase data

1. Export both tables from the Supabase SQL editor:

   ```sql
   select * from public.work order by featured desc, id;
   select * from public.posts order by featured desc, id;
   ```

2. Save each result as CSV. Rename `id` to `source_id` and rename fields unsupported by PocketBase:
   - `image-thumb` to `image_thumb`
   - `images-sm` to `images_sm`
   - `image-md` to `image_md`
   - `image-lg` to `image_lg` (posts only)
3. In the PocketBase Dashboard, import each CSV into its matching collection. Preserve the existing external image URLs.
4. Compare record counts and visible entries, then check that `GET /api/collections/work/records` does not return hidden records.
5. Rebuild and deploy the portfolio only after the API has imported and validated its data. Keep the Supabase project available as rollback until production verification is complete.

## Build/Serve
```bash
#remove dist, build for web, rename web-build folder
rm -r dist && npx expo build:web && mv web-build dist
#test
npx serve dist
```

## Roadmap
 - ~~Localize page titles~~
 - ~~Continuous deployment~~
 - One Component for both work and posts ...to rule them all.
 - Icons in drawer
 - Better 3d touch controls

## Gotchas
 - Project foldername of length over 12(ish) causes issue with Expo. 
 - Bug in node_module *react-native-url-polyfill* requires change to index.js (this appears to be fixed by developers)
```
5: const packageObj = require('./package.json');
6: const name = packageObj.name;
7: const version = packageObj.version;
```

 - Inverse to Invert fix...
 - - https://github.com/EvanBacon/expo-three-orbit-controls/commit/1a67021c391da2da462cce6dfeb05829f0956c20
 - - node_modules\expo-three-orbit-controls\build\OrbitControls.js

 - https://docs.expo.dev/versions/latest/sdk/reanimated/#installation
 ```\react-native-reanimated\lib\reanimated1\core\AnimatedNode.js``` and ```AnimatedValue.js``` code change for web (https://github.com/software-mansion/react-native-reanimated/issues/3156)

 - useRef is deprecated
 - - node_modules\react-native-web-hooks\build\createPseudoHook.js
 - - https://github.com/EvanBacon/react-native-web-hooks/issues/29
