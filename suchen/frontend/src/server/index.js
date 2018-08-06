const Hapi = require('hapi')
const Hoek = require('hoek')
const IndexRoute = require('./routes')
const BooksRoute = require('./routes/books')
const path = require('path')
const server = new Hapi.Server()
const uriPrefix =  process.env.URI_PREFIX || ''

server.connection({
  port: process.env.PORT || 80,
  host: '0.0.0.0',
  router: {
    stripTrailingSlash: true
  }
})


server.register([
  require('vision'),
  require('inert')
], err => {
  Hoek.assert(!err, err)

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views',
    layout: true,
    layoutPath: path.join('views', 'layouts'),
    partialsPath: path.join('views', 'partials'),
    context: {
      uriPrefix: uriPrefix
    }
  })

  server.route(IndexRoute.get(uriPrefix || '/'))
  server.route(BooksRoute.get(`${uriPrefix}/books`))
})

module.exports.start = function () {
  server.start(err => {
    if (err) {
      throw err
    }
    console.log(`Server running at: ${server.info.uri}`)
  })
}
