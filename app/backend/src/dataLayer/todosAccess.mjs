import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../lambda/utils/logger.mjs'
const logger = createLogger('todoAccess')

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    imagesTable = process.env.IMAGES_TABLE,
    createdAtIndex = process.env.TODOS_CREATED_AT_INDEX,
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.imagesTable = imagesTable
    this.createdAtIndex = createdAtIndex
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos(userId) {
    console.log('Getting all todos')
    logger.info('Getting all todos')

    const result = await this.dynamoDbClient
      .query({
        TableName: this.todosTable,
        IndexName: this.createdAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
    return result.Items
  }

  async createTodo(todo) {
    console.log(`Creating a todo with id ${todo.todoId}`)
    logger.info(`Creating a todo with id ${todo.todoId}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(todo) {
    console.log(`Update image the todo id ${todo.todoId}`)
    logger.info(`Update image the todo id ${todo.todoId}`)

    if (todo.imageUrl) {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todo.todoId,
          userId: todo.userId
        },
        UpdateExpression: "set imageUrl = :imageUrl",
        ExpressionAttributeValues: {
          ":imageUrl": todo.imageUrl,
        },
        ReturnValues: "ALL_NEW",
        Item: todo
      })
    }
    if (todo.done) {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todo.todoId,
          userId: todo.userId
        },
        UpdateExpression: "set done = :done",
        ExpressionAttributeValues: {
          ":done": todo.done,
        },
        ReturnValues: "NONE",
        Item: todo
      })
    }

    return todo
  }

  async deleteTodo(todo) {
    console.log(`Deleting a todo with id ${todo.todoId}`)
    logger.info(`Deleting a todo with id ${todo.todoId}`)

    await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId: todo.todoId,
        userId: todo.userId,
      }
    })
    await this.dynamoDbClient.delete({
      TableName: this.imagesTable,
      Key: {
        todoId: todo.todoId
      },
      ConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todo.todoId
      }
    })
  }
}
