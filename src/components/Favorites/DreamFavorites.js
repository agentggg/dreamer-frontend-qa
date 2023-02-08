import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Button} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from '@rneui/themed';
import axios from "axios";
import { useQuery } from "react-query"
import { DreamIdStatus } from '../../context/DreamId';

const DreamFavorites = ({navigation}) => {
    const [singleState, setSingleState] = useState(null);
    const [userProfileName, setUserProileName] = useState([])
    const [dreamId, setDreamId] = useContext(DreamIdStatus)
    const [publicFavoritesView, setPublicFavoritesView] = useState(false)
    const [privateFavoritesView, setPrivateFavoritesView] = useState(false)
    const [view, setView] = useState(false)
    // used to show and hide components on the screen
    const ViewDream = (singleItemValue) => {
      setSingleState(singleItemValue)
    //   userid for conditional render//where is this being called
    }
    useEffect(() => {
        const fetchData = async()=> {
            const userProfileInfo =  await SecureStore.getItemAsync('userProfile')
            const userProfileJson = await JSON.parse(userProfileInfo)
            const profileName = await userProfileJson['profile_name']
            const response = await fetch(`http://10.0.0.211:8000/user_dream_vault_favorites`,{
                method: 'POST',
                headers:{'content-type': 'application/json'},
                body: JSON.stringify({
                    profileName:profileName
                    }),
            })
            const apiResponse = await response.json()
            setUserProileName(apiResponse)
        }
        fetchData()
      });
    const updateDream = async (e) => {
      await axios.post(`http://10.0.0.211:8000/add_remove_vault_dream`,{dreamId:e, option:"remove"})
      navigation.navigate('DreamVault')
    }
    const updateFavorites = async (e) => {
      try {
        const response = await fetch(`http://10.0.0.211:8000/add_remove_vault_favorites`,{
            method: 'POST',
            headers:{'content-type': 'application/json'},
            body: JSON.stringify({
              dreamId:e, option:"remove"
            }),
        }
    )
    if (response.status !== 200){
        Alert.alert('❌', 'Dream not removed from vault')
    }
    else{
        setSingleState(null)
        navigation.goBack()
    }
      }
      catch (err) {
        console.log(err)
      } 
    }
    const sharedFavorites = async (e) => {
        try {
          const response = await fetch(`http://10.0.0.211:8000/add_remove_vault_favorites`,{
              method: 'POST',
              headers:{'content-type': 'application/json'},
              body: JSON.stringify({
                dreamId:e, option:"remove"
              }),
          }
      )
      if (response.status !== 200){
          Alert.alert('❌', 'Username and/or password is invalid. Please try again.')
      }
      else{
          navigation.goBack()
      }
        }
        catch (err) {
          console.log(err)
        } 
      }
    const FriendListApiCall = async()=>{
        const userProfileInfo = await SecureStore.getItemAsync('userProfile')
        const userProfileJson = JSON.parse(userProfileInfo)
        const profileName = userProfileJson['profile_name']
        const apiCall = await axios.post(`http://10.0.0.211:8000/collab_list`, {profileName:profileName})
        return(apiCall.data)
        // returns an array of arrays
    }
    const sendCollabRequest = async (e) => {
    }
    const editView = async (e) => {
      setDreamId(e)
      navigation.navigate('DreamVaultEdit')
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
    return (
      <SafeAreaView>
      <ScrollView>
         {singleState ?      
            <View>    
                <View style={styles.container}>
                  <View>
                    <View style={styles.sections}>
                        <Text style={styles.subSectionHeader}>Subject:</Text>
                        <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" key={singleState.user_dream_subject}>{singleState.user_dream_subject}</Text>
                    </View>
                    <View style={styles.sections} onPress={() => ViewDream(eachItem)}>
                        <Text style={styles.subSectionHeader}>Dream:</Text>
                        <Text style={styles.subSectionData} key={singleState.user_dream}>{singleState.user_dream}</Text>
                    </View>
                    <View style={styles.icons}>
                      <Icon raised name='group-add' type='MaterialIcons' color='green' onPress={() => setView(true)} />
                      {/* <Icon raised name='bookmark' type='Entypo' color='red' onPress={() => updateFavorites(singleState.user_dream_id)} /> */}
                      <Icon raised name='mode-edit' type='MaterialIcons' color='blue' onPress={() => editView(singleState.user_dream_id)} />
                      <Icon raised name='delete' size={30} type='MaterialIcons' color='black' onPress={() => updateDream(singleState.user_dream_id)} /> 
                    </View>
                    <View style={styles.icons}>                      
                      <Button onPress={() => setSingleState(null)} title='Go back'/> 
                      <Button onPress={() => updateFavorites(singleState.user_dream_id)} title='Remove from favorites'/> 
                    </View>
                  </View>                  
                </View>
            </View> 
            : 
            userProfileName.map((eachItem, index)=>{
            return(
                <View key={`${new Date().toString()}-${index}`}>   
                    <View style={styles.container}>
                        <View>
                            <View style={styles.sections}>
                                <Text style={styles.subSectionHeader}>Subject:</Text>
                                <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" >{eachItem.user_dream_subject}</Text>
                            </View>
                            <View style={styles.sections}>
                                <Text style={styles.subSectionHeader}>Created:</Text>
                                <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" >{eachItem.created_at}</Text>
                            </View>
                            <TouchableOpacity style={styles.sections} onPress={() => ViewDream(eachItem)}>
                                <Text style={styles.subSectionHeader}>Dream:</Text>
                                <Text style={styles.subSectionData}numberOfLines={3} ellipsizeMode="tail" >{eachItem.user_dream}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {view ?
            <View style={styles.listHeader}>
              <Text style={styles.viewHeader}>Select a dreamer</Text>
                  {friendListLoaded.map((eachName, index)=>{
                          return(
                              <View key={`${new Date().toString()}-${index}`}>
                                  <TouchableOpacity onPress={()=>{sendCollabRequest(eachName[2])}}><Text style={styles.eachFriendName}>{eachName[0]} - {eachName[3]}</Text></TouchableOpacity>
                              </View>
                          )
                      })}
              
          </View> : <></>}
                </View>
            )
            })
            }
         
      </ScrollView>
  </SafeAreaView>
);
};
  
export default DreamFavorites;
  
const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'row',
    borderBotomColor: 'black', borderTopWidth: 1,
    paddingLeft: '3%', paddingTop: '15%'
  },
  sections: {
    flexDirection: 'row', flexWrap: 'wrap', flex: 1,
    paddingBottom: '10%'
    // this is for all section headers view
  },
  subSectionHeader:{
    fontWeight: '900', fontSize: '20%'
    // this is for all section headers text
  },
  subSectionData:{
    fontWeight: '350', fontSize: '20%',
    paddingLeft: '3%', 
    // this is for all section headers data
  },
  iconHeader:{
    alignContent: 'center', justifyContent: 'space-evenly',
    width: '100%',
    paddingBottom: '5%', 
    flexDirection: 'row',
  },
  icon:{
    flex: 1,
    alignContent: 'center', justifyContent: 'space-evenly',
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
    textAlign: 'center',
  },
  viewHeader:{
    fontSize: '35%', fontWeight: '900',
    width: '100%',
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
    textAlign: 'center',
  },
  icons:{
    flexDirection: 'row',
    marginBottom: '5%',
    alignContent: 'center', justifyContent: 'space-around'
  },
  buttons:{
    
  }
});