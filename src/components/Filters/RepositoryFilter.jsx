import React, { useState, useEffect } from 'react';
import styles from './filters.module.css';

const RepositoryFilter = ({ repositories, onFilterChange }) => {
  const [selectedRepos, setSelectedRepos] = useState([]);
  
  // Initialize the selected repositories when the component mounts
  useEffect(() => {
    setSelectedRepos(repositories.map(repo => `${repo.org}/${repo.repo}`));
  }, [repositories]);

  // Handler for the "Select All" checkbox
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Select all repositories
      const allRepoIdentifiers = repositories.map(repo => `${repo.org}/${repo.repo}`);
      setSelectedRepos(allRepoIdentifiers);
      onFilterChange(allRepoIdentifiers);
    } else {
      // Deselect all repositories
      setSelectedRepos([]);
      onFilterChange([]);
    }
  };

  // Handler for individual repository checkboxes
  const handleCheckboxChange = (repoIdentifier, checked) => {
    if (checked) {
      setSelectedRepos(prevSelectedRepos => [...prevSelectedRepos, repoIdentifier]);
    } else {
      setSelectedRepos(prevSelectedRepos => prevSelectedRepos.filter(id => id !== repoIdentifier));
    }
    onFilterChange(selectedRepos);
  };

  // Determine if the "Select All" checkbox should be checked
  const isAllSelected = repositories.length === selectedRepos.length;

  return (
    <div className={styles.filter}>
      <h4>Repository Filter</h4>
      <label>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAllChange}
        />
        Select All
      </label>
      {repositories.map(repo => {
        const repoIdentifier = `${repo.org}/${repo.repo}`;
        return (
          <label key={repoIdentifier}>
            <input
              type="checkbox"
              checked={selectedRepos.includes(repoIdentifier)}
              onChange={(e) => handleCheckboxChange(repoIdentifier, e.target.checked)}
            />
            {repo.repo}
          </label>
        );
      })}
    </div>
  );
};

export default RepositoryFilter;
