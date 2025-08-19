const mongoose = require("mongoose")
const todoSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        },
        category: {
            type: String,
            enum: ["여행", "독서", "운동", "기타"],
            default: "기타"
        }
    },
    {
        timestamps: true
    }
)

const Todo = mongoose.model("Bucket", todoSchema)

module.exports = Todo