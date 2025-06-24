import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/ 
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Never return password in queries
  },
  profilePicture: {
    type: String,
    default: 'https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/default-profile.png' // Default profile picture path
  },
  progress: {
    completedHouses: {
      type: [Number],
      default: [],
      validate: {
        validator: (arr) => arr.every(num => Number.isInteger(num) && num > 0),
        message: "House IDs must be positive integers"
      }
    },
    unlockedHouses: {
      type: [Number],
      default: [1, 2],
      validate: {
        validator: (arr) => arr.includes(1),
        message: "House 1 must always be unlocked"
      }
    },
    houseProgress: {
      type: Map,
      of: {
        type: Number
      },
      default: {}
    }
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Example virtual for progress percentage
LoginSchema.virtual('progress.overallCompletion').get(function() {
  const totalHouses = 10; // Adjust based on your game
  return (this.progress.completedHouses.length / totalHouses) * 100;
});

export default mongoose.model("User", LoginSchema);