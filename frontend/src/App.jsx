import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Header from './components/Header'
import TodoEditor from './components/TodoEditor'
import TodoList from './components/TodoList'


function App() {

  const [todos, setTodos] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/buckets`

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API)
        const data = Array.isArray(res.data) ?
          res.data : res.data.todos ?? []

        setTodos(data)
      } catch (error) {
        console.log('가져오기 실패', error)
      }
    }
    fetchTodos()
  }, [])

  const onCreate = async ({ text, category }) => {
    if (!text.trim()) return
    try {
      const res = await axios.post(API, { text: text.trim(), category })

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
      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
        return
      }

      const deletedId = data?.deletedId ?? data?.todo?._id ?? data?._id ?? id
      setTodos((prev) => prev.filter((t) => t._id !== deletedId))

    } catch (error) {
      console.error("삭제 실패", error)
    }
  }

  const onUpdateChecked = async (id, next) => {
    try {
      const { data } = await axios.patch(`${API}/${id}/check`,
        {
          isCompleted: next
        }
      )

      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
      } else {
        const updated = data?.todo ?? data;
        setTodos(
          prev => prev.map(t => (t._id === updated._id ? updated : t))
        )
      }

    } catch (error) {
      console.error('업데이트 실패', error)
    }
  }

  const onUpdateBucket = async (id, { text, category }) => {

    const nextText = text?.trim();

    if (!nextText) return;

    try {
      const res = await axios.put(`/api/buckets/${id}`, { text: nextText, category });

      const updated = res.data.bucket ?? res.data;

      setBuckets(prev => prev.map(b => (b._id === updated._id ? updated : b)));

    } catch (err) {
      console.error('업데이트 실패', err);
    }
  };

  return (
    <div className='App'>
      <Header />
      <TodoEditor
        onCreate={onCreate} />
      <TodoList
        todos={Array.isArray(todos) ? todos : []}
        onUpdateChecked={onUpdateChecked}
        onUpdateBucket={onUpdateBucket}
        onDelete={onDelete} />
    </div>
  )
}

export default App
