const User = require('../models/User');

async function updateXP(userId, xpToAdd) {
  const user = await User.findById(userId);
  if (!user) return;

  user.xp += xpToAdd;

  // Recalculate level
  let level = 1;
  let xpRequired = 10;

  while (user.xp >= xpRequired) {
    level++;
    xpRequired += level * 10;
  }

  user.level = level;
  await user.save();
}

module.exports = { updateXP };
