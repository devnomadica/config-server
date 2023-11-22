import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResult from '../SearchResult/SearchResult';
import RepositoryFilter from '../Filters/RepositoryFilter';
import styles from './layout.module.css';
import axios from 'axios';

const Layout = () => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedSearches, setCompletedSearches] = useState(0);
  const [finalMessage, setFinalMessage] = useState('');

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/repos.json');
        const reposData = response.data;
        setRepositories(reposData);
        setSelectedRepos(reposData.map(repo => `${repo.org}/${repo.repo}`));
      } catch (error) {
        console.error('Failed to load repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handleFilterChange = useCallback((updatedSelectedRepos) => {
    setSelectedRepos(updatedSelectedRepos);
  }, []);

  const handleSearch = useCallback(
    async (term) => {
      if (!term.trim()) {
        console.warn('Search term is empty.');
        return;
      }

      setLoading(true);
      setSearchResults([]);
      setCompletedSearches(0);
      setFinalMessage('');

      let completedRequests = 0;
      let successfulSearches = 0;

      selectedRepos.forEach((repoIdentifier) => {
        axios.get(`http://localhost:3001/api/search`, {
          params: { searchTerm: term, repo: repoIdentifier },
        }).then(response => {
          setSearchResults(prevResults => [...prevResults, ...response.data.items]);
          successfulSearches++;
          completedRequests++;
          setCompletedSearches(completedRequests);
          if (completedRequests === selectedRepos.length) {
            setLoading(false);
            setFinalMessage(`Search in ${successfulSearches} from ${selectedRepos.length} here are the results.`);
          }
        }).catch(error => {
          console.error('Error during search:', error);
          completedRequests++;
          setCompletedSearches(completedRequests);
          if (completedRequests === selectedRepos.length) {
            setLoading(false);
            setFinalMessage(`Search in ${successfulSearches} from ${selectedRepos.length} here are the results.`);
          }
        });
      });
    },
    [selectedRepos]
  );

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <SearchBar
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalRepos={selectedRepos.length}
          completedSearches={completedSearches}
          loading={loading}
        />
      </div>
      <div className={styles.sidebar}>
        <RepositoryFilter
          repositories={repositories}
          selectedRepos={selectedRepos}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className={styles.content}>
        {finalMessage && !loading && (
          <p className={styles.finalMessage}>{finalMessage}</p>
        )}
        <div className={styles.results}>
          <SearchResult
            results={searchResults}
            selectedRepos={selectedRepos}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
