import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const newTodo = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId

    const updatedItem = await updateTodo(newTodo, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedItem
      })
    }
  })
