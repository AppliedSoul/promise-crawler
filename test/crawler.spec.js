const PromiseCrawler = require('../index');


describe('Static Crawler Tests', function() {

  const crawler = new PromiseCrawler({
    retries: 0,
    preRequest: function(options, done) {
      // 'options' here is not the 'options' you pass to 'c.queue', instead, it's the options that is going to be passed to 'request' module
      options.prerequestSet = true;
      // when done is called, the request will start
      done();
    }
  });

  it('setup should be fulfilled', function() {
    return crawler.setup().should.eventually.be.fulfilled;
  })

  it('should reject empty requests', function() {
    return crawler.request().should.eventually.be.rejected;
  })

  it('should able to crawl website (https://example.com )', function() {
    return crawler.request({
      url: 'https://bing.com'
    }).then((res) => {
      let $ = res.$;
      return $("title").text();
    }).should.eventually.be.a('string');
  })

  it('should be able to reject if faulty requests are made', function() {
    return crawler.request({
      url: 'http://bingxxxx.comm',
      timeout: 10 * 1000,
      retries: 0
    }).should.eventually.be.rejected;
  })

  it('should able to close the crawler instance', function() {
    return crawler.destroy().should.eventually.be.fulfilled
  })

  it('should able to be created with default options', function() {
    const crawlerNoOpts = new PromiseCrawler();
    return crawlerNoOpts.setup().then(() => {
      return crawlerNoOpts.destroy();
    }).should.eventually.be.fulfilled;
  })
})