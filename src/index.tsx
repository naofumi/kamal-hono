import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {z} from 'zod'
import {zValidator} from '@hono/zod-validator'
import {serveStatic} from '@hono/node-server/serve-static'
import Database from "better-sqlite3"
import {AddTodo, Item, Layout} from "./components"

const db = new Database("db/db.sqlite")
db.pragma('journal_mode = WAL')

const app = new Hono()
app.use('/static/*', serveStatic({root: './'}))

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
  return (c.html(<Layout>
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
    return (c.body(
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

app.post('/restore', async (c) => {
  db.prepare("DELETE FROM todos;").run()
  db.prepare("INSERT INTO todos (title) VALUES ('皿を洗う'), ('洗濯物を取り込む'), ('猫に餌をやる');").run()
  return c.redirect("/")
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
