import axios from 'axios';

export const fetchLeetCodeStats = async (username) => {
  if (!username) return null;
  // Leetcode GraphQL API
  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
          }
        }
      `,
      variables: { username }
    });

    if (response.data.errors) {
      throw new Error('LeetCode user not found');
    }

    const { matchedUser } = response.data.data;
    if (!matchedUser) return null;

    const stats = matchedUser.submitStats.acSubmissionNum;
    return {
      all: stats.find(item => item.difficulty === 'All')?.count || 0,
      easy: stats.find(item => item.difficulty === 'Easy')?.count || 0,
      medium: stats.find(item => item.difficulty === 'Medium')?.count || 0,
      hard: stats.find(item => item.difficulty === 'Hard')?.count || 0,
      ranking: matchedUser.profile.ranking
    };
  } catch (error) {
    console.error('LeetCode API Error:', error.message);
    return null;
  }
};
