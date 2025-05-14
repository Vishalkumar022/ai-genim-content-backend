import { Schema, model } from 'mongoose';

import {User} from './user.model.js'

const aiResponseSchema = new Schema(
  {
    aiResponse: {
      type: String,  
      required: [true, 'AI response is required'],
    },
    templateSlugName: {
      type: String,
      required: [true, 'Template slug name is required'],
      trim: true,
    },
    formData: {
      type: Object,  
      required: [true, 'For data is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,  
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }  
);


export const AIResponse = model('AIResponse', aiResponseSchema);

