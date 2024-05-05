import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'
const logger = createLogger('auth')
const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJbJHjUQK+X6kYMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1obTJwcTFtZjB2YWszeGhyLnVzLmF1dGgwLmNvbTAeFw0yNDA1MDIx
MzQ1MjFaFw0zODAxMDkxMzQ1MjFaMCwxKjAoBgNVBAMTIWRldi1obTJwcTFtZjB2
YWszeGhyLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMWVTI04jKryDqsGgJHgLrOQ86JDurxOh77EHpqM4LRYGya1iJIp69iogTv6
vNoOyiN+cS32SI/y6hfbMEFz8ZD0s9DUKbbZ1qGjkoevleNeyKpsCTWDELkV4yI8
xD7N24zj7keVdlhdLvxcc9rygvrpms0vNUWSuKeXV7NRp6YdDAg2Gn/iEYNjrKA3
c4QtBNEFUMRGsyFdbvKQa138CP4Ogat+/P6PcZI+4RvWz7sMcOepcqWI9DLVbteY
CUjvAE1z+9Cf45mHk9SDzuVx2VMF4dOkv62RXiz4IqbQpmVVWgeovBjTs7TosItN
I4n4Qrj3CaN5OhWCSzB6+WHZVycCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUz7IYiSzC9ulJn2NqGh9mOl8ASo8wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBfSBWLataCpNGaK1AS5rN3oxt1+0IqKDGkKeKhmVCo
i3tL1e5LFdXjLTcItibJQjz872m7ytgYoDULaxoQWsoKNYSrBNwxjzg/VWX/Fehe
0N9QLxSZM99aLOyt0P886KiXRHtfJLczoex4twAB8EsDi5wREJcuJ+PyWGXqqght
rIwJsz6hiTyHeEv5h/EzrxN0llYHjmRKg+tz3V2ktfsR79dwr910xjp5PSCz4fWE
9DkTkugY7UhajooNhTRIj+HhkWokiqx9AzLBeu2D8Z4F8SDJW+sSfXVHEkoA3gmO
0mTibaiGjvhXFiO/6JBr1/qf7M5KEFEt1bM4aED2gmRu
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    logger.info('User was authorized', {
      jwtToken: jwtToken
    })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.info('User was not authorized', {
      message: e.message
    })
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authorization header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authorization header')

  const split = authHeader.split(' ')
  const token = split[1]

  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}
