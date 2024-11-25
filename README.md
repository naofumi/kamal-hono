# Kamal Hono

* Example application based on Yusuke Wada's blog post, ["Hono + htmx + Cloudflare is a new stack"](https://blog.yusu.ke/hono-htmx-cloudflare/)
* Key differences
  * Uses Hotwire (Turbo and Stimulus) instead of HTMX.
  * Deployed on VPS instead of Cloudflare, using Kamal 2.0 – [kamal-hono.castle104.com](https://kamal-hono.castle104.com)
  * DB is local SQLite instead of Cloudflare D1
  * A "Restore" button is provided in the UI to re-seed the database.

## Local development

```
npm install
npm run dev
```

```
open http://localhost:3000
```

SQLite database file with seed data has been committed to Git for convenience. 
