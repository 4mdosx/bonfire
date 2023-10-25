export default async function (fastify, opts) {
  fastify.get('/light', async function (request, reply) {
    return 'flame 🔥'
  })
}
