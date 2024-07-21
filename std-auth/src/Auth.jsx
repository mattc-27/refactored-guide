import React from 'react';
import { loginUrl } from './spotify'

export function Auth() {

    return (
        <>
            <div>
                <a href={loginUrl} id='signInButton'>Sign in with Spotify!</a>
            </div>
        </>
    );
}