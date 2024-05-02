import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export async function getAllTodos() {
  return todoAccess.getAllTodos()
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    id: itemId,
    userId: userId,
    name: createTodoRequest.name,
    description: createTodoRequest.description
  })
}
