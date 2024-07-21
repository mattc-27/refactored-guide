
export const authEndpoint = 'https://accounts.spotify.com/authorize';

const redirectUri = 'http://localhost:5175';

const clientId = 'CLIENT_ID'

const scopes = ['user-read-private user-read-email user-read-recently-played, user-read-playback-state, user-top-read'];

//const authorizationEndpoint = "https://accounts.spotify.com/authorize";
export const loginUrl = `${authEndpoint}?
client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`


export const getTokenFromUrl = () => {
    return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
        // #accessToken=mysecetkey&name=somerandomname
        let parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1])

        return initial 
    },{})
}