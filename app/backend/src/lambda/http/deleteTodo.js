import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils/utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    await deleteTodo(todoId, userId)

    return {
      statusCode: 200,
    }
  })