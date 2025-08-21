import React, { useState, useMemo } from 'react'
import TodoItem from './TodoItem'
import './TodoList.css'

const TodoList = ({ buckets = [], onUpdateChecked, onUpdateBucket, onDelete }) => {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    if (!kw) return buckets
    return buckets.filter((b) => (b.text ?? "").toLowerCase().includes(kw))
  }, [buckets, q])

  return (
    <div className='TodoList'>
      <h4>Todo List🌱</h4>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='검색어를 입력하세요'
      />
      <div className='todos-wrapper'>
        {filtered.length ? (
          filtered.map((bucket) => (
            <TodoItem
              key={bucket._id}
              bucket={bucket}
              onUpdateChecked={onUpdateChecked}
              onUpdateBucket={onUpdateBucket}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div>등록된 버킷이 없습니다.</div>
        )}
      </div>
    </div>
  )
}

export default TodoList
