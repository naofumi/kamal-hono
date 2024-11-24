import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {html} from 'hono/html'
import {z} from 'zod'
import {zValidator} from '@hono/zod-validator'
import {serveStatic} from '@hono/node-server/serve-static'
import Database from "better-sqlite3"

const db = new Database("db/db.sqlite")
db.pragma('journal_mode = WAL')

const app = new Hono()
app.use('/static/*', serveStatic({root: './'}))

const Layout = (props: { children: any }) => html`
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
    <h1 class="text-4xl font-bold mb-4"><a href="/">Todo</a></h1>
    <p class="text-lg mb-4">
      Example application based on <a href="https://blog.yusu.ke/hono-htmx-cloudflare/" class="underline hover:text-blue-600">
      Yusuke Wada "Hono + htmx + Cloudflare is a new stack"</a>
    </p>
    <p class="text-lg mb-4">
      Using Hotwire (Turbo + Stimulus) instead of htmx.
    </p>
    ${props.children}
  </div>
  </body>
  </html>
`
export const AddTodo = () => (
  <form method="post" class="mb-4" id="todo-form"
        data-controller="reset"
        data-action="turbo:submit-end->reset#reset">
    <div class="mb-2">
      <input id="todo-input" name="title" type="text"
             data-reset-target="resettable"
             class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"/>
    </div>
    <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
)

export const Item = ({title, id}: { title: string; id: string }) => (
  <div id={`todo_${id}`}
       class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2">
    <div>{title}</div>
    <form method="post" action={`/delete/${id}`}>
      <button class="font-medium">Delete</button>
    </form>
  </div>
)

type Todo = {
  title: string
  id: string
}

// Healthcheck
app.get('/up', (c) => {
  c.status(200)
  return c.text("Healthcheck OK!")
})

app.get('/', (c) => {
  const todos = db.prepare("SELECT * FROM todos").all() as Todo[]
  return(c.html(<Layout>
    <AddTodo/>
    <div id="todos">
      {todos.map((todo) => {
        return <Item title={todo.title} id={todo.id}/>
      })}
    </div>
  </Layout>))
})

app.post(
  '/',
  zValidator(
    'form',
    z.object({
      title: z.string().min(1)
    })
  ),
  async (c) => {
    const {title} = c.req.valid('form')
    const info = db.prepare(`INSERT INTO todos(title)
                             VALUES (?);`).bind(title).run()
    const lastId = info.lastInsertRowid
    c.header("Content-Type", "text/vnd.turbo-stream.html")
    c.status(201)
    return(c.body(
      (<turbo-stream action="prepend" target="todos">
        <template>
          <Item title={title} id={lastId.toString()}></Item>
        </template>
      </turbo-stream>).toString()
    ))
  }
)

app.post('/delete/:id', async (c) => {
  const id = c.req.param('id')
  db.prepare(`DELETE
              FROM todos
              WHERE id = ?;`).bind(id).run()
  c.header("Content-Type", "text/vnd.turbo-stream.html")
  return c.body(
    (<turbo-stream action="remove" target={`todo_${id}`}></turbo-stream>).toString()
  )
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
