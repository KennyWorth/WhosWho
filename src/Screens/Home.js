import React, { useEffect, useState } from 'react'
import fetchFromSpotify, { request } from '../services/api'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { genreListState, selectedGenreState, numSongsState, numArtistsState, artistState, gameSongsState } from '../globalState'

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {
  const [genres, setGenres] = useRecoilState(genreListState)
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState)
  const [numSongs, setNumSongs] = useRecoilState(numSongsState)
  const [numArtists, setNumArtists] = useRecoilState(numArtistsState)
  const [authLoading, setAuthLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [token, setToken] = useState('')
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useRecoilState(artistState)
  const [gameSongs, setGameSongs] = useRecoilState(gameSongsState)
  const [genreSelected, setGenreSelected] = useState(false)
  const [songsSelected, setSongsSelected] = useState(false)
  const [artistsSelected, setArtistsSelected] = useState(false)


  const loadGenres = async t => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
      token: t,
      endpoint: 'recommendations/available-genre-seeds'
    })
    setGenres(response.genres)
    setConfigLoading(false)
  }


  const getGameSongs = () => {
    let newGameSongs = []
    for (let i = 0; i < songs.length; i++) {
      if (newGameSongs.length < numSongs) {
        let randomIndex = Math.floor(Math.random() * songs.length)
        // if (songs[randomIndex].preview_url) {
        if (!newGameSongs.includes(songs[randomIndex])) {
          newGameSongs.push(songs[randomIndex])
          // }
        }
      }
    }
    setGameSongs(newGameSongs)
  }
  const setGameArtists = () => {
    let gameArtists = []
    for (let i = 0; i < gameSongs.length; i++) {
      let randomArtists = []
      randomArtists.push(gameSongs[i].artists[0].name)
      for (let j = 0; j < songs.length; j++) {
        let randomIndex = Math.floor(Math.random() * songs.length)
        if (randomArtists.length < numArtists) {
          if (songs[randomIndex].artists[0].name !== null && !(randomArtists.includes(songs[randomIndex].artists[0].name))) {
            randomArtists.push(songs[randomIndex].artists[0].name)
          }
        }
      }
      let shuffled = randomArtists.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
      gameArtists[i] = shuffled
    }
    setArtists(gameArtists)
  }

  const setGameParams = () => (
    fetchFromSpotify({
      token,
      endpoint: 'recommendations',
      params: {
        market: 'US',
        seed_genres: selectedGenre,
        limit: 100,
      }
    }).then(({ tracks }) => setSongs(tracks))
  )

  const resetGame = () => {
    setGenreSelected(false)
    setSongsSelected(false)
    setArtistsSelected(false)
  }


  const resetSongState = useResetRecoilState(gameSongsState)
  const resetArtistState = useResetRecoilState(artistState)


  useEffect(() => {
    setAuthLoading(true)
    resetSongState()
    resetArtistState()

    const storedTokenString = localStorage.getItem(TOKEN_KEY)
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString)
      if (storedToken.expiration > Date.now()) {
        console.log('Token found in localstorage')
        setAuthLoading(false)
        setToken(storedToken.value)
        if (genres.length === 0) {
          loadGenres(storedToken.value)
        }
        return
      }
    }
    console.log('Sending request to AWS endpoint')
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken))
      setAuthLoading(false)
      setToken(newToken.value)
      if (genres.length === 0) {
        loadGenres(newToken.value)
      }
    })
  }, [])

  if (authLoading || configLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className='game-header' >Who's Who</h1>
      {!genreSelected ?
        <div className='config-option-container' >
          <h2 className='details-h2'>Choose a Genre of Music:</h2>
          <select
            value={selectedGenre}
            onChange={event => setSelectedGenre(event.target.value)}
          >
            <option hidden value={selectedGenre}>{selectedGenre || "Please Choose a Genre"}</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <button className="submit-button" onClick={() => { setGameParams(), setGenreSelected(true) }}>{selectedGenre ? selectedGenre + "? Thats My Jam!" : "Hmmmm...."}</button>
        </div>
        : ""}
      {!songsSelected && genreSelected ?
        <div className="config-option-container">
          <h2 className='details-h2'>How many songs do you want?</h2>
          <input className='input-select'
            type="number"
            value={numSongs}
            onChange={event => { event.target.value >= 0 && event.target.value <= 100 ? setNumSongs(event.target.value) : setNumSongs(0) }}
          />
          <br />
          <button className='submit-button' onClick={() => { getGameSongs(), setSongsSelected(true) }}>{numSongs >= 5 ? numSongs >= 10 ? numSongs >= 20 ? "I'm a glutton for punishment" : "I know what I'm doing" : "Let's take it easy" : "Submit"}</button>
          <button className="back-button" onClick={() => { setGenreSelected(false) }}>Go Back</button>
        </div>
        : ""}
      {!artistsSelected && songsSelected ?
        <div className='config-option-container' >
          <h2 className='details-h2'>How many artists do you want to choose from?</h2>
          <input className='input-select'
            type="number"
            value={numArtists}
            onChange={event => { event.target.value >= 0 && event.target.value <= 100 ? setNumArtists(event.target.value) : setNumArtists(0) }}
          /><button className='submit-button' onClick={() => { setGameArtists(), setArtistsSelected(true) }}>{numArtists >= 5 ? numArtists >= 10 ? numArtists >= 20 ? "So many choices!!" : "You're obviously a wizard!" : "Here we go!" : "Submit"}</button>
          <button className="back-button" onClick={() => { setGenreSelected(false), setSongsSelected(false) }}>Go Back</button>
        </div>
        : ""}
      <div className='centered-container'>
        {genreSelected ? <h1 className="info-h1">Genre: {selectedGenre}</h1> : ""}
        {songsSelected ? <h1 className="info-h1">Number of Songs: {numSongs}</h1> : ""}
        {artistsSelected ? <h1 className="info-h1">Number of Artists: {numArtists}</h1> : ""}
      </div>
      <br />
      <div className='centered-container'>
        <a href="/game" ><button className="submit-button" hidden={(genreSelected && songsSelected && artistsSelected) ? false : true}>Lets Play!</button></a>
      </div>
      <div className='centered-container' >
        <button className="back-button" onClick={() => resetGame()}>Reset</button>
      </div>
    </div >
  )
}

export default Home
