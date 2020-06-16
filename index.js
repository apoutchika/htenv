'use strict'

const Promise = require('bluebird')
const auth = require('basic-auth')
const verify = require('./verify')

const defaultOptions = { key: 'HTPASSWD', realm: 'Restricted area' }

module.exports = (options) => {
  const { key, realm } = {
    ...defaultOptions,
    ...options
  }

  const keyReg = new RegExp('^' + key)

  const access = Object.keys(process.env)
    .filter((key) => key.match(keyReg))
    .reduce((acc, key) => {
      const [user, ...pass] = process.env[key].split(':')
      acc[user] = pass.join(':')
      return acc
    }, {})

  return async (req, res, next) => {
    return new Promise((resolve, reject) => {
      const { name, pass } = auth(req) || {}
      if (verify(pass, access[name])) {
        if (typeof next === 'function') {
          next()
        }
        return resolve(true)
      }

      res.statusCode = 401
      res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
      res.end('Access denied')
      return resolve(false)
    })
  }
}
