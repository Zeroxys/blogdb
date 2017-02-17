'use strict'

const uuid = require('uuid-base62')

const fixtures = {
  getImages () {
    return {
      description: 'an #awesome picturo with #tags',
      url: `https://blogs.test/${uuid.v4()}.jpg`,
      likes: 0,
      liked: false,
      user_id: uuid.uuid()
    }
  }
}

module.exports = fixtures
