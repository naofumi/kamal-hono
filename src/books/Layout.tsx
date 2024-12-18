import {html} from "hono/html"

export default function Layout({children}: {children: any}) {
  return html`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <link rel="preload" href="/static/assets/application.css" as="style"/>
      <link rel="preload" href="/static/stimulus.js" as="script"/>
      <link rel="preload" href="/static/controllers/greetings_controller.js" as="script"/>
      <script type="importmap" data-turbo-track="reload">
        {
          "imports": {
            "stimulus": "/static/stimulus.js"
          }
        }
      </script>
      <script src="/static/turbo.js" data-turbo-track="reload" type="module"></script>
      <script src="/static/application.js" data-turbo-track="reload" type="module"></script>
      <link rel="stylesheet" href="/static/assets/application.css">
      <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon">
      <title>Hono + Hotwire</title>
    </head>
    <body>
    ${children}
    </body>
    </html>
  `
}
