import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

export const logger = createLogger('auth')
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function getUserId(authorizationHeader) {

  const split = authorizationHeader.split(' ')
  const jwtToken = split[1]

  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}

