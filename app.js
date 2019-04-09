/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const port = 8080
const twitter = require('./lib/twitter')
const { join } = require('path')

app.set('views', join(__dirname, '/public'))
nunjucks.configure(__dirname + '/public', {
  autoescape: true,
  express: app,
  noCache: true,
  tags: {
    blockStart: '[%',
    blockEnd: '%]',
    variableStart: '[[',
    variableEnd: ']]',
    commentStart: '[#',
    commentEnd: '#]'
  }
})

app.get('/', async (req, res) => {
  //const tweets = await twitter.search('#ampconf')
  const tweets = await twitter.search('#dogsoftwitter')
  return res.render('index.html', {
    title: 'Hello World',
    tweets
  })
})

app.use(express.static('public'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
