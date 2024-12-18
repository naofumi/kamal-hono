# Kamal Hono

* Example application based on Yusuke Wada's blog post, ["Hono + htmx + Cloudflare is a new stack"](https://blog.yusu.ke/hono-htmx-cloudflare/)
* Key differences
  * Uses Hotwire (Turbo and Stimulus) instead of HTMX.
     * Hotwire will generally require custom JavaScript. We use the [no-build approach for "client-side JavaScript"](https://world.hey.com/dhh/once-1-is-entirely-nobuild-for-the-front-end-ce56f6d7). 
     * To clarify, "client-side JavaScript" refers to JavaScript run on the browser. We only use JSX as a templating engine, so in our case, JSX is "server-side JavaScript".
  * Deployed on VPS instead of Cloudflare, using Kamal 2.0 – [kamal-hono.castle104.com](https://kamal-hono.castle104.com). ([more information on this approach ...](https://zenn.dev/naofumik/articles/2721c75784566c))
  * We use a local SQLite database instead of Cloudflare D1. We also use Drizzle as the ORM.
  * Instead of including Tailwind CSS from the CDN, we [compile the CSS with Tailwind CLI](https://tailwindcss.com/docs/installation).
  * A "Restore" button is provided in the UI to re-seed the database.

https://github.com/user-attachments/assets/95f54358-14fb-4a0c-bda3-0fc3326a6dec

## Local development

```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Deployment

SQLite database file with seed data has been committed to Git for convenience. We might want to change this.

* [Set up Kamal as described in this Zenn article](https://zenn.dev/naofumik/articles/2721c75784566c).
* Run `kamal deploy` to deploy
* To migrate the database, run `kamal drizzle-push`.

## Todos

* Run automatic database migrations during Kamal deploy.
* Add digests to assets (including images) for cache busting.
* Automate Stimulus controller generation
* Automate import maps generation.
