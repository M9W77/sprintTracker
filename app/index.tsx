import React, { useEffect, useState } from "react";
import { Text, View, Button, Platform, PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Function to check and request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app requires access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // iOS doesn't need explicit location permission prompt.
      return true;
    }
  };

  // Function to get the current location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setErrorMsg("Location permission denied");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setErrorMsg(""); // Clear any previous error messages
      },
      (error) => {
        console.error(error);
        setErrorMsg("Failed to get location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // Fetch location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {location ? (
        <Text>
          Latitude: {location.coords.latitude}, Longitude:{" "}
          {location.coords.longitude}
        </Text>
      ) : (
        <Text>{errorMsg || "Fetching location..."}</Text>
      )}
      <Button title="Refresh Location" onPress={getCurrentLocation} />
    </View>
  );
}
