import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonalityAnswer {
  questionNumber: number;
  answer: number; // 1 to 5 scale
}

export interface IPhoto {
  url: string;
  publicId?: string;
  isMain: boolean;
}

export interface ILifestyle {
  smoking?: 'Never' | 'Occasionally' | 'Regularly';
  drinking?: 'Never' | 'Socially' | 'Regularly';
  exercise?: 'Never' | 'Sometimes' | 'Often' | 'Daily';
  diet?: 'Anything' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Halal';
  pets?: 'None' | 'Cat' | 'Dog' | 'Both' | 'Lover';
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  snapchat?: string;
  whatsapp?: string;
}

export interface IPreferences {
  minAge: number;
  maxAge: number;
  gender: string[];
  maxDistanceKm: number;
  relationshipType: string[];
  interests: mongoose.Types.ObjectId[];
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio?: string;
  dob?: Date;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  height?: number; // in cm
  education?: string;
  occupation?: string;
  city?: string;
  country?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  religion?: string;
  relationshipGoal?: 'Long-term' | 'Casual' | 'Friendship' | 'Marriage';
  lifestyle: ILifestyle;
  socialLinks?: ISocialLinks;
  isPremium: boolean;
  membershipTier: 'Free' | 'Gold' | 'VIP';
  personalityAnswers: IPersonalityAnswer[];
  interests: mongoose.Types.ObjectId[];
  preferences: IPreferences;
  photos: IPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema<IProfile> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
      default: 24,
      index: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary', 'Other'],
      required: true,
      default: 'Male',
      index: true,
    },
    height: {
      type: Number,
      default: 170,
    },
    education: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
      index: true,
    },
    country: {
      type: String,
      default: '',
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [-74.006, 40.7128],
      },
    },
    religion: {
      type: String,
      default: '',
    },
    relationshipGoal: {
      type: String,
      enum: ['Long-term', 'Casual', 'Friendship', 'Marriage'],
      default: 'Long-term',
    },
    lifestyle: {
      smoking: { type: String, enum: ['Never', 'Occasionally', 'Regularly'] },
      drinking: { type: String, enum: ['Never', 'Socially', 'Regularly'] },
      exercise: { type: String, enum: ['Never', 'Sometimes', 'Often', 'Daily'] },
      diet: { type: String, enum: ['Anything', 'Vegetarian', 'Vegan', 'Keto', 'Halal'] },
      pets: { type: String, enum: ['None', 'Cat', 'Dog', 'Both', 'Lover'] },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      snapchat: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipTier: {
      type: String,
      enum: ['Free', 'Gold', 'VIP'],
      default: 'Free',
    },
    personalityAnswers: [
      {
        questionNumber: { type: Number, required: true },
        answer: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    interests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Interest',
        index: true,
      },
    ],
    preferences: {
      minAge: { type: Number, default: 18 },
      maxAge: { type: Number, default: 50 },
      gender: [{ type: String, default: ['Female'] }],
      maxDistanceKm: { type: Number, default: 100 },
      relationshipType: [{ type: String, default: ['Long-term'] }],
      interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        isMain: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

ProfileSchema.index({ location: '2dsphere' });

/**
 * Helper function to calculate exact Profile Completion Percentage (0 to 100%)
 */
export function computeProfileCompletion(profile: IProfile): {
  percentage: number;
  isComplete: boolean;
  missingSections: string[];
} {
  const missingSections: string[] = [];

  // 1. Basic Info & City/Country (20%)
  let basicScore = 0;
  if (profile.bio && profile.bio.trim().length > 10) basicScore += 5;
  else missingSections.push('Write a bio/story (at least 10 characters)');

  if (profile.city && profile.country) basicScore += 5;
  else missingSections.push('Specify your City and Country');

  if (profile.occupation && profile.education) basicScore += 5;
  else missingSections.push('Add your Occupation and Education');

  if (profile.age >= 18 && profile.gender) basicScore += 5;

  // 2. Lifestyle Choices (20%) - Must choose all 5 manually
  let lifestyleScore = 0;
  const l = profile.lifestyle || {};
  if (l.smoking && l.drinking && l.exercise && l.diet && l.pets) {
    lifestyleScore = 20;
  } else {
    missingSections.push('Select all 5 Lifestyle Attributes (Smoking, Drinking, Exercise, Diet, Pets)');
  }

  // 3. Photos (15%)
  let photoScore = 0;
  if (profile.photos && profile.photos.length >= 1) {
    photoScore = 15;
  } else {
    missingSections.push('Upload at least 1 Profile Photo');
  }

  // 4. World Hobbies / Interests (20%)
  let hobbiesScore = 0;
  if (profile.interests && profile.interests.length >= 3) {
    hobbiesScore = 20;
  } else {
    missingSections.push('Select at least 3 World Hobbies/Interests');
  }

  // 5. 50 Personality Questions (25%)
  let personalityScore = 0;
  if (profile.personalityAnswers && profile.personalityAnswers.length >= 50) {
    personalityScore = 25;
  } else {
    const remaining = 50 - (profile.personalityAnswers?.length || 0);
    missingSections.push(`Answer all 50 Personality Questions (${remaining} remaining)`);
  }

  const percentage = Math.min(100, basicScore + lifestyleScore + photoScore + hobbiesScore + personalityScore);
  const isComplete = percentage === 100;

  return {
    percentage,
    isComplete,
    missingSections,
  };
}

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
