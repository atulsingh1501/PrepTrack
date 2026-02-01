import User from '../models/User.js';
import { fetchLeetCodeStats } from '../services/leetcodeService.js';
import { fetchGitHubStats } from '../services/githubService.js';
import { fetchCodeforcesStats } from '../services/codeforcesService.js';

export const updateTrackerUsernames = async (req, res) => {
  try {
    const { leetcodeUsername, githubUsername, codeforcesUsername } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.leetcodeUsername = leetcodeUsername ?? user.leetcodeUsername;
    user.githubUsername = githubUsername ?? user.githubUsername;
    user.codeforcesUsername = codeforcesUsername ?? user.codeforcesUsername;

    await user.save();
    res.json({ message: 'Tracker profiles updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrackerData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Call APIs in parallel
    const [leetcode, github, codeforces] = await Promise.all([
      user.leetcodeUsername ? fetchLeetCodeStats(user.leetcodeUsername) : null,
      user.githubUsername ? fetchGitHubStats(user.githubUsername) : null,
      user.codeforcesUsername ? fetchCodeforcesStats(user.codeforcesUsername) : null,
    ]);

    res.json({
      leetcode,
      github,
      codeforces
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
