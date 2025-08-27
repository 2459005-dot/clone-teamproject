import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Header from './components/Header'
import TodoEditor from './components/TodoEditor'
import TodoList from './components/TodoList'

function App() {

  const [buckets, setBuckets] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/buckets`
  const [mode, setMode] = useState("light")

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const res = await axios.get(API)
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.buckets ?? []

        setBuckets(data)
      } catch (error) {
        console.log('가져오기 실패', error)
      }
    }
    fetchBuckets()
  }, [])

  useEffect(() => {
    document.body.className = mode;
  }, [mode])


  const onCreate = async ({ text, category, dueDate }) => {
    console.log("📦 새로 생성 요청:", { text, category, dueDate })
    if (!text.trim()) return
    try {
      const res = await axios.post(API, { text: text.trim(), category, dueDate })

      const created = res.data?.bucket ?? res.data

      setBuckets(prev => [created, ...prev])
    } catch (error) {
      console.error('추가 실패', error)
    }
  }

  const onDelete = async (id) => {
    try {
      if (!confirm("정말 삭제할까요?")) return

      const { data } = await axios.delete(`${API}/${id}`)

      console.log(data)
      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets)
        return
      }

      const deletedId = data?.deletedId ?? data?.bucket?._id ?? data?._id ?? id
      setBuckets((prev) => prev.filter((b) => b._id !== deletedId))

    } catch (error) {
      console.error("삭제 실패", error)
    }
  }

  const onUpdateChecked = async (id, next) => {
    try {
      const { data } = await axios.patch(`${API}/${id}/check`,
        { isCompleted: next }
      )

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets)
      } else {
        const updated = data?.bucket ?? data
        setBuckets(prev =>
          prev.map(b => (b._id === updated._id ? updated : b))
        )
      }

    } catch (error) {
      console.error('업데이트 실패', error)
    }
  }

  const onUpdateBucket = async (id, { text, category, dueDate }) => {
    const nextText = text?.trim()
    if (!nextText) return

    try {
      const res = await axios.put(`${API}/${id}`, { text: nextText, category, dueDate })

      const updated = res.data.updated ?? res.data.bucket ?? res.data

      setBuckets(prev =>
        prev.map(b => (b._id === updated._id ? updated : b))
      )

      return updated

    } catch (err) {
      console.error('업데이트 실패', err)
    }
  }

  return (
    <div className={`App ${mode}`}>
      <Header />
      <div style={{ textAlign: "right", padding: "10px" }}>
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          {mode === "light" ? "🌙 다크모드" : "🌞 라이트모드"}
        </button>
      </div>
      <TodoEditor onCreate={onCreate} />
      <TodoList
        buckets={buckets}
        onUpdateChecked={onUpdateChecked}
        onUpdateBucket={onUpdateBucket}
        onDelete={onDelete}
      />
    </div>
  )
}

export default App
