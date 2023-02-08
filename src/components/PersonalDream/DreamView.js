import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, {useContext, useState } from 'react'
import axios from "axios";
import { useQuery } from "react-query"
import { Icon } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { DreamIdStatus } from '../../context/DreamId';
import copyToClipboard from '../../reuseableComponents/copyPaste';

const DreamView = ({navigation, route}) => {
  const [dreamId, setdreamId] = useContext(DreamIdStatus)
  const [view, setView] = useState(false)

  const AxiosPostData = async() => {
    const userProfileInfo = await SecureStore.getItemAsync('userProfile')
    const userProfileJson = JSON.parse(userProfileInfo)
    const profileName = userProfileJson['profile_name']
    const dreamSendData = {'dream_id' : dreamId, sourceView :route['name'], 'profileName':profileName}

  // this takes in the value from the "community file" and sends an API request to the backend with the dreamId as index. watch this
  const postApiCall = await axios.post(`http://10.0.0.211:8000/dream_view`,dreamSendData)
    return(postApiCall.data)
    // returns an array of arrays
  }
  const {data:dataLoaded, isLoading: dataIsLoading, error: dataLoadingError} = useQuery("postApiCall", AxiosPostData)
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
  const FriendListApiCall = async()=>{
      const userProfileInfo = await SecureStore.getItemAsync('userProfile')
      const userProfileJson = JSON.parse(userProfileInfo)
      const profileName = userProfileJson['profile_name']
      const apiCall = await axios.post(`http://10.0.0.211:8000/collab_list`, {profileName:profileName})
          return(apiCall.data)
          // returns an array of arrays
  }
  const {data:friendListLoaded, isLoading: friendListLoading, error: friendListError} = useQuery("apiCall", FriendListApiCall)
  if (friendListLoading)  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="red"/>
      <Text style={styles.alert}>Unlocking the revelations 🔐</Text>
    </View>
  )
  if (friendListError)return (
    <View style={styles.container}>
      <Text style={styles.alert}>Error unlocking the revelations. Try again later 😃</Text>
    </View>
  )
  const updateFavorites = async (e) => {
    await axios.post(`http://10.0.0.211:8000/add_remove_vault_favorites`,{dreamId:e, option:"add"})
    Alert.alert('✅', 'Dream added to favorites', [
      {text: 'OK', onPress: () => navigation.navigate('DreamEdit')},
    ]);
  }
  const updateDream = async (e) => {
    await axios.post(`http://10.0.0.211:8000/add_remove_vault_dream`,{dreamId:e, option:"remove"})
    navigation.navigate('DreamVault')
  }
  const editView = async (e) => {
    setdreamId(e)
    navigation.navigate('DreamVaultEdit')
  }
  const sendCollabRequest = async (e) => {
    console.log(e)
    console.log(dataLoaded[0]['user_dream_id'])
  }

  return (
    <SafeAreaView>
      <ScrollView >
          <View style={styles.allSections}>
            <View style={styles.sections}>
                <Text style={styles.subSectionHeader}>Created:</Text>
                <Text style={styles.subSectionData}>{dataLoaded[0]['updated_at']}</Text>
            </View>
            <View style={styles.sections}>
                <Text style={styles.subSectionHeader}>Updated:</Text>
                <Text style={styles.subSectionData}>{dataLoaded[0]['created_at']}</Text>
            </View>
            <View style={styles.sections}>
                <Text style={styles.subSectionHeader}>Subject:</Text>
                <Text style={styles.subSectionData} onPress={() => copyToClipboard(dataLoaded[0]['user_dream_subject'])}>{dataLoaded[0]['user_dream_subject']}</Text>
            </View>
            <View style={styles.sections} onPress={() => ViewDream(dataLoaded[0]['user_dream_id'])}>
                <Text style={styles.subSectionHeader}>Dream:</Text>
                <Text style={styles.subSectionData} onPress={() => copyToClipboard(dataLoaded[0]['user_dream'])}>{dataLoaded[0]['user_dream']}</Text>
            </View>
            <View style={styles.icons}>
              <Icon raised name='group-add' type='MaterialIcons' color='green' onPress={() => setView(true)} />
              <Icon raised name='bookmark' type='Entypo' color='red' onPress={() => updateFavorites(dataLoaded[0]['user_dream_id'])} />
              <Icon raised name='mode-edit' type='MaterialIcons' color='blue' onPress={() => editView(dataLoaded[0]['user_dream_id'])} />
              <Icon raised name='delete' size={30} type='MaterialIcons' color='black' onPress={() => updateDream(dataLoaded[0]['user_dream_id'])} /> 
            </View>
            {view ?
              <View style={styles.listHeader}>
                <Text style={styles.viewHeader}>Collaborate</Text>
                    {friendListLoaded.map((eachName, index)=>{
                            return(
                                <View key={`${new Date().toString()}-${index}`}>
                                    <TouchableOpacity onPress={()=>{sendCollabRequest(eachName[2])}}><Text style={styles.eachFriendName}>{eachName[0]} - {eachName[3]}</Text></TouchableOpacity>
                                </View>
                            )
                        })}
                
            </View> : <></>}
          </View>
          
      </ScrollView>  
    </SafeAreaView>
          )
}

export default DreamView

const styles = StyleSheet.create({
    container: {
      padding: '5%',
    },
    allSections: {
      padding: '5%',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    },
    header:{
      fontSize: '40%', fontWeight: '900',
      marginTop: '5%', marginBottom: '8%'
    },
    sections: {
      flexDirection: 'row',
      paddingTop: '5%',
      flexWrap: 'wrap',
    },
    subSectionHeader:{
      fontWeight: '900', fontSize: '20%'
    },
    subSectionData:{
      fontWeight: '350', fontSize: '20%',
      paddingLeft: '3%',
    },
    alert:{
      fontSize: '40%',
      alignSelf: 'center', justifyContent: 'center',
      marginTop: '40%'
    },    
    icons:{
      flexDirection: 'row',
      marginTop: '10%',
      alignContent: 'center', justifyContent: 'center'
    },
  badge:{
      flexDirection: 'row',
      marginLeft: '10%',
      alignContent: 'center', justifyContent: 'center'
    },
  button:{
      alignItems:'center', justifyContent: 'center',
      color: 'blue', backgroundColor: '#1976D2',
      borderRadius: '50%', borderColor: '#1976D2', borderWidth:'15%',
      width: '50%'
    },
  buttonText:{
      fontSize: '20%',
      color: 'white',
    },
    buttonView:{
      alignItems:'center', justifyContent: 'center',
      flex: 1,
      marginTop:'5%'
    },
    alert:{
      alignSelf: 'center', justifyContent: 'center',
      paddingRight: '10%',
      marginRight: '10%',
    },
    listHeader:{
      paddingTop: '10%',
      alignSelf: 'center', justifyContent: 'center',
    },
    eachFriendName:{
        fontSize: '20%',
        padding: '5%',
        width: '100%',
    },
    viewHeader:{
      fontSize: '35%', fontWeight: '900',
      width: '100%',
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#000",
      
  },
      })