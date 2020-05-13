# htenv

Use basic auth from environments variables for express.

## Install

```bash
$ npm install --save htenv
```

## Usage

Simple express server :

```javascript
// index.js
const app = require('express')()
const htenv = require('htenv')

app.use(
  htenv({
    /* options */
  })
)

app.get('/', (req, res, next) => {
  res.send('Hello.')
})

app.listen(8080, () => console.log('Server started'))
```

And run with env vars :

```bash
$ HTPASSWD=john:\$apr1\$5lF5WhAG\$SfmLYeIAMTTqSnFrwd1tt0 node index.js # pass is 42
```

You can use many with append random chars :

```bash
$ HTPASSWD=john:\$apr1\$5lF5WhAG\$SfmLYeIAMTTqSnFrwd1tt0 \
  HTPASSWD_1=john2:\$apr1\$5lF5WhAG\$SfmLYeIAMTTqSnFrwd1tt0 \
  HTPASSWD_X=john3:\$apr1\$5lF5WhAG\$SfmLYeIAMTTqSnFrwd1tt0 \
  node index.js
```

**Be carfull with \$ chars** : Add backslash in bash, double it on docker-compose.yml :

```
services:
  app:
    image: node
    command: cd /app && npm run start
    volumes:
      - '.:/app'
    environment:
      HTPASSWD: "john:$$apr1$$5lF5WhAG$$SfmLYeIAMTTqSnFrwd1tt0"
      HTPASSWD_1: "john2:$$apr1$$5lF5WhAG$$SfmLYeIAMTTqSnFrwd1tt0"
      HTPASSWD_X: "john3:$$apr1$$5lF5WhAG$$SfmLYeIAMTTqSnFrwd1tt0"
```

## Options

- `key` (default 'HTPASSWD') : Start of environment variables name
- `realm` (default 'Restricted area') : Message on the popup

```javascript
app.use(
  htenv({
    key: 'MY_CUSTOM_ACCESS',
    realm: 'Who are you ?',
  })
)
```
