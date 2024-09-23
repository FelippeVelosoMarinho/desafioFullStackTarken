import { useEffect, useState } from "react";
import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";
import MovieDisplay from "../components/MovieList/MovieDisplay";
import { api } from "../api"; // Certifique-se de que 'api' está configurado corretamente
import Toastr, { notifySuccess, notifyError } from "../components/Toastr";
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

function MyLibrary() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  // Função para buscar filmes na biblioteca
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/library-movies/1/movies"); // Chamada para a rota da API
        if (response.data) {
          console.log("Movies in library: ", response.data);

          // Mapeia os dados da resposta para o formato esperado
          const formattedMovies = response.data.map((movie: any) => ({
            imdbID: movie.id,
            Title: movie.name,
            Poster: movie.posterUrl,
            imdbRating: movie.imdbGrade?.toString() || "N/A",
            Year: new Date(movie.releaseDate).getFullYear().toString(),
            Type: movie.genre,
          }));

          setMovies(formattedMovies);
        }
      } catch (error) {
        console.error("Error fetching movies from library:", error);
        setError("Erro ao buscar filmes. Por favor, tente novamente mais tarde.");
        notifyError("Erro ao buscar filmes.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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

  // Função para confirmar a remoção do filme
  const confirmRemoveMovie = async () => {
    if (selectedMovie) {
      try {
        const response = await api.delete(`/movies/${selectedMovie.imdbID}`);
        if (response.status === 200) {
          notifySuccess("Filme removido da sua Biblioteca");
          setMovies((prevMovies) =>
            prevMovies.filter((movie) => movie.imdbID !== selectedMovie.imdbID)
          );
        } else {
          notifyError("Erro ao remover o filme da Biblioteca");
        }
      } catch (error) {
        console.error("Error removing movie:", error);
        notifyError("Erro ao remover o filme da Biblioteca");
      } finally {
        handleCloseConfirmModal(); // Fecha o modal após a ação
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
        My Library
      </Typography>

      <Toastr />

      {loading ? (
        <CenterBox>
          <Typography variant="h5" component="div">
            Loading...
          </Typography>
        </CenterBox>
      ) : error ? (
        <CenterBox>
          <Typography variant="h6" component="div" color="error">
            {error}
          </Typography>
        </CenterBox>
      ) : movies.length > 0 ? (
        <MovieDisplay
          movies={movies}
          library={movies}
          onRemoveFromLibrary={handleOpenConfirmModal} // Chama a função de remoção
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
            Parece que não há filmes na sua biblioteca! Pesquise um filme que você assistiu e adicione aqui!
          </Typography>
        </CenterBox>
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
            Tem certeza que deseja remover o filme {selectedMovie?.Title} da sua biblioteca?
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

export default MyLibrary;
