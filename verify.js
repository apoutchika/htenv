'use strict'

const crypt = require('apache-crypt')
const md5 = require('apache-md5')

function verifycrypt (userpass, pass) {
  return crypt(userpass, pass) === pass
}

function verifymd5 (userpass, pass) {
  return md5(userpass, pass) === pass
}

function verify (userpass, pass) {
  if (!userpass || typeof userpass !== 'string') {
    return false
  }

  if (!pass || typeof pass !== 'string') {
    return false
  }

  if (pass.match(/^\$apr1\$/)) {
    return verifymd5(userpass, pass)
  }

  return verifycrypt(userpass, pass)
}

module.exports = verify
