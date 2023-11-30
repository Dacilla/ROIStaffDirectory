import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const SettingsScreen = ({ navigation }) => {
  const [fontSize, setFontSize] = useState('Medium');
  const [brightness, setBrightness] = useState(50);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    navigation.setOptions({
        headerStyle: {
          backgroundColor: '#262626', 
        },
        headerTintColor: '#FFFFFF', 
      });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Font Size:</Text>
        <Picker
          selectedValue={fontSize}
          style={[styles.picker, { backgroundColor: '#D9D9D9', color: '#262626' }]}
          onValueChange={(itemValue) => setFontSize(itemValue)}
          itemStyle={{ color: '#262626' }}
        >
          <Picker.Item label="Small" value="Small" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Large" value="Large" />
        </Picker>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Brightness:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={brightness}
          minimumTrackTintColor="#941a1d"
          maximumTrackTintColor="#D9D9D9"
          thumbTintColor="#941a1d"
          onValueChange={(value) => setBrightness(value)}
        />
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Volume:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={volume}
          minimumTrackTintColor="#941a1d"
          maximumTrackTintColor="#D9D9D9"
          thumbTintColor="#941a1d"
          onValueChange={(value) => setVolume(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#D9D9D9',
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    optionTitle: {
      marginRight: 10,
      fontSize: 18,
      color: '#262626',
    },
    picker: {
      width: 150,
      height: 40,
    },
    slider: {
      width: 200,
      height: 40,
    },
  });

export default SettingsScreen;
