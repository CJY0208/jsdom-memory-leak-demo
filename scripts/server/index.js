const path = require('path')
const serve = require('koa-static')
const Koa = require('koa')

const prerender = require('./prerender')

const port = 5000
const app = new Koa()

let count = 0

app.use(async (ctx, next) => {
  if (/\..*$/.test(ctx.request.url)) {
    return next()
  } else {
    const times = count++

    console.time(`[${times}] "${ctx.request.url}" prerendered after`)
    try {
      const html = await prerender(ctx.request.url)

      ctx.body = html
      return
    } catch (err) {
      console.error('[prerender error]', err)
      return next()
    } finally {
      console.timeEnd(`[${times}] "${ctx.request.url}" prerendered after`)
    }
  }
})

app.use(
  serve(path.join(__dirname, '../../build'), {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    immutable: true,
    gzip: true
  })
)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
