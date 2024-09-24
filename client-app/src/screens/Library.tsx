import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator, Alert } from "react-native";
import Toast from 'react-native-toast-message';
import { api } from "../api";

export default function Library() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  interface MovieType {
    id: string;
    imdbID?: string | undefined;
    name: string;
    Title: string;
    posterUrl: string;
    imdbGrade?: string;
    releaseDate?: string;
    genre?: string;
  }
  
  // Função para buscar filmes na biblioteca
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/library-movies/1/movies");
        if (response.data) {
          const formattedMovies = response.data.map((movie: MovieType) => ({
            imdbID: movie.id,
            Title: movie.name,
            Poster: movie.posterUrl,
            imdbRating: movie.imdbGrade?.toString() || "N/A",
            Year: movie.releaseDate,
            Type: movie.genre,
          }));

          setMovies(formattedMovies);
        }
      } catch (error) {
        console.error("Error fetching movies from library:", error);
        setError("Erro ao buscar filmes.");
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Erro ao buscar filmes da biblioteca.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Função para remover um filme
  const removeMovie = async (movie: { imdbID: string | never; }) => {
    try {
      const response = await api.delete(`/movies/${movie.imdbID}`);
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Filme removido da biblioteca.',
        });
        setMovies((prevMovies) => prevMovies.filter((m) => m.imdbID !== movie.imdbID));
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao remover o filme da biblioteca.',
      });
    }
  };

  // Confirmação de remoção
  const confirmRemoveMovie = (movie: MovieType) => {
    Alert.alert(
      "Remover Filme",
      `Tem certeza que deseja remover o filme ${movie.Title}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => removeMovie(movie) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Library</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : movies.length > 0 ? (
        <View>
          {movies.map((movie) => (
            <View key={movie.imdbID} style={styles.movieItem}>
              <Image source={{ uri: movie.Poster }} style={styles.movieImage} />
              <Text style={styles.movieTitle}>{movie.Title}</Text>
              <Text onPress={() => confirmRemoveMovie(movie)} style={styles.removeText}>
                Remover
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Image source={require("../assets/loupe.png")} style={styles.image} />
          <Text style={styles.subtitle}>
            It looks like there are no movies in your library! Go to your web application and add some!
          </Text>
        </View>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  centerContainer: {
    display: "flex",
    height: "75%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#12153D",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  movieItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  movieImage: {
    width: 100,
    height: 150,
  },
  movieTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  removeText: {
    color: "red",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 18,
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 120,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "400",
    lineHeight: 27.6,
    textAlign: "center",
    color: "#A1A1A1",
    paddingHorizontal: 20,
  },
});
