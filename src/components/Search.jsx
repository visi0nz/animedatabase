import React, { useState } from 'react';

const Search = ({searchTerm, setSearchTerm}) => {
  const [placeholder, setPlaceholder] = useState('Search through thousands of Anime.');

  return (
    <div className='search'>
        <div>
            <img src="search.svg" alt="search" />

            <input 
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onFocus={() => setPlaceholder('')} // Clear placeholder on focus
            onBlur={() => {
              if (!searchTerm) setPlaceholder('Search through thousands of Anime.'); // Restore placeholder if input is empty
            }}
            onChange={(event) => setSearchTerm(event.target.value)}
            />
        </div>
    </div>
  )
}

export default Search