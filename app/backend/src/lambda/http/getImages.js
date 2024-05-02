import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE
const imagesTable = process.env.IMAGES_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Caller event', event)
    const todoId = event.pathParameters.todoId

    const validTodoId = await todoExists(todoId)

    if (!validTodoId) {
      throw createError(
        404,
        JSON.stringify({
          error: 'Todo does not exist'
        })
      )
    }

    const images = await getImagesPerTodo(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        items: images
      })
    }
  })

async function todoExists(todoId) {
  const result = await dynamoDbDocument.get({
    TableName: todosTable,
    Key: {
      id: todoId
    }
  })

  console.log('Get todo: ', result)
  return !!result.Item
}

async function getImagesPerTodo(todoId) {
  const result = await dynamoDbDocument.query({
    TableName: imagesTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    },
    ScanIndexForward: false
  })

  return result.Items
}
