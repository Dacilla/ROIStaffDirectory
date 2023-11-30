import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const AddStaffScreen = ({ navigation }) => {
  const [departmentDictionary, setDepartmentDictionary] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedDepartment, setUpdatedDepartment] = useState('');
  const [updatedStreet, setUpdatedStreet] = useState('');
  const [updatedZIP, setUpdatedZIP] = useState('');
  const [updatedState, setUpdatedState] = useState('');
  const [updatedCountry, setUpdatedCountry] = useState('');

  const uri = 'http://192.168.1.115:3000/';

  useEffect(() => {
    fetchDepartmentDictionary();
    navigation.setOptions({
        headerStyle: {
          backgroundColor: '#262626',
        },
        headerTintColor: '#FFFFFF',
      });
  }, []);

  const fetchDepartmentDictionary = async () => {
    try {
      const response = await fetch(uri + "departments/");
      const data = await response.json();
      setDepartmentDictionary(data);

      const firstDepartmentId = Object.keys(data)[0];
      setSelectedDepartment(data[firstDepartmentId]);
    } catch (error) {
      console.error('Error fetching department dictionary:', error);
    }
  };

  const handleAddStaffMember = async () => {  
  console.log("Attempting to save")
  const newStaffMember = {
    Name: updatedName,
    Phone: updatedPhone,
    Department: parseInt(selectedDepartment),
    Address: {
      Street: updatedStreet,
      ZIP: updatedZIP,
      State: updatedState,
      Country: updatedCountry,
    },
  };

  console.log('Attempting POST request with payload:', JSON.stringify(newStaffMember));

  if (
    !updatedName || !updatedPhone || !updatedStreet || !updatedZIP || !updatedCountry ||
    updatedName.trim() === '' ||
    updatedPhone.trim() === '' ||
    updatedStreet.trim() === '' ||
    updatedZIP.trim() === '' ||
    updatedCountry.trim() === ''
  ) {
    Alert.alert('Error', 'Please fill in all fields.');
    return;
  }



    try {
      const response = await fetch(uri = 'staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaffMember),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const textResponse = await response.text();
      console.log('Text response:', textResponse);

      if (response.ok) {
        // Handle success scenario
        Alert.alert('Success', 'Staff member created successfully!');

      } else {
        // Handle failure scenario
        Alert.alert('Error', 'Failed to create staff member.');
      }
    } catch (error) {
      console.error('Error creating staff member:', error);
      Alert.alert('Error', 'Failed to create staff member.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#D9D9D9' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Add Staff Member</Text>
      <View style={{ width: '100%' }}>
        <Text>Name:</Text>
        <TextInput
          placeholder="Enter name..."
          style={{ borderColor: 'black', borderWidth: 1, marginBottom: 10 }}
          onChangeText={setUpdatedName}
        />
      </View>

      <View style={{ width: '100%' }}>
        <Text>Phone:</Text>
        <TextInput
          placeholder="Enter phone..."
          style={{ borderColor: 'black', borderWidth: 1, marginBottom: 10 }}
          onChangeText={setUpdatedPhone}
        />
      </View>

      <View style={{ width: '100%' }}>
        <Text>Dept:</Text>
        {Object.keys(departmentDictionary).length > 0 ? (
          <Picker
          selectedValue={selectedDepartment}
          onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
          style={{ marginBottom: 10 }}>
          {Object.entries(departmentDictionary).map(([id, departmentName]) => (
            <Picker.Item label={departmentName} value={id} key={id} />
          ))}
        </Picker>
        ) : (
          <Text>Loading departments...</Text>
        )}
      </View>

      <View style={{ width: '100%' }}>
        <Text>Street:</Text>
        <TextInput
          placeholder="Enter street..."
          style={{ borderColor: 'black', borderWidth: 1, marginBottom: 10 }}
          onChangeText={setUpdatedStreet}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <View style={{ width: '48%' }}>
          <Text>ZIP:</Text>
          <TextInput
            placeholder="Enter ZIP..."
            style={{ borderColor: 'black', borderWidth: 1, marginBottom: 10 }}
            onChangeText={setUpdatedZIP}
          />
        </View>

        <View style={{ width: '48%' }}>
          <Text>State:</Text>
          <Picker
            selectedValue={updatedState}
            onValueChange={(itemValue) => setUpdatedState(itemValue)}
            style={{ marginBottom: 10 }}>
            <Picker.Item label="NSW" value="NSW" />
            <Picker.Item label="ACT" value="ACT" />
            <Picker.Item label="VIC" value="VIC" />
            <Picker.Item label="QLD" value="QLD" />
            <Picker.Item label="NT" value="NT" />
            <Picker.Item label="TAS" value="TAS" />
            <Picker.Item label="WA" value="WA" />
            <Picker.Item label="SA" value="SA" />
            <Picker.Item label="N/A" value="N/A" />
            </Picker>
        </View>
      </View>

      <View style={{ width: '100%' }}>
        <Text>Country:</Text>
        <TextInput
          value="Australia"
          placeholder="Enter country..."
          style={{ borderColor: 'black', borderWidth: 1, marginBottom: 10 }}
          onChangeText={setUpdatedCountry}
        />
      </View>

      <Button title="Add Staff Member" color="#941a1d" onPress={handleAddStaffMember} />
    </View>
  );
};

export default AddStaffScreen;
