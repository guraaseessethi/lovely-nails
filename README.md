# Lovely Nails Spa

Website for Lovely Nails Spa, 274 Burton Ave, Barrie. Built by Kooht Studio.

Next.js 16 (App Router, Cache Components) with Sanity embedded at `/studio`, hosted on Vercel.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you need
npm run dev                  # http://localhost:3000, Studio at /studio
```

Checks before every push: `npm run lint`, `npm run typecheck`, `npm run build`.

## How content flows

- Every Sanity read in `lib/content.ts` is cached with `"use cache"` and tagged with its document type.
- A Sanity webhook calls `POST /api/revalidate`. The route verifies the signature with `SANITY_REVALIDATE_SECRET` and expires that type's tag, so edits are live on the next page view.
- Images are served from Sanity's CDN through the custom loader in `lib/imageLoader.ts`.
- Anything missing in Sanity renders as a visible `[Ask April: …]` marker, never a made-up value.

## Studio

The owner sees three items: **Work photos**, **Journal**, **Hours and notices**.
Administrators also see **Admin**: site settings, services, reviews, About April, page SEO and section backgrounds.
Invite April as an **Editor** so the Admin folder stays hidden for her. (Hiding is a Studio convenience, not a permission: the free plan has no custom roles.)

The dataset is public for reads. Never store secrets in Sanity.

## Seeding (one time)

`scripts/seed.ts` uploads the photos from `../photos` and creates all documents from the content plan:
settings, Google's hours, services with the 2018 prices, hidden review placeholders, About, page SEO,
section backgrounds, work photos and six unpublished Journal drafts.

```bash
npm run seed             # creates only what doesn't exist yet
npm run seed -- --force  # overwrites everything, including Studio edits
```

Needs `SANITY_API_WRITE_TOKEN` (Editor) in `.env.local`. The script never prints it.

## Instagram feed

Uses the **Instagram API with Instagram Login**. April never shares her password.

### Meta app setup (once)

1. April's Instagram account must be **Business** or **Creator** (Instagram app > Settings > Account type).
2. At [developers.facebook.com](https://developers.facebook.com/apps), create an app of type **Business**, then add the **Instagram** product.
3. Under **Instagram > API setup with Instagram login**:
   - Copy the **Instagram app ID** and **Instagram app secret** into Vercel as `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET`.
   - Under **Set up Instagram business login > Business login settings**, add the OAuth redirect URI
     `https://www.lovelynailsbarrie.com/studio-tools/instagram/callback` (add the `*.vercel.app` one too if you'll connect from a preview).
4. While the app is in Development mode, add April's account under **App roles > Roles > Instagram testers** and have her accept it in Instagram (Settings > Website permissions > Apps and websites > Tester invites). Only the `instagram_business_basic` permission is used, so App Review isn't needed for her own account.

### Vercel setup

1. **Storage > Create > Edge Config**, connect it to the project. This adds `EDGE_CONFIG`.
2. Create an access token at **Account settings > Tokens** and add it as `VERCEL_API_TOKEN` (plus `VERCEL_TEAM_ID` if the store is in a team).
3. Add `INSTAGRAM_CONNECT_KEY` (any long random string) and `CRON_SECRET` (another one).
4. Redeploy.

### Connect

Open `https://www.lovelynailsbarrie.com/studio-tools/instagram?key=<INSTAGRAM_CONNECT_KEY>` and click **Connect Instagram**. April signs in on Instagram's own page and allows access. The long-lived token is saved to Edge Config.

The daily cron (`vercel.json`, `/api/cron/instagram`) renews the token and refreshes the feed, because Instagram image links expire after a few days. Only photo and carousel posts are shown. Hide individual posts (hours notices and the like) in **Admin > Site settings > Instagram feed**, or limit the feed to a hashtag. If the token is missing or Instagram is down, the strip simply doesn't render.

## Redirects and headers

`next.config.ts` holds the 301s for the old WordPress URLs (`/about-us/`, `/contact-us/`, `/media-events/`, `/services/`), the CSP (self, Sanity CDN, Google Maps, Instagram CDN) and the other security headers. `/studio` is exempt from the CSP and X-Frame-Options.
