import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils/utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
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

    const newTodo = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    const updatedItem = await updateTodo(newTodo, todoId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedItem
      })
    }
  })
