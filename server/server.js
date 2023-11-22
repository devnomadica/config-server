const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable all CORS requests
app.use(cors());

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let searchQueue = [];  // Queue to hold search requests
let isRateLimited = false;  // Flag to indicate if currently rate limited

// Function to perform a search with GitHub API
const performSearch = async (searchTerm, repo, res) => {
  const query = `${encodeURIComponent(searchTerm)}+in:file+repo:${encodeURIComponent(repo)}`;
  const githubApiUrl = `https://api.github.com/search/code?q=${query}`;
  console.log("GitHub API Request URL:", githubApiUrl);

  try {
    const response = await axios.get(githubApiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });
    res.json(response.data);  // Send response back to client
    processQueue();  // Process next item in the queue
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error("Hit rate limit. Adding request to queue and waiting for reset...");
      // Add to queue for retry
      searchQueue.push({ searchTerm, repo, res });

      if (!isRateLimited) {
        isRateLimited = true;
        const rateLimitReset = error.response.headers['x-ratelimit-reset'];
        const resetTime = rateLimitReset ? parseInt(rateLimitReset, 10) * 1000 : Date.now() + 60 * 1000;
        const delay = resetTime > Date.now() ? resetTime - Date.now() : 0;
        
        console.log(`Waiting for ${delay / 1000} seconds before retrying...`);
        setTimeout(() => {
          isRateLimited = false;
          processQueue();  // Process the queue after waiting
        }, delay);
      }
    } else {
      console.error("Error during GitHub API call:", error.message);
      res.status(500).json({ message: "Error fetching data from GitHub API", error: error.message });
    }
  }
};

// Function to process the queue
const processQueue = () => {
  if (searchQueue.length > 0 && !isRateLimited) {
    const { searchTerm, repo, res } = searchQueue.shift();  // Get the first request from the queue
    performSearch(searchTerm, repo, res);  // Perform the search
  }
};

app.get("/api/search", (req, res) => {
  const { searchTerm, repo } = req.query;

  if (!searchTerm || !repo) {
    return res.status(400).json({ message: "Search term and repository are required parameters." });
  }

  if (isRateLimited) {
    console.log("Rate limited. Adding request to queue.");
    searchQueue.push({ searchTerm, repo, res });  // Add to queue if rate limited
  } else {
    performSearch(searchTerm, repo, res);  // Perform search immediately if not rate limited
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
