const { Thought, User } = require('../models');

module.exports = { 
 // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought created, but found no user with that ID',
            })
          : res.json('Created the thought🎉')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// Get all thoughts
getThoughts(req, res) {
  Thought.find()
    .select('-__v')
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err));
},

// Get one thought
getSingleThought(req, res) {
  Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},
  
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
// Add a reaction to a user
addReaction(req, res) {
  console.log('You are adding a reaction');
  console.log(req.body);
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .select('-__v')
    .populate({path: 'reactions', select: '-__v'})
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No user found with that ID :(' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},
// Remove reaction from a user
removeReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No user found with that ID :(' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},



// Delete a thought and pull it from the user
deleteThought(req, res) {
  Thought.findOneAndRemove({ _id: req.params.thoughtID })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought found with this ID!' })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtID },
            { $pull: { thoughts: req.params.thoughtID } },
            { new: true }
          )
    )
    .then((user) =>
      !user
        ? res.status(404).json({
            message: 'Thought deleted but no user with this ID!',
          })
        : res.json({ message: 'Thought successfully deleted!' })
    )
    .catch((err) => res.status(500).json(err));
},

};

