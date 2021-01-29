import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const SimpleMarker = ({ defibrillator, onMarkerSelected }) => {
  const tags = defibrillator.tags;

  const dayNightStyle = !tags || !tags.opening_hours || tags.opening_hours !== '24/7' ? styles.simpleDayMarkerStyle : styles.simpleDayNightMarkerStyle;

  return (
    <Marker
      coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
      tracksViewChanges={false}
      onPress={() => onMarkerSelected(defibrillator)}
    >
      <View style={dayNightStyle}>
        <Image style={styles.simpleImageStyle} source={require('../../assets/marker.png')} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  simpleImageStyle: {
    width: 20,
    height: 20,
    margin: 4,
    alignSelf: 'center',
  },
  simpleDayMarkerStyle: {
    height: 34,
    width: 34,
    backgroundColor: 'rgba(0, 153, 57, 1)',
    borderRadius: 50,
    borderColor: 'orange',
    borderWidth: 3,
  },
  simpleDayNightMarkerStyle: {
    height: 30,
    width: 30,
    backgroundColor: 'rgba(0, 153, 57, 1)',
    borderRadius: 50,
  }
});

export default SimpleMarker;