export default async function (fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/kv',
    preHandler: fastify.auth([
      fastify.verifyJWT
    ]),
    handler: async (req, reply) => {
      const user = req.user
      const { rows } = await fastify.pg.query(
        'SELECT * FROM kv WHERE user_id=$1',
        [user.id]
      )
      return { data: rows.map(item => ({ key: item.key, value: item.value })) }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/kv/:key',
    preHandler: fastify.auth([
      fastify.verifyJWT
    ]),
    handler: async (req, reply) => {
      const { rows } = await fastify.pg.query(
        'SELECT * FROM kv WHERE user_id=$1 AND key=$2',
        [req.user.id, req.params.key]
      )
      return { key: req.params.key, value: rows[0].value }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/kv/:key',
    preHandler: fastify.auth([
      fastify.verifyJWT
    ]),
    handler: async (req, reply) => {

      await fastify.pg.query(
        'INSERT INTO kv (user_id, key, value) VALUES ($1, $2, $3) ON CONFLICT (user_id, key) DO UPDATE SET value=EXCLUDED.value',
        [req.user.id, req.params.key, req.body]
      )
      const res = await fastify.pg.query(
        'SELECT * FROM kv WHERE user_id=$1 AND key=$2',
        [req.user.id, req.params.key]
      )
      return { key: req.params.key, value: res.rows[0].value }
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/kv/:key',
    preHandler: fastify.auth([
      fastify.verifyJWT
    ]),
    handler: async (req, reply) => {
      const res = await fastify.pg.query(
        'DELETE FROM kv WHERE user_id=$1 AND key=$2',
        [req.user.id, req.params.key]
      )
      return { key: req.params.key, value: null }
    }
  })
}
