import fp from 'fastify-plugin'
import pg from 'pg'
import fastifyPostgres from '@fastify/postgres'

export default fp(async function (fastify, opts) {
  fastify.register(fastifyPostgres, {
    connectionString: 'postgres://postgres:postgres@localhost:5432/navi',
    pg: pg
  })
})
