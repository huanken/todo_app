import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: createTodoRequest.createdAt,
    done: false
  })
}

export async function updateTodo(updateTodoRequest, todoId, userId) {
  return await todoAccess.updateTodo({
    todoId: todoId,
    userId: userId,
    imageUrl: updateTodoRequest.imageUrl,
    done: updateTodoRequest.done
  })
}

export async function deleteTodo(todoId, userId) {
  return await todoAccess.deleteTodo({
    userId: userId,
    todoId: todoId,
  })
}