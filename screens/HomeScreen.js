import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  ActivityIndicator,
  showAll,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback, TextInput } from 'react-native';


export default function HomeScreen({onLogout}) {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessories, setAccessories] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllAccessories, setShowAllAccessories] = useState(false);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);

  
  const [productList, setProductList] = useState([]);
const [accessoryList, setAccessoryList] = useState([]);

useEffect(() => {
  if (isFocused) {
    loadProducts();
  }
}, [isFocused]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
  try {
    const data = await AsyncStorage.getItem('products');
    if (data) {
      const parsed = JSON.parse(data);

      const productsOnly = parsed.filter(item => item.category === 'product');
      const accessoriesOnly = parsed.filter(item => item.category === 'accessory');

      setProductList(productsOnly);
      setAccessoryList(accessoriesOnly);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const handleSearch = (text) => {
  setSearchQuery(text);

  const lower = text.toLowerCase();

  const filteredProd = productList.filter((item) =>
    item.name.toLowerCase().startsWith(lower)
  );

  const filteredAcc = accessoryList.filter((item) =>
    item.name.toLowerCase().startsWith(lower)
  );

  setFilteredProducts(filteredProd);
  setFilteredAccessories(filteredAcc);
};

  const handleDelete = async (name) => {
  const data = await AsyncStorage.getItem('products');
  const parsed = JSON.parse(data);

  const updated = parsed.filter((p) => p.name !== name);
  await AsyncStorage.setItem('products', JSON.stringify(updated));
  loadProducts(); // refresh lists
};


  const logoutHandler = () => {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.replace('Login');
        },
      },
    ],
    { cancelable: true }
  );
};

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: onLogout },
    ]);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flex: 1,
        margin: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: '100%', height: 120 }}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={() => handleDelete(item.name)}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: 12,
          padding: 4,
        }}
      >
        <Icon name="delete-forever" size={18} color="black" />
      </TouchableOpacity>
      <View style={{ padding: 8 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
        <Text>${item.price}</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

      return (
        <TouchableWithoutFeedback
                onPress={() => {
            Keyboard.dismiss(); 
            if (searchQuery.trim() === '') {
              setSearchVisible(false); 
            }
          }}
        >
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                  {/* Header */}
                  <View
                    style={{
                      marginTop: 40,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                    }}
                  >
                    <Icon name="arrow-back" size={24} color="#000" style={{ marginLeft: 5 }} />
                    {
                      searchVisible ? (
                        <TextInput
                          style={{
                            backgroundColor: '#eee',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            flex: 1,
                            marginLeft: 10,
                            marginRight:10
                          }}
                          placeholder="Search..."
                          value={searchQuery}
                          onChangeText={handleSearch}
                          autoFocus
                        />
                      ) : (
                        <Icon
                          name="search"
                          size={24}
                          color="#000"
                          style={{ marginLeft: 200 }}
                          onPress={() => setSearchVisible(true)}
                        />
                      )
                    }

                    <TouchableOpacity onPress={confirmLogout} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="logout" size={20} color="#000" style={{ marginRight: 6 }} />
                    </TouchableOpacity>
                  </View>

                  {/* Title */}
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hi-Fi Shop & Service</Text>
                    <Text style={{ color: '#888', marginTop: 4 }}>
                      Audio shop on Rustaveli Ave 57.
                    </Text>
                    <Text style={{ color: '#888', marginTop: 4 }}>
                      This Shop offers both product and services
                    </Text>
                  </View>

                  {/* Product Section */}
                  <ScrollView style={{ marginTop: 20, paddingHorizontal: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        paddingHorizontal: 6,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Products {productList.length}
                      </Text>
                      <TouchableOpacity onPress={() => setShowAllProducts(!showAllProducts)}>
                        <Text style={{ color: '#007AFF' }}>{showAllProducts ? 'Show less' : 'Show all'}</Text>
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      //data={showAllProducts ? productList : productList.slice(0, 2)}
                      data={searchQuery ? filteredProducts : (showAllProducts ? productList : productList.slice(0, 2))}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => 'product_' + index}
                      numColumns={2}
                    />

                  
                  {/* Accessory Section */}
                  <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        paddingHorizontal: 6,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Accessories {accessoryList.length}
                      </Text>
                      <TouchableOpacity onPress={() => setShowAllAccessories(!showAllAccessories)}>
                        <Text style={{ color: '#007AFF' }}>
                          {showAllAccessories ? 'Show less' : 'Show all'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {accessoryList.length === 0 ? (
                      <Text style={{ textAlign: 'center', color: '#999' }}>No Accessories Found</Text>
                    ) : (
                      <FlatList
                        //data={showAllAccessories ? accessoryList : accessoryList.slice(0, 2)}
                        data={searchQuery ? filteredAccessories : (showAllAccessories ? accessoryList : accessoryList.slice(0, 2))}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => 'accessory_' + index}
                        numColumns={2}
                      />
                    )}
                  </View>

                  </ScrollView>
                    {/*add product button */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddProduct')}
                    style={{
                      position: 'absolute',
                      bottom: 25,
                      right: 25,
                      backgroundColor: '#0A84FF',
                      padding: 20,
                      borderRadius: 40,
                      elevation: 5,
                    }}
                  >
                    <Icon name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
          </View>
        </TouchableWithoutFeedback>
 );
}
