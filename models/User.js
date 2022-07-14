const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      max_length: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, "Invalid email provided"],
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'thought'
  }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
  }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);
userSchema.virtuals("friendCount").get(function(){
  return this.friends.length;
})
const User = model('user', userSchema);

module.exports = User;
