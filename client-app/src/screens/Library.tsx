import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
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
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [reviews, setReviews] = useState<{ [key: string]: any }>({}); 
  const [sound, setSound] = useState<Audio.Sound | null>(null); 
  const [playbackStatus, setPlaybackStatus] = useState<any>(null); 
// Armazenar as reviews de cada filme

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

  // Função para buscar reviews de um filme específico
  const fetchReviewForMovie = async (movieId: string) => {
    try {
      const response = await api.get(`/reviews/movie/${movieId}`);
      if (response.data) {
        setReviews((prevReviews) => ({
          ...prevReviews,
          [movieId]: response.data, // Armazena a review por movieId
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
    }
  };

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        Alert.alert("Permissão de gravação não concedida.");
      }
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      Alert.alert("Erro", "Falha ao iniciar gravação.");
    }
  }

  async function stopRecording(movieId: string) {
    if (recording) {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Adiciona a gravação ao estado
      setRecordings([...recordings, { uri }]);
      console.log("Gravação parada:", uri);

      // Salva a review com a gravação
      await saveReview(movieId, uri);
    }
  }

  const saveReview = async (movieId: string, audioUri: string) => {
    console.log("Movie id e audio: ", movieId, " ||| ", audioUri);
    try {
      // Enviar a review para o backend
      await api.post("/reviews", {
        content: "Review gravada por áudio.",
        audioUri: audioUri,
        rating: 5,
        userId: 2,
        movieId: movieId,
      });

      // Atualizar o estado das reviews localmente após o envio
      setReviews((prevReviews) => ({
        ...prevReviews,
        [movieId]: { audioUri },
      }));

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Review gravada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar review:", error);
      Alert.alert("Erro", "Falha ao salvar review.");
    }
  };

  const playAudio = async (uri: string) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.isPlaying) {
          setPlaybackStatus(status);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
      setPlaybackStatus(null);
    }
  };

  const renderMovieItem = ({ item }: { item: MovieType }) => {
    // Verifica se há uma review para o filme atual
    const review = reviews[item.imdbID];

    // Busca a review para o filme quando ele é renderizado
    useEffect(() => {
      if (!review) {
        fetchReviewForMovie(item.imdbID!); // Chama a função para buscar a review
      }
    }, [item.imdbID]);

    return (
      <View style={styles.movieCard}>
        <Image source={{ uri: item.Poster }} style={styles.posterImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.movieTitle}>{item.Title}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{item.imdbRating}</Text>
          </View>
          {review && review.audioUri ? (
            <>
              <Icon.Button
                name={sound ? "stop" : "play-arrow"}
                backgroundColor="#6CD3AE"
                style={styles.playButton}
                onPress={() =>
                  sound ? stopAudio() : playAudio(review.audioUri)
                }
              >
                {sound ? "Stop Review" : "Play Review"}
              </Icon.Button>
              {playbackStatus && (
                <Text style={styles.playbackText}>
                  {`Tempo restante: ${
                    Math.floor(playbackStatus.durationMillis / 1000) -
                    Math.floor(playbackStatus.positionMillis / 1000)
                  }s`}
                </Text>
              )}
            </>
          ) : recording ? (
            <Icon.Button
              name="stop"
              backgroundColor="#FF6B6B"
              style={styles.microphoneButton}
              onPress={() => stopRecording(item.imdbID!)} // Use imdbID
            >
              Stop Recording
            </Icon.Button>
          ) : (
            <Icon.Button
              name="mic"
              backgroundColor="#6CD3AE"
              style={styles.microphoneButton}
              onPress={startRecording}
            >
              Record Review
            </Icon.Button>
          )}
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
          height={height - 100}
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
    borderRadius: 50,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
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
  playButton: {
    borderRadius: 50,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});
