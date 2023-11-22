import React from 'react';
import styles from './searchBar.module.css'; // Assuming you have a CSS module for styles

const SearchBar = ({ onSearch, searchTerm, setSearchTerm, totalRepos, completedSearches, loading }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className={styles.searchInput}
      />
      <button onClick={() => onSearch(searchTerm)} className={styles.searchButton}>
        Search
      </button>
      {loading && (
        <p className={styles.progressIndicator}>
          Searching for "{searchTerm}" in {totalRepos} repos, {completedSearches} finished...
        </p>
      )}
    </div>
  );
};

export default SearchBar;
