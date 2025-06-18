import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';

export default function AddProductScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [discription, SetDiscription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleAddProduct = async () => {
  if (!name || !price || !discription || !selectedCategory) {
    Alert.alert('Validation', 'Please enter all fields and select category.');
    return;
  }

  setLoading(true);

  try {
    const existingData = await AsyncStorage.getItem('products');
    const parsedData = existingData ? JSON.parse(existingData) : [];

    const isDuplicate = parsedData.some(
      item => item.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Duplicate', 'Product with this name already exists.');
      setLoading(false);
      return;
    }

    const newProduct = {
      name: name.trim(),
      price: price.trim(),
      discription: discription.trim(),
      image: image.trim() || 'https://via.placeholder.com/150',
      category: selectedCategory, 
    };

    const updatedProducts = [...parsedData, newProduct];

    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

    navigation.navigate('Home');
  } catch (err) {
    Alert.alert('Error', 'Something went wrong.');
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const pickImageFromDevice = () => {
  const options = {
    mediaType: 'photo',
    quality: 1,
  };

  launchImageLibrary(options, response => {
    if (response.assets && response.assets.length > 0) {
      setImage(response.assets[0].uri);
    }
  });
};



  return (
    
    <View style={styles.container}>

        <View
                style={{
                  marginTop: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                }}
              >
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Icon name="arrow-back" size={24} color="#000" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
                
        </View>
        
      <Text style={styles.title}>Add New Product</Text>

      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder='Discription'
        value={discription}
        onChangeText={SetDiscription}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL (optional)"
        value={image}
        onChangeText={setImage}
        style={styles.input}
        />

        <TouchableOpacity
        onPress={pickImageFromDevice}
        style={{
            backgroundColor: '#ddd',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 5,
            marginTop: 8,
            alignItems: 'center',
        }}
        >
        <Text style={{ color: '#000' }}>📁 Pick Image from Device</Text>
        </TouchableOpacity>

      {/* 👉 Move Picker below Image URL */}
<View style={styles.pickerContainer}>
  <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Select Category:</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedCategory}
      onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      style={{ width: '100%' }}
    >   
      <Picker.Item label="Select" value="" />
      <Picker.Item label="Product" value="product" />
      <Picker.Item label="Accessories" value="accessory" />
    </Picker>
  </View>
</View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      )}
      {/* <Picker.Item label="-- Select Category --" value="" />
<Picker.Item label="Product" value="product" />
<Picker.Item label="Accessory" value="accessory" /> */}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  


});
