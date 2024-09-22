import { useEffect, useState } from "react";
import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";
import SearchBar from "../components/SearchBar/SearchBar";
import Toastr from "../components/Toastr";
import { toast } from "react-toastify";
import MovieList from "../components/MovieList"; // Assumindo que MovieList seja um componente de lista de filmes
import AddLibrary from "../components/AddLibrary"; // Componente para adicionar favoritos
import { OMDb } from "../api"; // API de busca de filmes

interface Movie {
  Title: string;
  imdbID: string;
}

function Search() {
  // Estado para filmes, favoritos e o valor da pesquisa
  const [movies, setMovies] = useState<Movie[]>([]);
  const [library, setlibrary] = useState<Movie[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Função para buscar filmes
  const getMovieRequest = async (searchValue: string) => {
    try {
      const response = await OMDb.get(`?s=${searchValue}`);
      if (response.data.Search) {
        setMovies(response.data.Search);
      } else {
        setMovies([]); // Limpa a lista se não encontrar filmes
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Busca filmes com base no valor da pesquisa sempre que `searchValue` muda
  useEffect(() => {
    if (searchValue !== '') {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  // Função para buscar favoritos ao carregar a página
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/moovy");
        setLibrary(await response.json());
      } catch (error) {
        console.error("Error fetching Library:", error);
      }
    };

    fetchLibrary();
  }, []);

  // Função para adicionar filmes aos favoritos
  const addFavoriteMovie = async (movie: Movie) => {
    try {
      const response = await fetch("http://localhost:3000/api/moovy", {
        method: "POST",
        body: JSON.stringify({
          movieID: movie.imdbID,
          isReview: 0,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Added to your Library");
        setLibrary((prev) => [...prev, movie]); // Atualiza favoritos localmente
      } else {
        toast.error("The movie is already in your Library");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  // Renderização condicional baseada no estado dos filmes e do valor de busca
  if (movies.length === 0 && searchValue !== '') {
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
            We couldn´t find the movies you were looking for :(
          </Typography>
        </CenterBox>
      </MainBox>
    );
  } else if (searchValue === '') {
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
            Type a movie name to search.
          </Typography>
        </CenterBox>
      </MainBox>
    );
  } else {
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
        />
        <Toastr /> {/* Notificações */}
        <MovieList
          movies={movies}
          handleLibraryClick={addFavoriteMovie}
          favoriteComponent={AddLibrary}
        />
      </MainBox>
    );
  }
}

export default Search;
