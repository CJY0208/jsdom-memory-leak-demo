const path = require('path')
const serve = require('koa-static')
const Koa = require('koa')

const render = require('./leak-render')

const staticApp = new Koa()
const staticPort = 5002

staticApp.use(serve(path.join(__dirname, '../../../build')))
staticApp.listen(staticPort, () => {
  console.log(`static app listening on port ${staticPort}`)
})

const prerender = async url =>
  await render(`http://127.0.0.1:${staticPort}${url}`)

module.exports = prerender
