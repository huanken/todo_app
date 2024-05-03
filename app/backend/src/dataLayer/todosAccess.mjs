import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos() {
    console.log('Getting all todos')

    const result = await this.dynamoDbClient.scan({
      TableName: this.todosTable
    })
    return result.Items
  }

  async createTodo(todo) {
    console.log(`Creating a todo with id ${todo.todoId}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(todo) {
    console.log(`Update image the todo id ${todo.todoId}`)

    if(todo.imageUrl) {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todo.todoId,
        },
        UpdateExpression: "set imageUrl = :imageUrl",
        ExpressionAttributeValues: {
          ":imageUrl": todo.imageUrl,
        },
        ReturnValues: "ALL_NEW",
        Item: todo
      })
    }
    if(todo.done) {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todo.todoId,
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
}
