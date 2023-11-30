import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const StaffDetailsScreen = ({ route, navigation }) => {
    const { staffMember } = route.params;
    const [departmentDictionary, setDepartmentDictionary] = useState({});
    [selectedDepartment, setSelectedDepartment] = useState('');

    // State variables to track changes in staff details
    const [updatedId, setUpdatedId] = useState(staffMember.Id.toString());
    const [updatedName, setUpdatedName] = useState(staffMember.Name);
    const [updatedPhone, setUpdatedPhone] = useState(staffMember.Phone);
    const [updatedDepartment, setUpdatedDepartment] = useState(staffMember.Department);
    const [updatedStreet, setUpdatedStreet] = useState(staffMember.Address.Street);
    const [updatedZIP, setUpdatedZIP] = useState(staffMember.Address.ZIP);
    const [updatedState, setUpdatedState] = useState(staffMember.Address.State);
    const [updatedCountry, setUpdatedCountry] = useState(staffMember.Address.Country);
  
  // Fetch department dictionary when the component mounts
  useEffect(() => {
    // Set header options dynamically
    navigation.setOptions({
        headerStyle: {
          backgroundColor: '#262626',
        },
        headerTintColor: '#FFFFFF',
      });
    fetchDepartmentDictionary();
  }, [navigation]);

  const fetchDepartmentDictionary = async () => {
    try {
      const response = await fetch('http://192.168.1.115:3000/departments');
      const data = await response.json();
      console.log("Departments received response: " + data.response)
      setDepartmentDictionary(data);

      // Set the selected department based on the staff member's department ID
      const staffMemberDepartmentId = staffMember.Department.toString();
      console.log("Setting department to: " + data[staffMemberDepartmentId]);
      setSelectedDepartment(data[staffMemberDepartmentId]);
      console.log("Set department to: " + selectedDepartment);
    } catch (error) {
      console.error('Error fetching department dictionary:', error);
    }
  };

  // Get department name based on ID from the dictionary
  const getDepartmentName = (departmentId) => {
    return departmentDictionary[departmentId] || 'Unknown Department';
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this staff member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.115:3000/staff/${staffMember.Id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                // Handle successful deletion
                Alert.alert('Success', 'Staff member deleted successfully!');
                navigation.navigate('MainScreen');
              } else {
                // Handle deletion failure
                Alert.alert('Error', 'Failed to delete staff member.');
              }
            } catch (error) {
              console.error('Error deleting staff member:', error);
              Alert.alert('Error', 'Failed to delete staff member.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveChanges = async () => {
    try {
      const updatedStaffMember = {
        Id: parseInt(updatedId),
        Name: updatedName,
        Phone: updatedPhone,
        Department: parseInt(updatedDepartment),
        Address: {
          Street: updatedStreet,
          ZIP: updatedZIP,
          State: updatedState,
          Country: updatedCountry,
        },
      };

      console.log('Sending PUT request with payload:', JSON.stringify(updatedStaffMember));

      const response = await fetch(`http://192.168.1.115:3000/staff/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStaffMember),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const textResponse = await response.text();
    console.log('Text response:', textResponse);

    if (response.ok) {
      const responseData = JSON.parse(textResponse);
      console.log('Received response:', responseData);

      // Handle success scenario
      Alert.alert('Success', 'Changes saved successfully!');

      // Navigate back to the main screen upon successful save
      navigation.navigate('MainScreen');
    } else {
      // Handle failure scenario
      Alert.alert('Error', 'Failed to save changes.');
    }
  } catch (error) {
    console.error('Error updating staff profile:', error);
  }
};

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#D9D9D9',
      }}
    >
          <Text
              style={{ fontSize: 24, marginBottom: 20 }}
          >{`Name: ${staffMember.Name}`}</Text>

          <View style={{ width: "100%" }}>
              <Text>ID:</Text>
              <TextInput
                  value={updatedId}
                  onChangeText={setUpdatedId}
                  style={{
                      borderColor: "black",
                      borderWidth: 1,
                      marginBottom: 10,
                  }}
              />
          </View>

          <View style={{ width: "100%" }}>
              <Text>Name:</Text>
              <TextInput
                  value={updatedName}
                  onChangeText={setUpdatedName}
                  style={{
                      borderColor: "black",
                      borderWidth: 1,
                      marginBottom: 10,
                  }}
              />
          </View>

          <View style={{ width: "100%" }}>
              <Text>Phone:</Text>
              <TextInput
                  value={updatedPhone}
                  onChangeText={setUpdatedPhone}
                  style={{
                      borderColor: "black",
                      borderWidth: 1,
                      marginBottom: 10,
                  }}
              />
          </View>

          <View style={{ width: '100%' }}>
        <Text>Dept:</Text>
        {Object.keys(departmentDictionary).length > 0 ? (
          <Picker
            selectedValue={updatedDepartment.toString()}
            onValueChange={(itemValue) => setUpdatedDepartment(parseInt(itemValue))}
            style={{ marginBottom: 10 }}>
            {Object.entries(departmentDictionary).map(([id, departmentName]) => (
              <Picker.Item label={departmentName} value={id} key={id} />
            ))}
          </Picker>
        ) : (
          <Text>Loading departments...</Text>
        )}
      </View>
          <View style={{ width: "100%" }}>
              <Text>Street:</Text>
              <TextInput
                  value={updatedStreet}
                  onChangeText={setUpdatedStreet}
                  style={{
                      borderColor: "black",
                      borderWidth: 1,
                      marginBottom: 10,
                  }}
              />
          </View>
          <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
              <View style={{ width: "48%" }}>
                  <Text>ZIP:</Text>
                  <TextInput
                      value={updatedZIP}
                      onChangeText={setUpdatedZIP}
                      style={{
                          borderColor: "black",
                          borderWidth: 1,
                          marginBottom: 10,
                      }}
                  />
              </View>
              <View style={{ width: "48%" }}>
                  <Text>State:</Text>
                  <Picker
                      selectedValue={updatedState}
                      onValueChange={(itemValue) => setUpdatedState(itemValue)}
                      style={{ marginBottom: 10 }}
                  >
                      <Picker
                          selectedValue={staffMember.Address.State}
                          style={{ marginBottom: 10 }}
                      >
                          <Picker.Item label="NSW" value="NSW" />
                          <Picker.Item label="ACT" value="ACT" />
                          <Picker.Item label="VIC" value="VIC" />
                          <Picker.Item label="QLD" value="QLD" />
                      </Picker>
                  </Picker>
              </View>
          </View>
          <View style={{ width: "100%" }}>
              <Text>Country:</Text>
              <TextInput
                  value={updatedCountry}
                  onChangeText={setUpdatedCountry}
                  style={{
                      borderColor: "black",
                      borderWidth: 1,
                      marginBottom: 10,
                  }}
              />
          </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Button title="Delete" color="#941a1d" onPress={handleDelete} />
        <Button title="Save changes" color="black" onPress={handleSaveChanges} />
      </View>
      </View>
  );
};

export default StaffDetailsScreen;
