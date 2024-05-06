import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils/utils.mjs'
import { getAllTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../utils/logger.mjs'
const logger = createLogger('todos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    logger.info('Processing event: ', event)
    
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    const todos = await getAllTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  })
