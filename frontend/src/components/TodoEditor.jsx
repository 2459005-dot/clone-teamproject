import React, { useState } from 'react'
import './TodoEditor.css'

const TodoEditor = ({ onCreate }) => {
  const [text, setText] = useState("")
  const onSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    onCreate(text.trim())
    setText("")
  }
  return (
    <form className='TodoEditor' onSubmit={onSubmit}>
      <input
        type="text"
        placeholder='새로운 Todo'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type='submit' disabled={!text.trim()}>추가</button>
    </form>
  )
}

export default TodoEditor