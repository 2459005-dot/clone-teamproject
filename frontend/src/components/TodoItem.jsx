import React, { useState } from 'react'
import './TodoItem.css'

const TodoItem = ({ todo, onUpdateChecked, onUpdateText, onDelete }) => {
  const isCompleted = !!todo.isCompleted
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)

  const startEdit = () => {
    setText(todo.text)
    setEditing(true)
  }

  const cancleEdit = () => {
    setText(todo.text)
    setEditing(false)
  }

  const saveEdit = async () => {
    const next = text.trim()

    if (!next || next === todo.text) return setEditing(false)

    await onUpdateText(todo._id, next)

    setEditing(false)
  }

  const handleKeyDown = () => {
    if (e.key == 'Enter') saveEdit()
    if (e.key == 'Escape') cancleEdit()
  }

  return (
    <div className={`TodoItem ${isCompleted ? 'isCompleted' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onUpdateChecked(todo._id, !todo.isCompleted)}
        readOnly />

      {editing ? (<div className="edit-wrap">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='수정할 내용 입력' />

        <div className="date">{new Date(`${todo.date}`).toLocaleDateString()}</div>
        <div className="btn-wrap">
          <button className="updateBtn" onClick={saveEdit}>저장하기</button>
          <button className="deleteBtn"
            onClick={cancleEdit}
          >취소</button>
        </div>
      </div>
      ) : (
        <div className="content-wrap">
          <div className='content'>{todo.text}</div>
          <div className='date'>{new Date(`${todo.date}`).toLocaleDateString()}</div>
          <div className="btn-wrap">
            <button
              className='updateBtn'
              onClick={startEdit}>수정</button>
            <button
              className='deleteBtn'
              onClick={() => onDelete(todo._id)}>삭제</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default TodoItem