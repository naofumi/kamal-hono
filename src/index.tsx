import {serve} from '@hono/node-server'
import dotenv from 'dotenv'
import {Hono} from 'hono'
import {compress} from 'hono/compress'
import {z} from 'zod'
import {zValidator} from '@hono/zod-validator'
import {serveStatic} from '@hono/node-server/serve-static'
import {drizzle} from 'drizzle-orm/libsql'
import {createClient} from '@libsql/client'
import {AddTodo, Item, Layout} from "./components.js"
import {todosTable} from "./db/schema.js"
import {eq} from "drizzle-orm"
import books from "./books/index.js"

dotenv.config()

const client = createClient({
  url: `${process.env.DB_FILE_NAME || ""}`
})
await client.execute('PRAGMA journal_mode = WAL;');

const db = drizzle({client})

const app = new Hono()
app.use(compress())
app.use('/static/*', serveStatic({root: './'}))
app.route("/books", books)

type Todo = {
  title: string
  id: string
}

// Healthcheck
app.get('/up', (c) => {
  c.status(200)
  return c.text("Healthcheck OK!")
})

app.get('/', async (c) => {
  const todos = await db.select().from(todosTable)
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
    const insertedTodos = await db.insert(todosTable).values({title}).returning()
    c.header("Content-Type", "text/vnd.turbo-stream.html")
    c.status(201)
    return (c.body(
      (<turbo-stream action="prepend" target="todos">
        <template>
          <Item title={title} id={insertedTodos[0].id}></Item>
        </template>
      </turbo-stream>).toString()
    ))
  }
)

app.post('/delete/:id', async (c) => {
  const id = parseInt(c.req.param('id'))

  await db.delete(todosTable).where(eq(todosTable.id, id))
  c.header("Content-Type", "text/vnd.turbo-stream.html")
  return c.body(
    (<turbo-stream action="remove" target={`todo_${id}`}></turbo-stream>).toString()
  )
})

app.post('/restore', async (c) => {
  await db.delete(todosTable)
  await db.insert(todosTable).values([{title: '皿を洗う'}, {title: '洗濯物を取り込む'}, {title: '猫に餌をやる'}])
  return c.redirect("/")
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
