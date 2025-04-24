import React from 'react'

const AnimeCard = ({ anime: { title, images, score, aired, genres, episodes } }) => {
    
    return (
      <div className="anime-card">
        <img
          src={images?.jpg?.image_url || '/no-anime.png'} // Use the correct image URL or fallback
          alt={title}
          className="anime-image"
        />
        <div className='mt-4'>
        <h3>{title}</h3>

         <div className='content'>
            <div className='rating'>
                <img src="star.svg" alt="Star Icon" />
                <p>{score ? score.toFixed(1) : 'N/A'}</p>
            </div>

            <span>●</span>
            <p className='release-year'>
                {aired.from ? aired.from.split('-')[0] : 'N/A'}</p>
            <span>●</span>
            <p className='episodes'>
            Episodes: {episodes !== null ? episodes : 'N/A'}</p>

            <span>●</span>
            <p className='genre'>
            {genres && genres.length > 0
              ? genres.map((genre) => genre.name).join(', ') // Join genre names with commas
              : 'N/A'}
          </p>

         </div>
        
         
        </div>
      </div>
    );
  };

export default AnimeCard



