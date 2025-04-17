import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './components/Search';

const API_BASE_URL = 'https://api.myanimelist.net/v2';
const API_KEY = import.meta.env.REACT_APP_MAL_CLIENT_ID;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAnime = async () => {
    try {
      const endpoint = `http://localhost:5173/api/anime?q=${searchTerm}`;
      const response = await axios.get(endpoint);
  
      console.log(response.data); // Log the fetched data
    } catch (error) {
      console.error(`Error fetching Anime: ${error}`);
      setErrorMessage('Error fetching Anime. Please try again later.');
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find your next favorite <span className="text-gradient">Anime</span>.
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-anime">
          <h2>All Anime</h2>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;