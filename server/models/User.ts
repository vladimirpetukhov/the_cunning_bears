import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phoneNumber?: string;
  deliveryAddresses: Array<{
    address: string;
    latitude: number;
    longitude: number;
  }>;
  generateAuthToken(): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Името е задължително'],
    trim: true,
    minlength: [2, 'Името трябва да е поне 2 символа']
  },
  email: {
    type: String,
    required: [true, 'Имейлът е задължителен'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Невалиден имейл адрес']
  },
  password: {
    type: String,
    required: [true, 'Паролата е задължителна'],
    minlength: [6, 'Паролата трябва да е поне 6 символа']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /\d{10}/.test(v);
      },
      message: 'Невалиден телефонен номер'
    }
  },
  deliveryAddresses: [{
    address: String,
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function(): Promise<string> {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  return token;
};

// Compare password
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);