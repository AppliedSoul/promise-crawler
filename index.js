const Crawler = require('crawler');
const Promise = require('bluebird');
const _ = require('lodash');

/**
 * StaticCrawler - Based on node-crawler
 * Its a wrapper supporting promised based API
 */
class StaticCrawler {
  /**
   * Constructor - Initialize the Static Crawler
   * with crawler options .
   *
   * Crawler will not be ready until the setup() method
   * resolves the promise
   *
   * Usage:
   *  const crawler = new StaticCrawler(opts);
   *
   * crawler.setup().then(() => {
   *
   *   // make requests
   *   request(options).then((result) => {
   *        //do something good with the result.
   *   })
   * })
   *
   * See [new Crawler(options)]
   *
   * Note:
   * PreRequest option is modified to supported to not calling the callback
   * - This is to make it consistent with Dynamic Crawler api
   *
   * (https://github.com/bda-research/node-crawler)
   * @param {Object} [options={}] Crawler general options
   */
  constructor(options = {}) {
    this.options = options;
    this.crawler = null;
  }

  /**
   * setup - will initialize underlying node-crawler instance
   * Options can either be passed at initialization or setup
   * @param  {Object} [options={}] Crawler general options
   * @return {Promise}              To be resolved with underlying crawler instance
   */
  setup(options = {}) {
    this.options = _.extend(this.options, options);
    let preReqFn = this.options.preRequest;
    //TODO : Log error messages
    if (_.isFunction(preReqFn)) {
      this.options.preRequest = (opts, cb) => Promise.resolve(preReqFn(opts, () => {})).catch(e => {}).finally(cb)
    }

    this.options.callback = function(error, response, callback) {
      process.nextTick(callback);
      if (error) {
        error.options = response.options;
        error.options.npolisReject(error);
      } else {
        response.options.npolisResolve(response);
      }
    };
    /*
      No need to be aggressive
    this.crawler = _.attempt(() => new Crawler(this.options))
    return _.isError(this.crawler) ? Promise.reject(this.crawler) : Promise.resolve(this.crawler);
    */
    this.crawler = new Crawler(this.options);
    return Promise.resolve(this.crawler);
  }

  /**
   * request - Its promise version of crawler.queue
   * See [crawler.queue(options)]
   * (https://github.com/yujiosaka/headless-chrome-crawler/blob/master/docs/API.md)
   * @param  {Object} [options={}] HCCrawler.queue options passed
   * when making requests
   * @return {Promise}              Promise holding either result or error object
   */
  request(options = {}) {
    return new Promise((resolve, reject) => {
      options.npolisResolve = resolve;
      options.npolisReject = reject;
      this.crawler.queue(options);
    });
  }

  /**
   * destroy Empty STUB
   * TODO implement destroy of static crawler to release all queue'd tasks.
   * @return {Promise} To be resolved when resources used up by
   * crawler are released.
   */
  destroy() {
    return Promise.resolve();
  }

}


/**
 * exports Static Crawler class
 * @type {StaticCrawler}
 */
module.exports = StaticCrawler;