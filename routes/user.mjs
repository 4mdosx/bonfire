export default async function (fastify, opts) {
  fastify.post('/user', async function (request, reply) {
    const { username, password } = request.body
    const res = await fastify.user.createUser(username, password)
    return res.rows[0]
  })


  fastify.route({
    method: 'POST',
    url: '/user/login',
    preHandler: fastify.auth([
      fastify.verifyUserAndPassword
    ]),
    handler: (req, reply) => {
      return {
        ...req.user,
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/user/me',
    preHandler: fastify.auth([
      fastify.verifyJWT
    ]),
    handler: (req, reply) => {
      return {
        user: req.user
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/user/:id',
    preHandler: fastify.auth([
      fastify.verifyJWT
    ]),
    handler: async (req, reply) => {
      const { rows } = await fastify.pg.query(
        'SELECT id, username FROM users WHERE id=$1',
        [request.params.id]
      )
      return rows[0]
    }
  })
}
