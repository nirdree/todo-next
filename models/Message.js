
// ==================== models/Message.js ====================
import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Message content is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Message || mongoose.model('Message', MessageSchema)

