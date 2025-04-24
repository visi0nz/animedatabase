import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Spinner from './components/Spinner';

const API_BASE_URL = 'https://api.jikan.moe/v4/anime';




const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnime = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=20`;

      const response = await axios.get(endpoint);

      if (response.status !== 200) {
        throw new Error('Failed to fetch anime');
      }
  
      // Extract relevant data from the response
      const data = response.data.data.map((anime) => ({
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.jpg.image_url,
      }));
  
      setAnimeList(data); // Update the anime list state
    } catch (error) {
      console.error(`Error fetching anime: ${error}`);
      setErrorMessage('Error fetching anime. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (searchTerm) {
      fetchAnime(searchTerm);
    }
  }, [searchTerm]);

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
          <h2 className='mt-[40px]'>All Anime</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {animeList.map((anime) => (
                <li key={anime.id} className="anime-item">
                  <img src={anime.image} alt={anime.title} className="anime-image" />
                  <p className="text-white">{anime.title}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App;