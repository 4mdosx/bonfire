import fp from 'fastify-plugin'
import bcrypt from 'bcrypt'
import auth from '@fastify/auth'
import jwt from 'jsonwebtoken'

const saltRounds = 10

export default fp(async function (fastify, opts) {
  async function generateJWT (user) {
    // with 24 hour of expiration
    const token = jwt.sign({ user, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }, opts.secret)
    return token
  }

  const UsersPlugins = {
    async getUser (id) {
      const res = await fastify.pg.query(
        'SELECT id, username, hash, salt FROM users WHERE id=$1',
        [id]
      )
      return res
    },
    async createUser (username, password) {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(password, salt)
      const res = await fastify.pg.query(
        'INSERT INTO users (username, hash) VALUES ($1, $2) RETURNING id, username',
        [username, hash]
      )
      return res
    }
  }
  fastify.decorate('user', UsersPlugins)

  fastify.register(auth)
  fastify.decorate('verifyJWT', function (request, reply, done) {
    const token = request.headers.authorization.replace('Bearer ', '')
    try {
      const decoded = jwt.verify(token, opts.secret)
      request.user = { ...decoded.user, token }
      done()
    } catch (err) {
      done(new Error('Invalid token'))
      return
    }
  })

  fastify.decorate('verifyUserAndPassword', async function (request, reply, done) {
    const { username, password } = request.body
    if (!username || !password) {
      done(new Error('Invalid username or password'))
      return
    }

    const res = await fastify.pg.query(
      'SELECT id, username, hash FROM users WHERE username=$1',
      [username]
    )
    if (res.rows.length === 0) {
      done(new Error('Invalid username or password'))
      return
    }
    const user = res.rows[0]
    const match = await bcrypt.compare(password, user.hash)
    if (!match) {
      done(new Error('Invalid username or password'))
      return
    }
    delete user.hash
    request.user = { ...user, token: await generateJWT(user)  }

    done()
  })
})
