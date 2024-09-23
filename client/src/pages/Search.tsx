import { useEffect, useState } from "react";
import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";
import SearchBar from "../components/SearchBar/SearchBar";
import Toastr, { notifySuccess, notifyError } from "../components/Toastr";
import MovieDisplay from "../components/MovieList/MovieDisplay";
import { api, OMDbSearch, token } from "../api";

interface MovieType {
  imdbID: string;
  Title: string;
  Poster: string;
  imdbRating?: string;
}

function Search() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [library, setLibrary] = useState<MovieType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  const getMovieRequest = async (searchValue: string) => {
    if (searchValue.length < 3) {
      notifyError("Digite pelo menos 3 caracteres para a busca.");
      return;
    }

    setLoading(true);
    console.log("Fazendo uma pesquisinha: ", searchValue);
    try {
      const response = await OMDbSearch.get(`?s=${encodeURIComponent(searchValue)}&apikey=${token}`);
      if (response.data.Search) {
        console.log("OMDb request: ", response.data.Search);
        setMovies(response.data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      notifyError("Erro ao buscar filmes.");
      setMovies([]); // Limpa os filmes em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await api.get("/libraries/2");
        if (response.data && response.data.movies) {
          console.log("Library fetch for id 2: ", response.data.movies);
          setLibrary(response.data.movies);
        } else {
          throw new Error("Erro ao buscar a biblioteca.");
        }
      } catch (error) {
        console.error("Error fetching Library:", error);
        notifyError("Erro ao buscar a biblioteca.");
      }
    };

    fetchLibrary();
  }, []);

  const addFavoriteMovie = async (movie: MovieType) => {
    try {
      const response = await api.post(
        "/library-movies/1/movies",
        {
          movieId: movie.imdbID,
          libraryId: 2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        notifySuccess("Adicionado à sua Biblioteca");
      } else if (response.status === 400) {
        notifyError("O filme já está na sua Biblioteca");
      } else {
        notifyError("Erro ao adicionar o filme à Biblioteca");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      if (error.response && error.response.status === 400) {
        notifyError("O filme já está na sua Biblioteca");
      } else {
        notifyError("Erro ao adicionar o filme à Biblioteca");
      }
    }
  };

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
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={getMovieRequest}
      />
      <Toastr />

      {loading ? (
        <CenterBox>
          <Typography variant="h5" component="div">
            Carregando...
          </Typography>
        </CenterBox>
      ) : (
        <>
          {movies.length > 0 ? (
            <MovieDisplay
              movies={movies}
              onAddToLibrary={addFavoriteMovie}
              library={library}
            />
          ) : (
            <CenterBox>
              {/* Mensagem para quando não houver resultados */}
              <Typography variant="h5" component="div">
                Nenhum resultado encontrado.
              </Typography>
            </CenterBox>
          )}
        </>
      )}
    </MainBox>
  );
}

export default Search;
