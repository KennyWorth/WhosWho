import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist()

export const genreListState = atom({
    key: "genreListState",
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const gameSongsState = atom({
    key: "gameSongsState",
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const songsState = atom({
    key: "songsState",
    default: [],
})

export const artistState = atom({
    key: "artistState",
    default: "",
    effects_UNSTABLE: [persistAtom],
})

export const selectedGenreState = atom({
    key: "selectedGenreState",
    default: "",
    effects_UNSTABLE: [persistAtom],
})

export const numSongsState = atom({
    key: "numSongsState",
    default: 1,
    effects_UNSTABLE: [persistAtom],
})
export const numArtistsState = atom({
    key: "numArtistsState",
    default: 2,
    effects_UNSTABLE: [persistAtom],
})
