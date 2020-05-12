'use strict'

const auth = require('basic-auth')
const verify = require('./verify')

const defaultOptions = { key: 'HTACCESS', realm: 'Restricted area' }

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

  return (req, res, next) => {
    const { name, pass } = auth(req) || {}
    if (verify(pass, access[name])) {
      return next()
    }

    res.statusCode = 401
    res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
    res.end('Access denied')
  }
}
