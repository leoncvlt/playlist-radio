# playlist-radio

Turns Youtube playlists into beutiful, standalone pages. Great for parties, or to send to friends. https://playlistradio.netlify.app/

## Usage

On the home page, just paste the youtube link of a video contained in the playlist. Or you can build the link yourself: https://playlistradio.live/?&list={playlist_id} where `{playlist_id}` is the ID of the Youtube playslist (the `&list=` parameter in the url).

Some examples:

- https://playlistradio.live/?&list=PL8F6B0753B2CCA128 a classic jazz playlist, the default example on the site

- https://playlistradio.live/?&list=PLVHGe9JLVncHBqqcT9Xc7P9l_dDc1Ofid some good future funk

- https://playlistradio.live/?&list=PLD61626F6813F6C5F The GOAT soundtrack

Some form of Ad blocking is reccomended to skip commercials inbetween playlist videos.

## Development

First install dependencies:

```sh
npm install
```

To run in hot module reloading mode:

```sh
npm start
```

To create a production build to the `dist` folder:

```sh
npm run build
```

