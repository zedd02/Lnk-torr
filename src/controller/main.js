'use strict'

var express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var Path = require('path')

var Log = require(Path.join(__workingDir, 'worker/log.js'))
var LogWorker = new Log({
  module: 'Server'
})

/**
 * Deserve http requests.
 * @constructor
*/
class Server {
  constructor (id) {
    this.app = express()
    this.app.use(compression())
    this.app.use(cookieParser())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({
      extended: true
    }))

    this.app.use(require(Path.join(__workingDir, 'controller/auth.js')))
    this.app.use(require(Path.join(__workingDir, 'controller/config.js')))
    this.app.use(require(Path.join(__workingDir, 'controller/filetransfert')))
    this.app.use(require(Path.join(__workingDir, 'controller/torrent')))
    this.app.use(require(Path.join(__workingDir, 'controller/directory')))
    this.app.use(require(Path.join(__workingDir, 'controller/logs')))

    this.app.use(express.static(Path.join(__workingDir, 'public')))

    var port = process.env.PORT || __config.server.port
    this.app.listen(port, () => {
      LogWorker.info(`Server ${id} listening at port ${port}`)
    })
  }
}

module.exports = Server