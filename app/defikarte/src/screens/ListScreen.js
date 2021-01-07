import React, { useEffect, useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import distanceBetweenPoints from '../helpers/coordinateCalc.js'
import { Context as LocationContext } from '../context/LocationContext';
import useDefibrillators from '../hooks/useDefibrillators';
import DefiItem from '../components/DefiItem';

const ListScreen = ({ navigation }) => {
  const [defibrillators] = useDefibrillators(navigation);
  const { state: userLocation, enableLocationTracking } = useContext(LocationContext);
  const [currentConfig, setCurrentConfig] = useState('locationDisabled');
  const [defisNearLocation, setDefisNearLocation] = useState([]);

  const locationConfig = {
    locationDisabled: {
      render: () => {
        const locationIcon = !userLocation.enabled ? 'location-disabled' : !userLocation.location ? 'location-searching' : 'my-location';
        return (
          <>
            <MaterialIcons style={styles.noLocationIconStyle} name='location-disabled' />
            <Text style={styles.noLocationTextStyle}>Aktiviere deinen Standort um Defibrillatoren in deiner Nähe anzuzeigen.</Text>
            <TouchableOpacity onPress={() => enableLocationTracking()}>
              <MaterialIcons style={styles.actLocationIconStyle} name={locationIcon} />
            </TouchableOpacity>
          </>
        )
      }
    },
    locationSearching: {
      render: () => {
        return (
          <Text style={styles.noLocationTextStyle}>Keine Defibrillatoren in deiner Nähe (2km) verfügbar .</Text>
        );
      }
    },
    location: {
      render: () => {
        return (
          <FlatList
            data={defisNearLocation}
            keyExtractor={(def) => def.id.toString()}
            renderItem={({ item }) => {
              return (
                <DefiItem defibrillator={item} />
              );
            }}
          />
        );
      }
    }
  }

  const getDefisNearLocation = () => {
    return defibrillators
      .filter(d => {
        if (userLocation.location) {
          const dist = distanceBetweenPoints(d.lat, d.lon, userLocation.location.latitude, userLocation.location.longitude);
          if (dist < 2000) {
            d.distance = dist;
            return true;
          }
        }

        return false;
      })
      .sort((d1, d2) => {
        return d1.distance - d2.distance;
      });
  };

  const getLocationState = () => {
    const defiNearLocCount = userLocation.location ? defisNearLocation.length : 0;
    return !userLocation.enabled ? 'locationDisabled' : !userLocation.location && defiNearLocCount < 1 ? 'locationSearching' : 'location';
  };

  useEffect(() => {
    enableLocationTracking();
  }, []);

  useEffect(() => {
    setDefisNearLocation(getDefisNearLocation());
  }, [defibrillators, userLocation])

  useEffect(() => {
    setCurrentConfig(getLocationState());
  }, [userLocation, defisNearLocation]);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>Defibrillatoren in deiner Nähe</Text>
      <>{locationConfig[currentConfig].render()}</>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Main')}>
        <Feather name='map' style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: 'green',
    padding: 5,
    bottom: 0,
    position: 'absolute',
    alignSelf: 'baseline',
    borderRadius: 5,
    margin: 5,
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'white'
  },
  noLocationIconStyle: {
    alignSelf: 'center',
    margin: 50,
    color: 'grey',
    fontSize: 100,
  },
  noLocationTextStyle: {
    margin: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  actLocationIconStyle: {
    alignSelf: 'center',
    margin: 20,
    color: '#007AFF',
    fontSize: 50,
  },
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default ListScreen;