import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';  
import { useQuery } from "react-query"
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

const AddFriends = () => {
    const AxiosGettData = async()=>{
        const userProfileInfo = await SecureStore.getItemAsync('userProfile')
        const userProfileJson = JSON.parse(userProfileInfo)
        const profileName = userProfileJson['profile_name']
        const postApiCall = await axios.post(`http://10.0.0.211:8000/friend_list`, {profileName:profileName})
            return(postApiCall.data)
            // returns an array of arrays
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
                <TouchableOpacity><Icon name="add" color={'#6ba1c4'} size={45} style={styles.addIcon}/></TouchableOpacity>
                <Text style={styles.viewHeader}>Manange Friends</Text>
                <ScrollView style={styles.listHeader}> 
                    <View style={styles.listHeader}>
                        
                    {dataLoaded.map((eachName, index)=>{
                            return(
                                
                                <View key={`${new Date().toString()}-${index}`}>
                                    <TouchableOpacity><Text style={styles.eachFriendName}>{eachName}</Text></TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AddFriends

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', flex: 1,
        alignContent: 'center', 
        padding: '3%'
    },
    addIcon:{
        textAlign: 'right',
    },
    viewHeader:{
        fontSize: '35%', fontWeight: '900',
        width: '100%',
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#000"
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
        borderWidth:  '1%',  borderStyle:  'dashed',
        width: '100%',
    },  
})