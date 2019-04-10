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
const Mustache = require('mustache')
const port = 8080
const twitter = require('./lib/twitter')
const { join } = require('path')
const { promisify } = require('util')
const { readFile } = require('fs')
const readFileAsync = promisify(readFile)
Mustache.tags = ['[[', ']]']

const agenda = require('./lib/agenda.json')

app.get(['/', '/*.html'], async (req, res) => {
  //const tweets = await twitter.search('#ampconf')
  const tweets = await twitter.search('#dogsoftwitter')
  res.send(
    await render(req.path, {
      title: 'hello world',
      tweets,
      agenda
    })
  )
})

async function render(filePath, context) {
  if (filePath.endsWith('/')) {
    filePath += 'index.html';
  }
  const template = await readFileAsync(
    join(__dirname, 'public', filePath),
    'utf-8'
  )
  console.log('template', template);
  return Mustache.render(template, context)
}

app.use(require('./lib/photo-stream.js'))

app.use(express.static('public'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
