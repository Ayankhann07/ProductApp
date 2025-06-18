import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Image } from "react-native";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [secure, setSecure] = useState(true);

 const handleLogin = async () => {
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        console.log('Login success:', data.token);
        // ✅ Navigate to Home screen here
        onLogin(); // Use replace to prevent going back to login
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };



return (
        <View style={styles.container}>
            <Image
            source={require(".././assets/img/Gemini_Generated_Image_jda22vjda22vjda2.png")}
            style={{
                width: 350,
                height: 300,
                resizeMode: "contain",
                alignSelf: "center",
                marginBottom: 20,
            }}
        />

      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Text style={{ fontSize: 20, color: '#aaa', marginRight: 5 }}>@</Text>
        <TextInput
          placeholder="Email ID"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

        <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#aaa" />
            <TextInput
                placeholder="Password"
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Icon
                name={secure ? 'visibility-off' : 'visibility'}
                size={20}
                color="#aaa"
                />
            </TouchableOpacity>
        </View>
      <TouchableOpacity>
            <Text style={{ marginLeft: 210, marginTop:2, color:'#063970', fontWeight:'bold' }}>
                Forgot password?
            </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1.5, backgroundColor: "#ccc" }} />
          <Text style={{ marginHorizontal: 10, fontWeight: "bold", color: "#555" }}>OR</Text>
          <View style={{ flex: 1, height: 1.5, backgroundColor: "#ccc" }} />
      </View>

            
<TouchableOpacity
  style={{
    backgroundColor: "#eeeee4",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  }}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('C:/Users/Ayan/ProductApp/assets/img/icons8-google-48.png')}
      style={{ width: 18, height: 18, marginLeft: -80 }}
    />
    <Text style={{ color: "#063970", fontSize: 14, fontWeight: "500", marginLeft:70 }}>
      Login with Google
    </Text>
  </View>
</TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, fontWeight:'bold' }}>
              <Text style={{color:'#333333'}}>New to logistics? </Text>
              <TouchableOpacity onPress={() => console.log("Navigate to Register screen")}>
                <Text style={{ color: "#0066cc", fontWeight: "bold" }}>Register</Text>
              </TouchableOpacity>
            </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 30, justifyContent: 'center', flex: 1, backgroundColor:'#FFFFFF' },
  title: { fontSize: 40, fontWeight: 'bold', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20
  },
  input: { flex: 1, marginLeft: 10 },
  loginButton: {
    backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20
  },
  loginText: { color: '#fff', fontWeight: 'bold' }
});
