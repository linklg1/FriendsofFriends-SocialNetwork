const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  addReaction,
  removeReaction,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser);

// /api/users/:userId/reactions
router.route('/:userId/reactions').post(addReaction);

// /api/users/:userId/reactions/:reactionId
router.route('/:userId/reactions/:reactionId').delete(removeReaction);

/// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;