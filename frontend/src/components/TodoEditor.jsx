import React, { useState } from 'react'
import './TodoEditor.css'

const categories = ["여행", "독서", "운동", "기타"]

const BucketEditor = ({ onCreate }) => {
  const [text, setText] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [dueDate, setDueDate] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onCreate({ text: text.trim(), category, dueDate })
    setText("")
    setCategory(categories[0])
  }

  return (
    <form className='BucketEditor' onSubmit={onSubmit}>
      <input
        type="text"
        placeholder='새로운 버킷리스트'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type='submit' disabled={!text.trim()}>추가</button>
    </form>
  )
}

export default BucketEditor
