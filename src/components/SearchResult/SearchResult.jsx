import React from 'react';
import styles from './searchResult.module.css';

const SearchResult = ({ results, selectedRepos }) => {
  // Log the raw results for debugging
  console.log('Raw search results:', results);

  // Filter results to only include those from selected repositories
  const filteredResults = results.filter(result =>
    selectedRepos.includes(result.repository.full_name)
  );

  // Reverse the order of filtered results to display the most recent first
  const reversedResults = [...filteredResults].reverse();

  return (
    <div className={styles.searchResult}>
      {reversedResults.length > 0 ? (
        // Map over each reversed result and display it
        reversedResults.map((result, index) => (
          <div key={index} className={styles.resultItem}>
            <h4>{result.name}</h4>
            <p>Path: {result.path}</p>
            <p>Repo: {result.repository.full_name}</p>
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
        <div>No results found</div>
      )}
    </div>
  );
};

export default SearchResult;
