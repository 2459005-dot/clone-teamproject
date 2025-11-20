const mongoose = require("mongoose")

const bucketSchema = new mongoose.Schema(
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
        },
        dueDate: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Bucket = mongoose.model("Bucket", bucketSchema)

module.exports = Bucket
