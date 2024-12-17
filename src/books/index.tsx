import {Hono} from "hono"
import Layout from "./Layout.js"
import ShowPage from "./ShowPage.js"
import IndexPage from "./IndexPage.js"

const app = new Hono()

app.get('/', async (c) => {
  return c.html(
    <Layout>
      <IndexPage />
    </Layout>
  )
})

app.post('/', (c) => c.json('create a book', 201))
app.get('/:id', (c) => {
  const id = c.req.param('id')

  return c.html(
    <Layout>
      <ShowPage id={id}></ShowPage>
    </Layout>
  )
})

export default app
