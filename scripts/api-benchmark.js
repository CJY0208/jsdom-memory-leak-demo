const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const apiBenchmark = require('api-benchmark')
const opener = require('opener')

const service = {
  '5000': 'http://localhost:5000/'
}

const routes = {
  '/': '/'
}

apiBenchmark.measure(
  service,
  routes,
  {
    runMode: 'parallel',
    maxConcurrentRequests: 10,
    maxTime: 1 * 60 * 60,
    minSamples: 1000 // 1000 request
  },
  function(err, results) {
    if (err) {
      console.error('[measure error]', err)
      return
    }

    apiBenchmark.getHtml(results, function(err, html) {
      if (err) {
        console.error('[getHtml error]', err)
        return
      }

      const outputDir = path.join(__dirname, '../../node_modules/.cache/')
      const outputFile = `${outputDir}/ssr-benchmark-res.html`

      mkdirp.sync(outputDir)
      fs.writeFileSync(outputFile, html)

      // opener(outputFile)
    })
  }
)
