import { useEffect, useState } from "react";
import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";
import SearchBar from "../components/SearchBar/SearchBar";

import { OMDb } from "../api";

interface Movie {
  Title: string;
  imdbID: string;
}

function MyLibrary() {
  const [movies, setMovies] = useState<Movie[]>([]); // Usando o tipo definido

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await OMDb.get(""); // Endpoint para buscar filmes
        setMovies([response.data]); // Armazena a lista de filmes
        console.log("Filmes: ", movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <MainBox>
      <Typography
        variant="h4"
        component="div"
        sx={{
          flexGrow: 1,
          fontFamily: "Inter, sans-serif",
          fontWeight: "bold",
        }}
      >
        My Library
      </Typography>
      <SearchBar 
        placeholder="Search..." 
        data={movies.map(movie => ({ title: movie.Title, link: `https://www.imdb.com/title/${movie.imdbID}/` }))} 
      />
      <CenterBox>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Inter, sans-serif" }}
        >
          <img src={Loupe} alt="Loupe" style={{ opacity: "0.5" }} />
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{
            height: "60%",
            width: "35%",
            flexGrow: 1,
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
          }}
        >
          It looks like there are no movies in your library! Search for a movie
          you have watched and add it here!
        </Typography>
      </CenterBox>
    </MainBox>
  );
}

export default MyLibrary;
