// ==================== models/User.js ====================
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
)

// Hash password before saving - FIXED VERSION
UserSchema.pre('save', async function () {
  console.log('Pre-save hook triggered for User model.')

  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash.')
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 12)
    console.log('Password hashed successfully.')
  } catch (error) {
    console.error('Error hashing password:', error)
    throw error
  }
})


// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model('User', UserSchema)