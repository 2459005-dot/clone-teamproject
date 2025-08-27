import React, { useState, useEffect } from 'react'
import './TodoItem.css'

const categories = ["여행", "독서", "운동", "기타"]

const TodoItem = ({ bucket, onUpdateChecked, onUpdateBucket, onDelete }) => {
  if (!bucket) return null

  const isCompleted = !!bucket.isCompleted
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(bucket?.text || "")
  const [selectedCategory, setSelectedCategory] = useState(bucket?.category || "기타")
  const [dueDate, setDueDate] = useState(bucket?.dueDate ? bucket.dueDate.split("T")[0] : "")

  // ✅ bucket이 변경될 때 로컬 state도 동기화
  useEffect(() => {
    setText(bucket?.text || "")
    setSelectedCategory(bucket?.category || "기타")
  }, [bucket])

  const startEdit = () => {
    setEditing(true)
  }

  const cancleEdit = () => {
    setEditing(false)
  }

  const saveEdit = async () => {
    const nextText = text.trim()
    if (!nextText) return setEditing(false)

    await onUpdateBucket(bucket._id, {
      text: nextText,
      category: selectedCategory,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    })
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancleEdit()
  }

  const getDDay = (targetDate) => {
    if (!targetDate) return null
    const today = new Date()
    const dday = new Date(targetDate)
    const diff = Math.ceil((dday - today) / (1000 * 60 * 60 * 24))
    if (diff > 0) return `D-${diff}`
    if (diff === 0) return "D-Day!"
    return `D+${Math.abs(diff)}`
  }

  const getDDayLabel = (dueDate) => {
    if (!dueDate) return "";

    const today = new Date();
    const target = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "D-Day";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  };

  return (
    <div className={`TodoItem ${isCompleted ? 'isCompleted' : ''}`}>
      <input
        type="checkbox"
        checked={bucket.isCompleted}
        onChange={() => onUpdateChecked(bucket._id, !bucket.isCompleted)}
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

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="date">{new Date(bucket.date).toLocaleDateString()}</div>
          <div className="category">[{selectedCategory}]</div>
          <div className="dday">
            {dueDate && (
              <span
                className={`dday ${getDDay(dueDate)?.includes("D-") ? "future" :
                  getDDay(dueDate) === "D-Day!" ? "today" : "past"}`}
              >
                {getDDay(dueDate)}
              </span>
            )}
          </div>

          <div className="btn-wrap">
            <button className="updateBtn" onClick={saveEdit}>저장하기</button>
            <button className="deleteBtn" onClick={cancleEdit}>취소</button>
          </div>
        </div>
      ) : (
        <div className="content-wrap">
          {bucket.dueDate && <div className="dday">{getDDay(bucket.dueDate)}</div>}
          <div className='content'>{bucket.text}</div>
          <div className='date'>등록일자 : {new Date(bucket.date).toLocaleDateString()}</div>
          <div className="category">[{bucket.category}]</div>

          <div className="btn-wrap">
            <button className='updateBtn' onClick={startEdit}>수정</button>
            <button className="deleteBtn" onClick={() => onDelete(bucket._id)}>삭제</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoItem
