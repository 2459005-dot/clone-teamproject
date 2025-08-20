import React, { useState } from 'react'
import './TodoItem.css'

const categories = ["여행", "독서", "운동", "기타"]

const TodoItem = ({ todo, onUpdateChecked, onUpdateBucket, onDelete }) => {
  if (!todo) return null 

  const isCompleted = !!todo.isCompleted
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo?.text || "")
  const [selectedCategory, setSelectedCategory] = useState(todo?.category || "기타")

  const startEdit = () => {
    setText(todo.text || "")
    setSelectedCategory(todo.category || "기타")
    setEditing(true)
  }

  const cancleEdit = () => {
    setText(todo.text || "")
    setSelectedCategory(todo.category || "기타")
    setEditing(false)
  }

  const saveEdit = async () => {
    const nextText = text.trim()
    if (!nextText) return setEditing(false)

    await onUpdateBucket(todo._id, { text: nextText, category: selectedCategory })
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancleEdit()
  }

  return (
    <div className={`TodoItem ${isCompleted ? 'isCompleted' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onUpdateChecked(todo._id, !todo.isCompleted)}
        readOnly
      />

      {editing ? (
        <div className="edit-wrap">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='수정할 내용 입력'
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="date">{new Date(todo.date).toLocaleDateString()}</div>
          <div className="category">[{editing ? selectedCategory : todo.category}]</div>

          <div className="btn-wrap">
            <button className="updateBtn" onClick={saveEdit}>저장하기</button>
            <button className="deleteBtn" onClick={cancleEdit}>취소</button>
          </div>
        </div>
      ) : (
        <div className="content-wrap">
          <div className='content'>{todo.text}</div>
          <div className='date'>{new Date(todo.date).toLocaleDateString()}</div>
          <div className="category">[{todo.category}]</div>

          <div className="btn-wrap">
            <button className='updateBtn' onClick={startEdit}>수정</button>
            <button className='deleteBtn' onClick={() => onDelete(todo._id)}>삭제</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoItem
