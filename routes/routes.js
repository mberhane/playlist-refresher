var express = require('express')
var request = require('request');
var util = require('../app.js');

var app = module.exports = express()



app.get('/:user/playlists', function(req, res) {

    var token = util.retrieve_token();
    var user_id = req.params['user'];
    var options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
        headers: { 'Authorization': 'Bearer ' + token },
        json: true
    };

    request.get(options, function(error, response, body) {
        console.log(retrieve_single_playlist(error, response, body));
    });
});

function retrieve_single_playlist(error, response, body) {
    var playlists = body['items'];
    var playlist_id = playlists[0]['id'];
    var token = util.retrieve_token();
    console.log(playlist_id);
    var opt = {
        url: 'https://api.spotify.com/v1/playlists' + playlist_id + '/tracks',
        headers: { 'Authorization': 'Bearer ' + token},
        json: true
    };

    request.get(opt, function(error, response, body) {
        return body;
    });
}

//return track date, artists, album, track_id
function access_track_info(track) {
    details = track['track'];
    /*
     * playlist track looks like: added_at, added_by, is_local, track.
     * track is its own object w lots of details, we want album, artist which are of course their own objects
     * 
    */
   return {date: track['added_at'], album: retrieve_album_id(details['album']), artists: retrieve_artist_ids(details['artists']), track_id: details['id']};
}


function retrieve_album_id(album) {
    return album['id'];
}


function retrieve_artist_ids(artists) {
    return artists.map(function(artist, index) {
        return artist['id'];
    });
}

function get_track_recommendations(artist_ids, album_id, track_id) {
    var token = util.retrieve_token();
    //since we pass one album and one track, we can only use up to the first 3 artists
    if(artist_ids.length > 3) {
        artist_ids = artist_ids.slice(0,3);
    }

    var params = {seed_artists : artist_ids, seed_tracks : track_id, seed_albums : album_id};
    var options = {
        url: 'https://api.spotify.com/v1/users/recommendations',
        headers: { 'Authorization': 'Bearer ' + token },
        qs: params,
        json: true
    };

    request.get(options, function(error, response, body) {
        console.log(body);
    });

}

function create_playlist_for_refresh() {
    
}

