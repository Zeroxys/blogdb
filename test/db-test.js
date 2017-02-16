'use strict'

const test = require('ava')
const Db = require('../')
const uuid = require('uuid-base62')
const r = require('rethinkdb')

const DbName = `blog_${uuid.v4()}`
const db = new Db({db: DbName})

test.before('setup database', async function (t){
  await db.connect()
  t.true(db.connected, 'should by connected')
})

test.after('disconnect database', async t => {
  await db.disconnect()
  t.false(db.connected, 'should be disconnect')
})

test.after.always('cleanup database', async t => {
  let conn =  await r.connect({})
  await r.dbDrop(DbName).run(conn)
})

test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'saveImage is function')
})
