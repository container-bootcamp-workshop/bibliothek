module.exports.get = function (path) {
  return {
    method: 'GET',
    path: path,
    handler: function (req, reply) {
      reply.view('index', {title: 'Kubernetes Bootcamp'})
    }
  }
}
