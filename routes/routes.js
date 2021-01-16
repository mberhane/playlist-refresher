var express = require('express')
var request = require('request');

var app = module.exports = express()



app.get('/:user/:token/playlists', function(req, res) {

    var token = req.params['token'];
    var user_id = req.params['user'];
    var options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
        headers: { 'Authorization': 'Bearer ' + token },
        json: true
    };

    request.get(options, function(error, response, body) {
        console.log(retrieve_single_playlist(error, response, body, token));
    });
});


function retrieve_single_playlist(error, response, body, token) {
    var playlists = body['items'];
    var playlist_id = playlists[0]['id'];
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
