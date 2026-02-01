import axios from 'axios';

export const fetchCodeforcesStats = async (username) => {
  if (!username) return null;
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    
    if (response.data.status !== 'OK') {
      throw new Error('Codeforces user not found');
    }

    const user = response.data.result[0];
    
    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'Unrated',
      maxRank: user.maxRank || 'Unrated',
    };
  } catch (error) {
    console.error('Codeforces API Error:', error.message);
    return null;
  }
};
