import {html} from "hono/html"

export const Layout = (props: { children: any }) => html`
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script src="/static/turbo.js" data-turbo-track="reload" type="module"></script>
    <script type="module">
      import {Application, Controller} from "/static/stimulus.js"

      window.Stimulus = Application.start()
      Stimulus.register("reset", class extends Controller {
        static targets = ["resettable"]

        reset(event) {
          this.resettableTarget.value = ""
        }
      })
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Hono + Hotwire</title>
  </head>
  <body>
  <div class="p-4">
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold mb-4"><a href="/">Todo</a></h1>
      <form method="post" action="/restore" data-turbo-confirm="データを初期状態に戻します。よろしいですか？">
        <button class="text-red-600">Restore</button>
      </form>
    </div>
    <p class="text-lg mb-4">
      Example application based on <a href="https://blog.yusu.ke/hono-htmx-cloudflare/" class="underline hover:text-blue-600">
      Yusuke Wada's "Hono + htmx + Cloudflare is a new stack"</a>
    </p>
    <p class="text-lg mb-4">
      Code is available on <a href="https://github.com/naofumi/kamal-hono" class="underline hover:text-blue-600">GitHub</a>.
    </p>
    <p class="text-lg mb-4">
      Using Hotwire (Turbo + Stimulus) instead of htmx.
    </p>
    ${props.children}
  </div>
  </body>
  </html>
`
const DatabaseRestoreButton = () => (
  <form method="post" action="/restore" data-turbo-confirm="データを初期状態に戻します。よろしいですか？">
    <button className="text-red-600">Restore</button>
  </form>
)

export const AddTodo = () => (
  <form method="post" class="mb-4" id="todo-form"
        data-controller="reset"
        data-action="turbo:submit-end->reset#reset">
    <div class="mb-2">
      <input id="todo-input" name="title" type="text"
             data-reset-target="resettable"
             class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"/>
    </div>
    <button className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
)

export const Item = ({title, id}: { title: string; id: number }) => (
  <div id={`todo_${id}`}
       class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2">
    <div>{title}</div>
    <form method="post" action={`/delete/${id}`}>
      <button className="font-medium">Delete</button>
    </form>
  </div>
)
