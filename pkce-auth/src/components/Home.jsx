import React, { useState, useEffect } from 'react';
import { getSpotifyData } from '../spotify';

const Home = ({ logout }) => {
  const [user, setUser] = useState(null);
  const [recentTracks, setRecentTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getSpotifyData('me');
        setUser(userData);

        const recentTracksData = await getSpotifyData('me/player/recently-played');
        setRecentTracks(recentTracksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Logged in as {user.display_name}</h1>
      <img src={user.images[0]?.url} alt="Profile" width="150" />
      <button onClick={logout}>Logout</button>

      <h2>Recently Played Tracks</h2>
      {recentTracks && (
        <ul>
          {recentTracks.items.map((item, index) => (
            <li key={index}>
              {item.track.name} by {item.track.artists[0].name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
