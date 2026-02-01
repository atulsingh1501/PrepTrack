import axios from 'axios';

export const fetchGitHubStats = async (username) => {
  if (!username) return null;
  try {
    const config = {
      headers: {}
    };
    if (process.env.GITHUB_TOKEN) {
      config.headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, config),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, config)
    ]);

    const publicRepos = userRes.data.public_repos;
    const followers = userRes.data.followers;
    const totalStars = reposRes.data.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    return {
      publicRepos,
      followers,
      totalStars,
      profileUrl: userRes.data.html_url
    };
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    return null;
  }
};
