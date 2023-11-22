import React from 'react';
import styles from './filters.module.css';

const RepositoryFilter = ({ repositories, selectedRepos, onFilterChange }) => {

  const handleCheckboxChange = (repoIdentifier, checked) => {
    if (checked) {
      onFilterChange([...selectedRepos, repoIdentifier]);
    } else {
      onFilterChange(selectedRepos.filter(id => id !== repoIdentifier));
    }
  };

  return (
    <div className={styles.sidebar}>
      <h4>Repository Filter</h4>
      {repositories.map(repo => {
        const repoIdentifier = `${repo.org}/${repo.repo}`;
        return (
          <div key={repoIdentifier} className={styles.repoItem}>
            <label>
              <input
                type="checkbox"
                checked={selectedRepos.includes(repoIdentifier)}
                onChange={(e) => handleCheckboxChange(repoIdentifier, e.target.checked)}
              />
              {repoIdentifier}
            </label>
          </div>
        );
      })}
    </div>
  );
};


export default RepositoryFilter;
