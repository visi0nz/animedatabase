import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Spinner from './components/Spinner';
import AnimeCard from './components/AnimeCard';
import { useDebounce } from 'react-use';
import { getTrendingAnime, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.jikan.moe/v4/anime';


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop tryping for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

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
        images: anime.images,
        score: anime.score,
        aired: anime.aired, 
        genres: anime.genres,
        episodes: anime.episodes,
      }));
  
      setAnimeList(data); // Update the anime list state

      if(query && data.length > 0) {
        await updateSearchCount(query, data[0]);
      }

    } catch (error) {
      console.error(`Error fetching anime: ${error}`);
      setErrorMessage('Error fetching anime. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingAnime = async () => {
    try {
      const anime = await getTrendingAnime();

      setTrendingAnime(anime);

    } catch (error) {
      console.error(`Error fetching trending anime: ${error}`);
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchAnime(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingAnime();
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

        {trendingAnime.length > 0 && (
          <section className='trending'>
            <h2>Trending Anime</h2>
            <ul>
              {trendingAnime.map((anime, index) => (
                <li key={anime.$id}>
                  <p>{index + 1}</p>
                  <img src={anime.poster_url} alt={anime.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-anime">
          <h2>All Anime</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {animeList.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App;