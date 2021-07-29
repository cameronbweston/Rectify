# Rectify
Sick of listening to the same songs over and over? Rectify it.

## Objective 
Rectify is a playlist *Recommender* for *Spotify* --> Rectify. I always love finding new and listening to new music. However, most of the time I feel like my Spotify Daily Mixes and recommended playlists are a lot of the same stuff that I listen to over and over. Also, taking time out of my day to create playlists and find new things on my own gets tedious, time consuming,  and I never know where to start. I thought it would be cool if I had more control over my recommended playlists, so I created something that did that by utilizing the Spotify API.

## Deployed App
[Rectify](https://rectify-playlist-builder.herokuapp.com/)

##Screenshots
![Home Page View](/public/screenshots/homepage.png)
![Playlist View](/public/screenshots/playlistView.png)

## How To Guide:
1. Sign into your spotify account
2. Enter 3 artists into the home page form
3. Enter the number of tracks to customize your playlist length
4. Enter the genres you're feeling, seperated by commas
5. Hit submit and get your playlist
6. Click the +Add to Spotify button if you are satisfied and **Save it straight to your Spotify profile!!!**

## Technologies Utilized
* OAuth with Passport
* Spotify API
* Node.js and Express
* Mongoose and MongoDB
* EJS
* JavaScript
* Bootstrap

## Next Steps
Create sliders on the user form so that user can select from a multitude of factors that affect the seed generator such as: dancibility, acoustiness, lyricism, energy, etc.