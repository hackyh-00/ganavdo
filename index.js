const express = require('express');
const axios = require('axios');

const app = express();


let usernames = ['@lyricseditvibe3', '@lyrics.edit.vibe06', '@sizan_babe7', '@greson_99'];


function getRandomUsername() {
  if (usernames.length === 0) {
    usernames = ['@lyricseditvibe3', '@lyrics.edit.vibe06', '@sizan_babe7', '@greson_99'];
  }
  const index = Math.floor(Math.random() * usernames.length);
  const username = usernames[index];
  usernames.splice(index, 1); 
  return username;
}

async function fetchDataWithRetry(username, retries = 2) {
  try {
    const options = {
      method: 'POST',
      url: 'https://tiktok-unauthorized-api-scraper-no-watermark-analytics-feed.p.rapidapi.com/api/search_full',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
        'X-RapidAPI-Host': 'tiktok-unauthorized-api-scraper-no-watermark-analytics-feed.p.rapidapi.com'
      },
      data: {
        username: `@${username}`,
        amount_of_posts: 5
      }
    };

    const response = await axios.request(options);
    const posts = response.data.posts.map(post => post.play_links);

    return posts;
  } catch (error) {
    console.error(error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} retries left)`);
      return fetchDataWithRetry(username, retries - 1);
    } else {
      throw new Error('Max retries exceeded');
    }
  }
}

app.get('/kshitiz', async (req, res) => {
  try {
    const username = getRandomUsername();

    
    let posts = await fetchDataWithRetry(username);
    if (!posts || posts.every(post => post.length === 0)) {
      posts = await fetchDataWithRetry(username);
    }

    
    const responseData = {
      user: username,
      posts: posts
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(5).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
