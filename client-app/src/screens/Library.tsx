import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { api } from "../api";

const { width, height } = Dimensions.get("window");

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
          type: "error",
          text1: "Erro",
          text2: "Erro ao buscar filmes da biblioteca.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderMovieItem = ({ item }: { item: MovieType }) => {
    return (
      <View style={styles.movieCard}>
        <Image source={{ uri: item.Poster }} style={styles.posterImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.movieTitle}>{item.Title}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{item.imdbRating}</Text>
          </View>
          <Icon.Button
            name="mic"
            backgroundColor="#6CD3AE"
            style={styles.microphoneButton}
            onPress={() => Alert.alert(`Gravar comentário sobre ${item.Title}`)}
          />
        </View>
      </View>
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
        <Carousel
          loop
          width={width}
          height={height - 100} // Deixa o slider ocupar toda a tela abaixo do título
          autoPlay={false}
          data={movies}
          scrollAnimationDuration={1000}
          onSnapToItem={(index: any) => console.log("Current index:", index)}
          renderItem={({ index }) => renderMovieItem({ item: movies[index] })}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Image source={require("../assets/loupe.png")} style={styles.image} />
          <Text style={styles.subtitle}>
            It looks like there are no movies in your library! Go to your web
            application and add some!
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
  },
  title: {
    color: "#12153D",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
    textAlign: "left",
  },
  movieCard: {
    width: width * 0.9, 
    height: height * 0.8, 
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "#fff",

  },
  posterImage: {
    width: "95%",
    height: "73%", 
    borderRadius: 15,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#12153D",
    textAlign: "center",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#FFD700",
  },
  microphoneButton: {
    display: "flex",
    borderRadius: 30,
    height: 45,
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
});
