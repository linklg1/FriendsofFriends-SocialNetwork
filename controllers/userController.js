const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
const thoughtController = require('./thoughtController');

module.exports = {

 // create a new user
 createUser(req, res) {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
},
// Get all users
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .then(users => res.json(users))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .populate({ path: 'thoughts', select: '-__v' })
    .populate({ path: 'friends', select: '-__v' })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
 

// Update user 
updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId }, 
    { $set: req.body },
    { new: true, runValidators: true }
  )
      .then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'Cannot update user' });
        }
        res.json(user);
      }) 
      .catch((err) => res.status(400).json(err)
      );
},

  // Delete a user and remove them from the thought
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  

   // Add friend
   addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId}, 
      { $push: { friends: req.params.friendId } }, 
      { new: true, runValidators: true }
    )
      .then(user => res.json(user))
      .catch((err) => res.status(400).json(err));
},

// Remove friend 
removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId}, 
      { $pull: { friends: req.params.friendId} },
      { runValidators: true, new: true}
    )
    .then((user) => {
      if (!user) {
          return res.status(404).json({ message: 'User with this ID does not exist.' });
      }
      res.json(user);
  })
  .catch((err) => res.status(500).json(err));
}
};
