async function getTopTracks() {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + spotifyToken },
        });
        const data = await response.json();
        console.log(data[0].songId);
        setRecentTracks(data);
    } catch (error) {
        console.log(error)
    }
}