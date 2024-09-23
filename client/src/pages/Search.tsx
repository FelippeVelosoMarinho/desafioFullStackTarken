import { useEffect, useState } from "react";
import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";
import SearchBar from "../components/SearchBar/SearchBar";
import Toastr, { notifySuccess, notifyError } from "../components/Toastr";
import SearchMovieDisplay from "../components/MovieList/SearchMovieDisplay";
import { api, OMDbSearch, token } from "../api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface MovieType {
  imdbID: string;
  Title: string;
  Poster: string;
  imdbRating?: string;
  Year?: string;
  Type?: string;
}

function Search() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [library, setLibrary] = useState<MovieType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  // Função para abrir o modal de confirmação
  const handleOpenConfirmModal = (movie: MovieType) => {
    setSelectedMovie(movie);
    setOpenConfirmModal(true);
  };

  // Função para fechar o modal de confirmação
  const handleCloseConfirmModal = () => {
    setSelectedMovie(null);
    setOpenConfirmModal(false);
  };

  // Função para buscar filmes na OMDb API
  const getMovieRequest = async (searchValue: string) => {
    if (searchValue.length < 3) {
      notifyError("Digite pelo menos 3 caracteres para a busca.");
      return;
    }

    setLoading(true);
    try {
      const response = await OMDbSearch.get(`?s=${encodeURIComponent(searchValue)}&apikey=${token}`);
      if (response.data.Search) {
        setMovies(response.data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.log("Erro: ", error);
      notifyError("Erro ao buscar filmes.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Carrega a biblioteca do usuário
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await api.get("/libraries/2");
        if (response.data && response.data.movies) {
          setLibrary(response.data.movies);
        } else {
          throw new Error("Erro ao buscar a biblioteca.");
        }
      } catch (error) {
        console.log("Erro: ", error);
        notifyError("Erro ao buscar a biblioteca.");
      }
    };
    fetchLibrary();
  }, []);

  // Função para adicionar ou remover filme da biblioteca
  const addFavoriteMovie = async (movie: MovieType) => {
    const isMovieInLibrary = library.some((m) => m.imdbID === movie.imdbID);

    if (isMovieInLibrary) {
      handleOpenConfirmModal(movie); // Abre o modal para confirmar a remoção
    } else {
      try {
        const createMovieResponse = await api.post("/movies", {
          id: movie.imdbID,
          name: movie.Title,
          posterUrl: movie.Poster || "URL não disponível",
          imdbGrade: movie.imdbRating ? parseFloat(movie.imdbRating) : 0,
          releaseDate: movie.Year,
          genre: movie.Type,
          description: "Descrição padrão para o filme.",
        });

        if (createMovieResponse.status === 201) {
          const addToLibraryResponse = await api.post("/library-movies/1/movies", {
            libraryId: 1,
            movieId: movie.imdbID,
          });

          if (addToLibraryResponse.status === 201) {
            notifySuccess("Filme adicionado à sua Biblioteca");
            setLibrary((prevLibrary) => [...prevLibrary, movie]);
          } else {
            notifyError("Erro ao adicionar o filme à Biblioteca");
          }
        } else {
          notifyError("Erro ao criar o filme.");
        }
      } catch (error) {
        console.log("Erro: ", error);
        notifyError("Erro ao criar ou adicionar o filme à Biblioteca.");
      }
    }
  };

   // Função para remover o filme após a confirmação
  const confirmRemoveMovie = async () => {
    if (selectedMovie) {
      try {
        const response = await api.delete(`/movies/${selectedMovie.imdbID}`);
        if (response.status === 200) {
          notifySuccess("Filme removido da sua Biblioteca");
          setLibrary((prevLibrary) =>
            prevLibrary.filter((m) => m.imdbID !== selectedMovie.imdbID)
          );
        } else {
          notifyError("Erro ao remover o filme da Biblioteca");
        }
      } catch (error) {
        console.log("Erro: ", error);
        notifyError("Erro ao remover o filme da Biblioteca");
      } finally {
        handleCloseConfirmModal(); 
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
            Loading...
          </Typography>
        </CenterBox>
      ) : (
        <>
          {movies.length > 0 ? (
            <SearchMovieDisplay
              movies={movies}
              onAddToLibrary={addFavoriteMovie}
              library={library}
            />
          ) : (
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
          )}
        </>
      )}
      <Dialog
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remover Filme"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja remover o filme {selectedMovie?.Title} da sua
            biblioteca?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmRemoveMovie} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </MainBox>
  );
}

export default Search;
