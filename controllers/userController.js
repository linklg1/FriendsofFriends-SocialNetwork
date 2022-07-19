const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        
        return res.json(users);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

// Update user 
updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId }, 
    { $set: req.body },
    { new: true, runValidators: true }
  )
      .then((dbUserData) => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'Cannot update user' });
        }
        res.json(dbUserData);
      }) 
      .catch((err) => res.status(400).json(err)
      );
},

  // Delete a user and remove them from the thought
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Course.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'User deleted, but no thoughts found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  

   // Add friend
   addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: params.userId}, 
      { $addToSet: { friends: req.params.friendId } }, 
      { new: true, runValidators: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
},

// Remove friend 
removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: params.userId}, 
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
