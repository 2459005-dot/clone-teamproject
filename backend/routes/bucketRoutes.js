const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Bucket = require("../models/bucket")

const ensureObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: '유효하지 않은 아이디' })
        return false
    }
    return true
}

router.post('/', async (req, res) => {
    try {
        const newBucket = new Bucket(req.body)
        const saveBucket = await newBucket.save()
        res.status(201).json(saveBucket)
    } catch (error) {
        res.status(400).json({ error: "저장 실패" })
    }
})

router.get('/', async (req, res) => {
    try {
        const buckets = await Bucket.find().sort({ createdAt: -1 })
        res.status(200).json(buckets)
    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const bucket = await Bucket.findById(id)
        if (!bucket) {
            return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
        }
        res.status(200).json({ message: '불러오기 성공', bucket })
    } catch (error) {
        res.status(400).json({ error: "불러오기 실패" })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const { text, category, dueDate, isCompleted } = req.body;
        
        const updateData = {
            text,
            category,
            ...(dueDate !== undefined && { dueDate }),
            ...(isCompleted !== undefined && { isCompleted })
        };

        console.log("💾 [DB 저장 시도 데이터]:", updateData);

        const updated = await Bucket.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })

        if (!updated) {
            console.log("❌ [업데이트 실패] 해당 ID 없음");
            return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
        }
        
        console.log("✅ [업데이트 성공] 결과:", updated);
        res.status(200).json({ message: "수정 성공", updated })

    } catch (error) {
        console.error("🔥 [서버 에러]:", error)
        res.status(400).json({ error: "수정 실패" })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!ensureObjectId(id, res)) return

        const deleted = await Bucket.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
        }

        const remaining = await Bucket.find().sort({ createdAt: -1 })
        res.status(200).json({
            message: "삭제 성공",
            deleted: deleted._id,
            buckets: remaining
        })
    } catch (error) {
        res.status(400).json({ error: "삭제 실패" })
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

        const updated = await Bucket.findByIdAndUpdate(id, { isCompleted }, {
            new: true,
            runValidators: true,
            context: 'query'
        })

        if (!updated) {
            return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
        }
        res.status(200).json({ message: "수정 성공", bucket: updated })
    } catch (error) {
        res.status(400).json({ error: "수정 실패" })
    }
})

// router.patch('/:id/text', async (req, res) => {
//     try {
//         const { id } = req.params
//         if (!ensureObjectId(id, res)) return

//         const { text } = req.body
//         if (!text || !text.trim()) {
//             return res.status(400).json({ message: 'text는 필수' })
//         }

//         const updated = await Bucket.findByIdAndUpdate(id, { text: text.trim() }, {
//             new: true,
//             runValidators: true,
//             context: 'query'
//         })

//         if (!updated) {
//             return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
//         }
//         res.status(200).json({ message: "수정 성공", bucket: updated })
//     } catch (error) {
//         res.status(400).json({ error: "수정 실패" })
//     }
// })

// router.patch('/:id/category', async (req, res) => {
//     try {
//         const { id } = req.params
//         if (!ensureObjectId(id, res)) return

//         const { category } = req.body
//         const allowedCategories = ["여행", "독서", "운동", "기타"]

//         if (!category || !allowedCategories.includes(category)) {
//             return res.status(400).json({
//                 message: `category는 반드시 ${allowedCategories.join(", ")} 중 하나여야 합니다.`
//             })
//         }

//         const updated = await Bucket.findByIdAndUpdate(
//             id,
//             { category },
//             {
//                 new: true,
//                 runValidators: true,
//                 context: 'query'
//             }
//         )

//         if (!updated) {
//             return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
//         }
//         res.status(200).json({ message: "수정 성공", bucket: updated })
//     } catch (error) {
//         res.status(400).json({ error: "수정 실패" })
//     }
// })

router.patch('/:id', async (req, res) => {
    const { text, category, dueDate } = req.body 
    const updateData = {}

    if (typeof text === 'string') updateData.text = text.trim()
    if (category) updateData.category = category
    
    if (dueDate !== undefined) {
        updateData.dueDate = dueDate; 
    }

    try {
        const updated = await Bucket.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        })

        if (!updated) return res.status(404).json({ message: '해당 아이디의 버킷 없음' })
        res.status(200).json({ bucket: updated })
    } catch (error) {
        res.status(400).json({ error: "수정 실패" })
    }
})

module.exports = router
