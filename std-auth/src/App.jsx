import React, { useState, useEffect, useContext } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Routes,
    Route,
    BrowserRouter
} from 'react-router-dom';

import { Auth } from './Auth'

import { getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

export default function App() {

    const [spotifyToken, setSpotifyToken] = useState('');
    const [currentTrack, setCurrentTrack] = useState('');
    const [trackDetails, setTrackDetails] = useState('');
    const [recentTracks, setRecentTracks] = useState('');
    //const [trackId, setTrackId] = useState('');

    useEffect(() => {
        console.log('Derived from url: ', getTokenFromUrl())
        const _spotifyToken = getTokenFromUrl().access_token;
        window.location.hash = '';

        console.log('Spotify toke ', _spotifyToken)

        if (_spotifyToken) {
            setSpotifyToken(_spotifyToken)
            spotify.setAccessToken(_spotifyToken)
            spotify.getMe().then((user) => {
                console.log('This you ', user)
            })
        }
    });

    async function getTrack(props) {
        // event.preventDefault()
        console.log(props)
        const trackId = props;
        try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + spotifyToken },
            });
            const data = await response.json();
            if (data !== null) {
                const songId = data.id
                const details = await getTrackDetails(songId)
                setCurrentTrack(data)
                setTrackDetails(details)
            }
            //console.log(data);
        } catch (error) {
            console.log(error)
        }
    };


    async function getTrackDetails(trackId) {
        try {
            const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + spotifyToken },
            });
            const data = await response.json();
            console.log(data);
            return { ...data };
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(trackDetails)
    }, [trackDetails])

    /*   useEffect(() => {
          console.log(trackId)
          getTrackDetails(trackId)
      }, [trackId])
      */


    async function getRecent() {
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=3`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + spotifyToken },
            });
            const data = await response.json();
            console.log(data);
            setRecentTracks(data);
            //return { ...data };
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div>
            <h1>Hello world</h1>
            {spotifyToken === '' ?
                <Auth />
                :
                <>
                    <p>Successfully authorized</p>
                    <button onClick={getRecent}>Recent tracks</button>
                    <div>
                        {recentTracks ? recentTracks.items.map((item) => (
                            <>
                                <ul>
                                    <li>{item.played_at}</li>
                                    <li>{item.track.name}</li>
                                    <li>{item.track.id}</li>
                                    <button
                                        // value={item.track.id}
                                        onClick={(event) => getTrack(item.track.id)}
                                    >get track details</button>
                                </ul>
                            </>

                        ))
                            : null
                        }
                    </div>

                    {currentTrack && trackDetails ?
                        <>
                            <ul>
                                <li><b>Name: </b>{currentTrack.name}</li>
                                <li><b>Artist: </b>{currentTrack.artists[0].name}</li>

                            </ul>
                            <ul>

                                <li><b>Key: </b>{trackDetails.key}</li>
                                <li><b>Tempo: </b>{trackDetails.tempo}</li>
                            </ul>
                        </>

                        : null}

                </>
            }

        </div >
    )
}

