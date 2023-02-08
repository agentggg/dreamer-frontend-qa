import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, SafeAreaView, ActivityIndicator, Button, TextInput, TouchableOpacity, Alert, Platform } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';  
import { useQuery } from "react-query"
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'
import * as SMS from 'expo-sms'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

const ManangeFriends = () => {
    const [newUserView, setNewUserView] = useState(false)
    const [friendRequestView, setFriendRequestView] = useState(false)
    const [number, setNumber] = useState(null)
    const [friendRequestName, setFriendRequestName] = useState(null)
    const [expoPushToken, setExpoPushToken] = useState(null)
    const [notification, setNotification] = useState(null)
    const notificationListener = useRef();
    const responseListener = useRef();
    
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

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
            console.log(token);
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
    const AxiosGettData = async()=>{
        const userProfileInfo = await SecureStore.getItemAsync('userProfile')
        const userProfileJson = JSON.parse(userProfileInfo)
        const profileName = userProfileJson['profile_name']
        const postApiCall = await axios.post(`http://10.0.0.211:8000/friend_list`, {profileName:profileName})
            return(postApiCall.data)
            // returns an array of arrays
    }
    const sendFriendRequest = async()=>{
        const postRequest = await axios.post(`http://10.0.0.211:8000/send_friend_request`,{friendRequset:friendRequestName})
        if (postRequest.data == "notRegistered"){
            Alert.alert('❌', "Can't find user. Let's send them an invite to join")
            setFriendRequestView(false)
            setNewUserView(true)
        }
        else{
            const postRequest = await axios.post(`http://10.0.0.211:8000/send_notifications`,{token:expoPushToken, title:'test', message:'testing'})
            Alert.alert('✅', "Friend request sent")
            setFriendRequestName(null)
            setFriendRequestView(false)
        }
    }
    const registerNewUser = async()=>{
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            const { result } = await SMS.sendSMSAsync(
                [number],
                'My sample HelloWorld message',
            )
            setNumber(null)
            setNewUserView(false)
            // do your SMS stuff here
        } else {
            console.log('error')
            // misfortune... there's no SMS available on this device
        }

    }

    const {data:dataLoaded, isLoading: dataIsLoading, error: dataLoadingError} = useQuery("postApiCall", AxiosGettData)
    if (dataIsLoading)  return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="red"/>
          <Text style={styles.alert}>Unlocking the revelations 🔐</Text>
        </View>
    )
    if (dataLoadingError)return (
    <View style={styles.container}>
        <Text style={styles.alert}>Error unlocking the revelations. Try again later 😃</Text>
    </View>
    )
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView>
                <TouchableOpacity onPress={() => {setFriendRequestView(true)}}><Icon name="add" color={'#6ba1c4'} size={45} style={styles.addIcon}/></TouchableOpacity>
                <Text style={styles.viewHeader}>Manange Friends</Text>
                <ScrollView style={styles.listHeader}> 
                    <View style={styles.listHeader}>
                    {dataLoaded.map((eachName, index)=>{
                            return(
                                <View key={`${new Date().toString()}-${index}`}>
                               
                                    <Text style={styles.eachFriendName}>*    {eachName}</Text>
                            
                                </View>
                            )
                        })} 
                    </View>
                   <View >
                    {friendRequestView ? <View style={styles.addFriends}>
                        <TextInput
                            style={styles.textBox}
                            value={friendRequestName}
                            onChangeText={(text) => {
	                        setFriendRequestName(text) 
	                        }}
                            placeholder="friend username"
                            multiline={false}
                            autoCapitalize='none'
                            autoCorrect={false}
                            returnKeyType='Send'
                        />
                        <Text>Enter friend username</Text>
                        <Button 
                            style={styles.sendRequest}
                            onPress={(sendFriendRequest)}
                            title='Send Request'
                        />
                    </View> : 
                    <></>}
                   </View>
                   <View>
                    {newUserView ? <View style={styles.addFriends}>
                        <TextInput
                            style={styles.textBox}
                            value={number}
                            onChangeText={(text) => {
                                setNumber(text) 
	                        }}
                            placeholder="Enter mobile number"
                            multiline={false}
                            keyboardType="numeric"
                            autoCorrect={false}
                        />
                        <Text>Enter mobile number</Text>
                        <Button 
                            style={styles.sendRequest}
                            onPress={(registerNewUser)}
                            title='Send invite'
                        />
                    </View> : null}
                   </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ManangeFriends

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', flex: 1,
        alignContent: 'center', 
    },
    addIcon:{
        textAlign: 'right',
    },
    viewHeader:{
        fontSize: '35%', fontWeight: '900',
        width: '100%',
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#000",
        padding: '3%',
    },
    alert:{
        alignSelf: 'center', justifyContent: 'center',
        paddingRight: '10%',
        marginRight: '10%',
      }, 
    listHeader:{
        paddingTop: '10%'
    },
    eachFriendName:{
        fontSize: '20%',
        padding: '5%',
        width: '100%',
    },  
    textBox:{
        fontSize: '20%',
        paddingLeft: '5%', paddingBottom: '5%',
        borderWidth:  '1%',  borderStyle:  'solid',
        width: '80%',

    }, 
    addFriends:{
        alignContent: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center',
        marginTop: '30%',
    
    },
    sendRequest:{
        marginTop: '15%',
        textAlign: 'center',
        fontSize: '20%',
    }
})