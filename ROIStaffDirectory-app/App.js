  import { Button, StatusBar, FlatList, Pressable, Text, View, ToastAndroid, Dimensions } from 'react-native';
  import * as Font from 'expo-font';
  import React, { useState, useEffect } from 'react';
  import { NavigationContainer,useFocusEffect } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import StaffDetailsScreen from './StaffDetailsScreen';
  import AddStaffScreen from './AddStaffScreen';
  import SettingsScreen from './SettingsScreen';
  import * as ScreenOrientation from 'expo-screen-orientation';

  const uri = 'http://localhost:3000/staff';

  const Stack = createStackNavigator();

  export default function App() {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [staffMembers, setStaffMembers] = useState([]);
    const {width, height} = Dimensions.get('window');

    // Load the custom font
    const loadFont = async () => {
      await Font.loadAsync({
        'Trebuchet': require('./assets/fonts/Trebuchet.ttf'),
      });
      setFontLoaded(true);
    };

    let isTablet = width > 600;
    useEffect(() => {
      if (isTablet){
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
      loadFont();
      createStaffMembersList();
    }, []);

    // Function to show a Toast message with the provided text
    // const showToast = (message) => {
    //   ToastAndroid.show(message, ToastAndroid.SHORT);
    // };

    // Update the fetchStaffMembers function to display response data in the Toast
    const createStaffMembersList = async () => {
      try {
        // showToast('Fetching staff members...');
        const response = await fetch(uri);
        const data = await response.json();
        console.log('Fetched staff members:', data); // Log fetched data
        setStaffMembers(data);
        // showToast(`Staff members fetched successfully: ${JSON.stringify(data)}`);
      } catch (error) {
        console.error('Error fetching staff members:', error);
        // showToast('Error fetching staff members.');
      }
    };

    if (!fontLoaded || staffMembers.length === 0) {
      return null; // Render nothing until the font is loaded or data is fetched
    }

    return (
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#262626" />
        <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={({ navigation }) => ({
              title: 'Main Screen',
              headerStyle: {
                backgroundColor: '#262626',
              },
              headerTintColor: '#FFFFFF',
              headerLeft: () => (
                <Button
                  onPress={() => navigation.navigate('AddStaffScreen')}
                  title="+"
                  color="#941a1d"
                />
              ),
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('SettingsScreen')}
                  title="Settings"
                  color="#941a1d"
                />
              ),
            })}
            initialParams={{ staffMembers: staffMembers, setStaffMembers: setStaffMembers }}
          />
          <Stack.Screen name="StaffDetails" component={StaffDetailsScreen} options={{ title: 'Staff Details' }} />
          <Stack.Screen name="AddStaffScreen" component={AddStaffScreen} options={{ title: 'Add Staff Member' }} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const MainScreen = ({ navigation, route }) => {
    const { staffMembers, setStaffMembers } = route.params;

    useEffect(() => {
      setStaffMembers(staffMembers);
    }, [staffMembers]);

    const fetchStaffMembers = async () => {
      try {
        // showToast('Fetching staff members...');
        const response = await fetch(uri);
        const data = await response.json();
        
        // Delay by 500 milliseconds to ensure the list is received before loading the UI
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStaffMembers(data);
        // showToast('Staff members fetched successfully.');
        console.log("New Staff Members list: " + JSON.stringify(staffMembers));
      } catch (error) {
        console.error('Error fetching staff members:', error);
        // showToast('Error fetching staff members.');
      }
    };

    const showToast = (message) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    };

  const handleRefresh = () => {
    // showToast('Refreshing staff list...');
    fetchStaffMembers();
  };

    const renderItem = ({ item }) => (
      <Pressable onPress={() => handleStaffMemberPress(item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.Name}</Text>
        </View>
      </Pressable>
    );

    const handleStaffMemberPress = (staffMember) => {
      console.log('Pressed:', staffMember);
      navigation.navigate('StaffDetails', { staffMember });
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={staffMembers}
          keyExtractor={(item) => (item.Id ? item.Id.toString() : Math.random().toString())}
          renderItem={renderItem}
        />
      </View>
    );
  };


  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#D9D9D9',
    },
    header: {
      backgroundColor: '#d9d9d9',
      paddingTop: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontFamily: 'Trebuchet',
      fontSize: 20,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContainer: {
      backgroundColor: '#ededed',
      padding: 10,
      marginVertical: 5,
      width: '100%',
      alignSelf: 'stretch',
    },
    itemText: {
      fontFamily: 'Trebuchet',
      fontSize: 16,
      textAlign: 'center',
    },
  };

  // Function to handle staff member press action (navigate to profile, etc.)
  // const handleStaffMemberPress = (staffMember) => {
  //   console.log('Pressed:', staffMember);
  // };

