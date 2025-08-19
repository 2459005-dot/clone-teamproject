const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Todo = require("../models/todo")

const ensureObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: '유효하지 않은 아이디' })
        return false
    }
    return true
}

router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo(req.body)

        const saveTodo = await newTodo.save()

        res.status(201).json(saveTodo)

    } catch (error) {
        res.status(400).json({ error: "저장 실패" })
    }
})

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 })

        res.status(201).json(todos)

    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!ensureObjectId(id, res)) return

        const todo = await Todo.findById(id)

        if (!todo) {
            return res.status(400).json({ message: '해당 아이디의 todo가 없음' })
        }

        res.status(201).json({ message: '불러오기 성공', todo })
    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!ensureObjectId(id, res)) return

        const updateData = req.body

        const updated = await Todo.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })

        if (!updated) {
            return res.status(404).json({ message: '해당 아이디의 todo가 없음' })
        }

        res.status(201).json({ message: "수정 성공", updated })

    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!ensureObjectId(id, res)) return

        const deleted = await Todo.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({ message: '해당 아이디의 todo가 없음' })
        }

        const remaining = await Todo.find().sort({ createdAt: -1 })

        res.status(201).json({
            message: "삭제 성공",
            deleted: deleted._id,
            todos: remaining
        })

    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.patch('/:id/check', async (req, res) => {
    try {
        const { id } = req.params

        if (!ensureObjectId(id, res)) return

        const { isCompleted } = req.body

        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: 'isCompleted는 반드시 boolean' })
        }

        const updated = await Todo.findByIdAndUpdate(id, { isCompleted }, {
            new: true,
            runValidators: true,
            context: 'query'
        })

        if (!updated) {
            return res.status(404).json({ message: '해당 아이디의 todo가 없음' })
        }

        res.status(201).json({ message: "수정 성공", todo: updated })

    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.patch('/:id/text', async (req, res) => {
    try {
        const { id } = req.params

        if (!ensureObjectId(id, res)) return

        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'text는 필수' })
        }

        const updated = await Todo.findByIdAndUpdate(id, { text: text.trim() }, {
            new: true,
            runValidators: true,
            context: 'query'
        })

        if (!updated) {
            return res.status(404).json({ message: '해당 아이디의 todo가 없음' })
        }

        res.status(201).json({ message: "수정 성공", todo: updated })

    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.patch('/:id/category', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ensureObjectId(id, res)) return;

        const { category } = req.body;

        const allowedCategories = ["여행", "독서", "운동", "기타"];
        if (!category || !allowedCategories.includes(category)) {
            return res.status(400).json({
                message: `category는 반드시 ${allowedCategories.join(", ")} 중 하나여야 합니다.`
            });
        }

        const updated = await Todo.findByIdAndUpdate(
            id,
            { category },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!updated) {
            return res.status(404).json({ message: '해당 아이디의 todo가 없음' });
        }

        res.status(201).json({ message: "수정 성공", todo: updated });

    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" });
    }
});


module.exports = router