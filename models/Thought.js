const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const formatDate = require('../utils/date');


// Schema to create a course model
const thoughtSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    inPerson: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: timeStamp => formatDate(timeStamp)
    },
    endDate: {
      type: Date,
      // Sets a default value of 12 weeks from now
      default: () => new Date(+new Date() + 84 * 24 * 60 * 60 * 1000),
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
