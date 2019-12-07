const jsdom = require('jsdom')

const { JSDOM } = jsdom

const resourceCache = {}
class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    if (resourceCache[url]) {
      return resourceCache[url]
    }

    console.log(url)

    const promise = super.fetch(url, options)

    resourceCache[url] = promise
    return promise
  }
}

const customResourceLoader = new CustomResourceLoader()

const render = async url => {
  const dom = await JSDOM.fromURL(url, {
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    resources: customResourceLoader
  })

  return new Promise(resolve => {
    const { window } = dom

    const html = dom.serialize()

    resolve(html)

    function shutdown() {
      window.close()
      if (typeof global.gc === 'function') {
        global.gc()
      }
    }

    // // shutdown after readyState turn to 'complete', no Memory leak
    // window.addEventListener('readystatechange', () => {
    //   if (document.readyState === 'complete') {
    //     shutdown()
    //   }
    // })

    // shutdown immediately cause Memory leak
    shutdown()
  })
}

module.exports = render
