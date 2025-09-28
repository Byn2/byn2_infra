import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';

const userSchema = new mongoose.Schema<IUser>(
  {
    image: { type: String, default: '' },
    name: {
      type: String,
      required: [true, 'Name is required'],
      index: true,
    },
    tag: {
      type: String,
      unique: true,
      index: true,
    },
    mobile_number: {
      type: String,
      unique: true,
      required: [true, 'Mobile number is required'],
    },
    password: {
      type: String,
      required: function () {
        return this.auth_provider === 'local';
      },

      default: null, // allow password to be null for external providers
    },
    auth_provider: {
      type: String,
      required: true,
      enum: ['local', 'custom', 'google', 'facebook'],
      default: 'local',
    },
    currency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: [true, 'Currency ID is required'],
    },
    mobile_verified_at: { type: Date, default: null },
    mobile_verify_code: { type: Number, default: 0 },
    mobile_attempts_left: { type: Number, default: 4 },
    mobile_last_attempt_date: { type: Date, default: null },
    mobile_verify_code_sent_at: { type: Date, default: null },
    mobile_kyc_verified_at: { type: Date, default: null },
    rememberToken: { type: String, default: null },
    fcm_token: { type: String, default: '' },

    // 🆕 Account deletion-related fields
    account_deletion_requested: { type: Boolean, default: false },
    deletion_requested_at: { type: Date, default: null },
    deletion_scheduled_at: { type: Date, default: null },
    deletion_completed_at: { type: Date, default: null },
    under_investigation: { type: Boolean, default: false },

    is_business: { type: Boolean, default: false }, // Marks account as business
    business_verified_at: { type: Date, default: null },

    business_category: { type: String, default: '' }, // e.g., Restaurant, Fashion
    business_description: { type: String, default: '' },
    business_website: { type: String, default: '' },
    accepts_payments: { type: Boolean, default: false },
    default_payment_note: { type: String, default: '' },

    //bot
    bot_token: { type: String, default: '' },
    bot_session: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  const user = this as IUser;

  // Skip password hashing if it's not provided (e.g., Google/Facebook signups)
  if (user.isModified('password') && user.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  // Generate a unique tag from the user's name
  if (user.isModified('name')) {
    let baseTag = slugify(user.name, { lower: true, strict: true });
    let tag = baseTag;
    let count = 1;

    // Ensure uniqueness
    while (await mongoose.models.User.exists({ tag })) {
      tag = `${baseTag}-${count}`;
      count++;
    }

    user.tag = tag;
  }

  next();
});

// userSchema.pre('save', async function (next) {
//   const user = this;

//   // Skip password hashing if it's not provided (e.g., Google/Facebook signups)
//   if (!user.isModified('password') || !user.password) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// });

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
