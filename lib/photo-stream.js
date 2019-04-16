/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const examples = express.Router();

const images = require('../public/js/images.json').items;

examples.get('/photos', (req, res) => {
  const {query} = req;
  const items = [];
  const numberOfItems = req.query.items || 100;
  const page = Number(req.query.page) || 0
  const nrOfPages = Math.floor(images.length / 5);
  console.log('nr of pages', nrOfPages)
  console.log('page', page)

  if (nrOfPages < page) { 
    res.json({items: []});
  }

  const imageStartIndex = page * 5;
  for (let i = imageStartIndex; (i < imageStartIndex + 5) && i < images.length; i++) {
    console.log('i', i);
    const image = images[i];
    const r = {
      'title': 'Item ' + i,
      url: image.src,
      width: image.width,
      height: image.height,
    };
    items.push(r);
  }
  console.log('items', items.length)

  const nextUrl = '/photos?items=' +
    numberOfItems + '&page=' + JSON.stringify(page + 1);
  console.log('next url ', nextUrl)

  const next = page > nrOfPages ? false : nextUrl;
  console.log('next page ', next)
  const results = next === false ? {items} : {
    items, 
    'load-more-src': next
  };
  res.json(results);
});

module.exports = examples;
