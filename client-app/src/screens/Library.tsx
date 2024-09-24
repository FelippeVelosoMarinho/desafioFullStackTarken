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
  Modal,
  Button,
  TouchableOpacity,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

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

  useEffect(() => {
    let interval;

    if (recording) {
      // Inicia o intervalo quando a gravação começa
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // Limpa o intervalo quando a gravação para
      clearInterval(interval);
    }

    // Retorna uma função de limpeza para o intervalo
    return () => clearInterval(interval);
  }, [recording]); // Dependência em 'recording'

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
        setIsRecordingModalVisible(true);
        setRecordingTime(0);
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
      setIsRecordingModalVisible(false);
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

  const deleteReview = async (movieId: string) => {
    try {
      await api.delete(`/reviews/movie/${movieId}`);
      setReviews((prevReviews) => {
        const newReviews = { ...prevReviews };
        delete newReviews[movieId];
        return newReviews;
      });
      Toast.show({
        type: "success",
        text1: "Review excluída",
        text2: "A review foi excluída com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir review:", error);
      Alert.alert("Erro", "Falha ao excluir review.");
    } finally {
      setShowDeleteModal(false);
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedMovie(item.imdbID);
                  setShowDeleteModal(true);
                }}
              >
                <Icon name="delete" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.playButtonContainer}>
                {playbackStatus && (
                  <Text style={styles.playbackText}>
                    {`${
                      Math.floor(playbackStatus.durationMillis / 1000) -
                      Math.floor(playbackStatus.positionMillis / 1000)
                    }s`}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() =>
                    sound ? stopAudio() : playAudio(review.audioUri)
                  }
                >
                  <Icon
                    name={sound ? "stop" : "play-arrow"}
                    size={24}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : recording ? (
            <TouchableOpacity
              style={styles.microphoneButton}
              onPressOut={() => stopRecording(item.imdbID!)}
            >
              <Icon name="stop" size={24} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.microphoneButton}
              onPressIn={() => startRecording()}
            >
              <Icon name="mic" size={24} color="#FFF" />
            </TouchableOpacity>
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

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Modal
        visible={isRecordingModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentMessage}>
            <Text style={styles.modalRecordMessage}>
              <Icon name="circle" size={24} color="red" />
              Keep Holding to Record
            </Text>
            <Text style={styles.modalRecordMessage}>
              Time: {recordingTime}s
            </Text>
          </View>
        </View>
      </Modal>
      {showDeleteModal && (
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete audio</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete ”The call of the Wild” review?
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowDeleteModal(false)}
                  color="#A1A1A1"
                />
                <Button
                  title="Delete"
                  onPress={() => selectedMovie && deleteReview(selectedMovie)}
                  color="#FE6D8E"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    backgroundColor: "#4CAF50", // Cor de fundo verde
    borderRadius: 50,
    height: 60,
    width: 60, // Ajuste para tornar o botão circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  playButton: {
    backgroundColor: "#A1A1A1", // Cor de fundo azul
    borderRadius: 50,
    height: 60,
    width: 60, // Ajuste para tornar o botão circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  deleteButton: {
    backgroundColor: "#FF6B6B", // Cor de fundo vermelho
    borderRadius: 50,
    height: 45,
    width: 45, // Ajuste para tornar o botão circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android
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
  buttonContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playButtonContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente
  },
  modalContainer: {
    width: "90%",
    height: "65%",
    top: 162,
    left: 17,
    borderRadius: 40,
    opacity: 0.9,
    color: "#FFF",
    backgroundColor: "#12153D",
  },
  modalContentMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "80%",
    height: "50%",
    padding: 20,
    display: "flex",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#12153D",
    marginBottom: 10,
    textAlign: "left",
  },
  modalMessage: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalRecordMessage: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 20,
    textAlign: "right",
  },
  modalButtons: {
    flexDirection: "column",
    gap: 16,
  },
});
