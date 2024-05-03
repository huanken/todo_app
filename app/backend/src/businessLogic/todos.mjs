import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export async function getAllTodos() {
  return todoAccess.getAllTodos()
}

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateTodo(updateTodoRequest, todoId) {
  return await todoAccess.updateTodo({
    todoId: todoId,
    imageUrl: updateTodoRequest.imageUrl,
    done: updateTodoRequest.done
  })
}