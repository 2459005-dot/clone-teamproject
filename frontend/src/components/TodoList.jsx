import React from 'react'
import './TodoList.css'
import TodoItem from './TodoItem'

const TodoList = ({todos, onDelete}) => {
  return (
    <div className='TodoList'>
      <h4>Todo List🌱</h4>
      <input type="text" placeholder='검색어를 입력하세요' />
      <div className='todos-wrapper'>
        {todos.map((todo, i)=>(
          <TodoItem 
          key={i} 
          todo={todo}
          onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default TodoList