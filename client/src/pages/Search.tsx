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

function Search() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await OMDb.get(""); 
        setMovies([response.data]); 
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
        Search
      </Typography>
      <SearchBar
        placeholder="Search..."
        data={movies.map((movie) => ({
          title: movie.Title,
          link: `https://www.imdb.com/title/${movie.imdbID}/`,
        }))}
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
          We couldn´t find the movies you were lookin for :(
        </Typography>
      </CenterBox>
    </MainBox>
  );
}

export default Search;
