'use strict'

const r = require('rethinkdb')
const co = require('co') // nos permite usar functions generators para devolver un promise
const Promise = require('bluebird') // Sobreescribimos la clase promise nativa de js para utilizar
//bluebird

const defaults = {
  host: 'localhost',
  port: '28015',
  db: 'blog'
}

//importamos la funcionalidad de conexion a la db
class Db {

  constructor (options) {
    options = options || {}
    this.host = options.host || defaults.host
    this.port = options.port || defaults.port
    this.db = options.db || defaults.db
  }

  //Connect recibe un promise, necesitamos algo parecido a async/await para
  //devolver una promesa de forma secuencial. (co)
  connect (callback) {
    this.connection = r.connect({
      host: this.host,
      port:this.port
    })

    //hacemos las referencias a la db
    let db = this.db
    let connection = this.connection

    //Series de funciones que correran en una co rutina
    //funcion generadora sobre co, que devuelve una promesa
    let setup = co.wrap(function* () {
      let conn = yield connection // referencia de la conexion a la db

      let dbList = yield r.dbList().run(conn)
      if (dbList.indexOf(db) === -1) {
        yield r.dbCreate(db).run(conn)
      }

      let dbTables = yield r.db(db).tableList().run(conn) // Creamos las tablas de la db

      if (dbTables.indexOf('images') === -1) {
        yield r.db(db).tableCreate('images').run(conn)
      }

      if (dbTables.indexOf('blogs') === -1) {
        yield r.db(db).tableCreate('blogs').run(conn)
      }

      return conn

    })

    return Promise.resolve(setup()).asCallback(callback)

  }
}

module.exports = Db
