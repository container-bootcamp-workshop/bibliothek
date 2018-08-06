var initTracer = require('jaeger-client').initTracer;
const opentracing = require('opentracing');

const flushInterval = 500;

const config = {
  serviceName: 'suchen',
  sampler: {
    type: 'const',
    param: 1,
    refreshIntervalMs: flushInterval,
  },
  reporter: {
    flushIntervalMs: flushInterval,
  },
};

const options = {};

const tracer = initTracer(config, options);


var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ES_URI
});


module.exports.get = function (path) {
  
  return {
    method: 'GET',
    path: path,
    handler: function (req, reply) {

      const parent = tracer.startSpan('suchen start');
      parent.setTag('Such-Pattern', req.query.q);
      const child = tracer.startSpan('suchen ES-Aufruf', { childOf: parent });

      let pattern = req.query.q
      
      child.log({state: 'starte ES query'});
      client.search({
        index: 'library',
        type: 'books',
        q: pattern
      }).then(function (body) {
        child.log({state: 'es query beendet'});
        child.log({'event': 'data_received', 'hits': body.hits.hits.length});
        child.finish();

        var hits = body.hits.hits;
        var rs = hits.map(hit => hit._source)
        reply.view('books', {
             title: 'Books',
             books: rs
          })
        parent.finish();
      }, function (error) {
        console.trace(error.message);
        child.setTag(opentracing.Tags.ERROR, true);
        child.log({'event': 'error', 'error.object': error, 'message': error.message, 'stack': error.stack});
        child.finish();
      });
    }
  }
}
