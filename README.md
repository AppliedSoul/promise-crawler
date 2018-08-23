# promise-crawler

Promise support for node-crawler (Web Crawler/Spider for NodeJS + server-side jQuery)   

[![npm package](https://nodei.co/npm/promise-crawler.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/promise-crawler/)</br>

 [![Build Status](https://travis-ci.org/AppliedSoul/promise-crawler.svg?branch=master)](https://travis-ci.org/AppliedSoul/promise-crawler) [![Coverage Status](https://coveralls.io/repos/github/AppliedSoul/promise-crawler/badge.svg?branch=master)](https://coveralls.io/github/AppliedSoul/promise-crawler?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/AppliedSoul/promise-crawler.svg)](https://greenkeeper.io/)</br>

Nodejs library for website crawling using [node-crawler](https://github.com/bda-research/node-crawler) but on bluebird promises.   



#### Install using npm:
```
npm i promise-crawler --save
```

Example:   
```javascript
const PromiseCrawler = require('promise-crawler');
//Initialize with node-crawler options
const crawler = new PromiseCrawler({
  maxConnections: 10,
  retries: 3
});

//perform setup and then use it
crawler.setup().then(() => {
  // makes request with node-crawler queue options
  crawler.request({
    url: 'http://example.com'
  }).then((res) => {
    //server side response parsing using cheerio
    let $ = res.$;
    console.log($("title").text());

    // destroy the instance
    process.nextTick(() => crawler.destroy())
  })
});

```
