import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { gameSongsState, artistState } from '../globalState'

const Game = () => {
    const [gameCounter, setGameCounter] = useState(0)
    const [songs, setSongs] = useRecoilState(gameSongsState)
    const [selection, setSelection] = useState("")
    const [isWinner, setIsWinner] = useState(false)
    const [artists, setArtists] = useRecoilState(artistState)
    const [score, setScore] = useState(0)
    const [didPickChoice, setDidPickChoice] = useState(false)

    const embed1 = "https://open.spotify.com/embed/track/"
    const embed2 = "?utm_source=generator&theme=0"

    const handleClick = (e) => {
        const artistNames = songs[gameCounter].artists[0].name
        artistNames === e.target.id ?
            (setIsWinner(true), setScore(score + 1)) :
            setIsWinner(false),
            setDidPickChoice(true)
        setSelection(e.target.id)
    }


    return (
        <div >
            <h1 className='game-header' >Who's Who</h1>
            <div className='centered-container'>
                <p> Score : {score} </p>

                <div className='game-option-container' >
                    <div hidden={didPickChoice}>
                        <h1 className="details-h2" hidden={didPickChoice ? true : false}>Who is this artist?</h1>
                        <div className='centered-container'>
                            <h3> Current Song: {gameCounter + 1} /{songs.length}. </h3>
                            <div className="image-cropper" >
                                <iframe className="iframe-container" scrolling="no" frameBorder="yes" allow="encrypted-media"
                                    src={embed1 + songs[gameCounter].id + embed2} >
                                </iframe>
                            </div>
                        </div>
                    </div>
                    <div hidden={selection ? false : true}>
                        <div className='centered-container-game'>
                            <br />
                            <br />
                            <br />
                            <h3>{isWinner ? 'You got it!' : "Nope. It was: "}</h3>
                            <h5>Song Name: {songs[gameCounter].name}</h5>
                            <h5>Artist Name: {songs[gameCounter].artists[0].name}</h5>

                            <button
                                className='next-button' hidden={gameCounter <= songs.length - 2 ? false : true}
                                onClick={() => {
                                    setGameCounter(gameCounter < songs.length ? gameCounter + 1 : 0),
                                        setSelection(""), setDidPickChoice(false)
                                }}>{gameCounter <= songs.length - 2 ? "Next Song" : "Retry?"}</button>

                        </div>
                        <div className="game-over" hidden={!(didPickChoice && gameCounter === songs.length - 1)}>
                            <button className='option-button' onClick={() => setGameCounter(0)}>Retry?</button>
                            <a href="/"><button className='option-button'>New Game</button></a>
                        </div>
                    </div>
                </div>
                <br />
                <a href="/"><button className="back-button" >Quit?</button></a>
                <div>
                    <div className='option-container'>
                        {artists[gameCounter].map(artist =>
                            <button className="option-button" hidden={didPickChoice ? true : false} key={artist} id={artist} onClick={e => handleClick(e)}>{artist}</button>
                        )}
                    </div>
                    <br />
                    <br />
                </div>
            </div >
        </div>
    )
}

export default Game