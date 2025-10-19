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
            <a
            href="https://visi0nz.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            >
          <img
            src="./logo.png"
            alt="Logo"
            className="logo logo-glow"
          />
          </a>
          <div className="flex gap-4 fixed top-10 right-8 z-50">
          <span className="header-text">by Emre Civas.</span>
          <a
            href="https://github.com/visi0nz"
            target="_blank"
            rel="noopener noreferrer"
            >
          <i
            className="fab fa-github icon" 
            alt="My Github profile"> 
          </i>
          </a>
          <a
            href="https://www.linkedin.com/in/emre-civas/"
            target="_blank"
            rel="noopener noreferrer"
            >
          <i 
            className="fab fa-linkedin icon" 
            alt="My Linkedin profile"> 
          </i>
          </a>
          </div>
          <div className="flex-1">
          <img src="./hero.png" alt="Hero Banner" className="hero-img" />
          <h1>
            Find your next favorite <span className="text-gradient">Anime</span>.
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
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