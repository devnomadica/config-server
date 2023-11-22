import React from 'react';
import styles from './searchResult.module.css';

// Accept 'results' and 'selectedRepos' props to display dynamic search results
const SearchResult = ({ results, selectedRepos }) => {
  // Log the raw results for debugging
  console.log('Raw search results:', results);

  // Filter results to only include those from selected repositories
  const filteredResults = results.filter(result =>
    selectedRepos.includes(result.repository.full_name) // Ensure this matches how you store repo identifiers
  );

  return (
    <div className={styles.searchResult}>
      {filteredResults.length > 0 ? (
        // Map over each filtered result and display it
        filteredResults.map((result, index) => (
          <div key={index} className={styles.resultItem}>
            <h4>{result.name}</h4>
            <p>Path: {result.path}</p>
            <p>Repo: {result.repository.full_name}</p> {/* Adjust if needed */}
            <a
              href={result.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        ))
      ) : (
        // Display a message when there are no results
        <div>No results found</div>
      )}
    </div>
  );
};

export default SearchResult;
