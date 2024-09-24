import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Library() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Library</Text>
      <View style={styles.centerContainer}>
        <Image source={require("../assets/loupe.png")} style={styles.image} />
        <Text style={styles.subtitle}>
            It looks like there are no movies in your library! Go to your web
            application and add some!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
    
    paddingTop: 50, 
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
    textAlign: "left",
    marginLeft: 20,
    marginBottom: 14,
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
