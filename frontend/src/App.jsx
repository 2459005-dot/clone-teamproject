import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Header from './components/Header'
import TodoEditor from './components/TodoEditor'
import TodoList from './components/TodoList'


function App() {

  const [todos, setTodos] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/todos`

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API)
        const data = Array.isArray(res.data) ?
          res.data : res.data.todos ?? []

        setTodos(data)
        // console.log(data)
      } catch (error) {
        console.log('가져오기 실패', error)
      }
    }
    fetchTodos()
  }, [])

  const onCreate = async (todoText) => {
    if (!todoText.trim()) return
    try {
      const res = await axios.post(API, { text: todoText.trim() })

      const created = res.data?.todo ?? res.data

      if (Array.isArray(res.data?.todos)) {
        setTodos(res.data.todos)
      } else {
        setTodos(prev => [created, ...prev])
      }
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

  return (
    <div className='App'>
      <Header />
      <TodoEditor onCreate={onCreate} />
      <TodoList todos={todos} onDelete={onDelete} />
    </div>
  )
}

export default App
