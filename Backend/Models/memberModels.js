/**
 * Member Model Schema
 * 
 * Add this file as: backend/models/Member.js
 * 
 * This defines the database schema for church members
 */

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    surname: {
      type: String,
      required: [true, 'Member surname is required'],
      trim: true,
      minlength: [2, 'Surname must be at least 2 characters']
    },

    // Contact Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Please provide a valid phone number'
      ]
    },

    // Personal Information
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: null
    },
    profileImageUrl: {
      type: String,
      default: null
    },

    // Address Information
    address: {
      street: {
        type: String,
        trim: true,
        default: ''
      },
      city: {
        type: String,
        trim: true,
        default: ''
      },
      state: {
        type: String,
        trim: true,
        default: ''
      },
      zipCode: {
        type: String,
        trim: true,
        default: ''
      }
    },

    // Membership Information
    membershipDate: {
      type: Date,
      required: [true, 'Membership date is required'],
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'visitor'],
      default: 'active'
    },
    baptized: {
      type: Boolean,
      default: false
    },

    // Emergency Contact
    emergencyContactName: {
      type: String,
      trim: true
    },
    emergencyContactPhone: {
      type: String,
      trim: true
    },

    // Additional Information
    notes: {
      type: String,
      trim: true,
      default: ''
    },

    // Department Associations (if applicable)
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      }
    ],

    // Tracking Information
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'members',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields for backwards compatibility with frontend
memberSchema.virtual('firstName').get(function() {
  return this.name;
}).set(function(value) {
  this.name = value;
});

memberSchema.virtual('lastName').get(function() {
  return this.surname;
}).set(function(value) {
  this.surname = value;
});

// Virtual for formatted address
memberSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.zipCode
  ].filter(Boolean);
  return parts.join(', ');
});

// Create index on email for faster queries
memberSchema.index({ email: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ membershipDate: -1 });

module.exports = mongoose.model('Member', memberSchema);
