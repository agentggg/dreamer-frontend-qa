import { StyleSheet, Text, View, Keyboard, KeyboardAvoidingView, Alert, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native'
import React, {useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { LoginStatus } from '../../context/LoginStatus';
import { PremiumUsers } from '../../context/Premium';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const Login = ({navigation}) => {
    SecureStore.deleteItemAsync('userProfile')
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [expoPushToken, setExpoPushToken] = useState(null)
    const [isSignedIn, setIsSignedIn] = useContext(LoginStatus)
    const [isPremiumUser, setPremiumUser] = useContext(PremiumUsers)
    // used to set sign in value
    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            }
            if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } 
        // else {
        //     alert('Must use physical device for Push Notifications');
        // }
        
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        }
        
        return token;
        }
    useEffect(()=>{
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
     })

    const postApiResponse = async () => {
        try {  
            let replaceWord = expoPushToken.replace('ExponentPushToken','');
            let replaceOpenBracket = replaceWord.replace('[','');
            let tokenToPush = replaceOpenBracket.replace(']','');
            const pushTokenData = {username:username, deviceMake:Device.brand, deviceModel:Device.modelName, token:tokenToPush}
            const postApiCall = await axios.post(`http://10.0.0.211:8000/login_verification`,{username:username, password:password})
            const apiResponseEncode =  await JSON.stringify(postApiCall.data)
            await SecureStore.setItemAsync('userProfile', apiResponseEncode)
            const pushTokenApiCall = await axios.post(`http://10.0.0.211:8000/save_push_token`,pushTokenData)
            if (pushTokenApiCall.data == 'successful'){
                setIsSignedIn(true)
            if (postApiCall.data['premium'] === 'notPremium'){
            }else{
                setPremiumUser(true)
                }
            }
            else{
                Alert.alert('❌', 'Username and/or password is invalid. Please try again.')
            }
        }
        catch (err) {
            console.log(err)
            setIsSignedIn(true)
            setPremiumUser(true)
            Alert.alert('❌', 'Username and/or password is invalid. Please try again.')
          }   
    }

    return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.username}
                            value={username}
                            autoCapitalize='none'
                            autoCorrect={false}
                            onChangeText={(text) => {
                                setUserName(text) 
                            }}
                            placeholder="username"
                            clearButtonMode="always"
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.password}
                            value={password}
                            autoCapitalize='none'
                            autoCorrect={false}
                            onChangeText={(text) => {
                                setPassword(text) 
                            }}
                            placeholder="password"
                            secureTextEntry={true}
                            clearButtonMode="always"
                            returnKeyType="next"
                        />
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.loginButton} onPress={postApiResponse} title="Log in">
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.loginButton} onPress={()=>navigation.navigate('CreateAccount')} title="Create">
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column', flex: 1,
        backgroundColor: 'black', 
      },
    form:{
        flexDirection: 'column', flex: 1,
        justifyContent: 'center', alignContent: 'center',  
        
    },
    username:{
        justifyContent: 'center', alignContent: 'center', 
        backgroundColor: 'white',
        fontWeight: '400', fontSize: '25%',
        textAlign: 'center',
        height: '15%',
        borderWidth: '20%', borderRadius: '30%'
    },
    password:{
        justifyContent: 'center', alignContent: 'center', 
        backgroundColor: 'white',
        fontWeight: '400', fontSize: '25%',
        textAlign: 'center',
        marginBottom: '20%', 
        height: '15%',
        borderWidth: '20%', borderRadius: '30%'
    },
    buttons:{
        flexDirection: 'row',
        justifyContent: 'space-around', alignContent: 'center', textAlign: 'cetner',
    },
    loginButton:{
        color: 'white',
        
    },
    buttonText:{
        color: 'white',
        fontSize: '40%'
    },
})