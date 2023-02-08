import axios from "axios";
import React, {useContext } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity,  } from "react-native";
import { useQuery } from "react-query"
import {LinearGradient} from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { DreamIdStatus } from '../../context/DreamId';

const DreamVault = ({navigation}) => {
  const [dreamId, setDreamId] = useContext(DreamIdStatus)

  // usd to convert time to string. Django sends time in this format 2023-01-29T01:25:41.644Z, this is converted in 1:25:41 AM
  const AxiosPostData = async() => { 
    const userProfileInfo = await SecureStore.getItemAsync('userProfile')
    const userProfileJson = JSON.parse(userProfileInfo)
    const profileName = userProfileJson['profile_name']
    const postApiCall = await axios.post(`http://10.0.0.211:8000/user_dream_vault`,{profileName:profileName})
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

  const ViewDream = (dream) => {
    navigation.navigate('DreamView')
    setDreamId(dream)
  }

return (
  <LinearGradient colors={['#cfd9df', '#e2ebf0']} style={{height: '100%'}}>
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.centerPage}>
            <Text style={styles.header}>Dreams</Text>
          </View>
            {dataLoaded.map((eachItem, index)=>{
              return (
                <View style={styles.allSections}  key={`${new Date().toString()}-${index}`}>
                  <View style={styles.sections}>
                      <Text style={styles.subSectionHeader}>Subject:</Text>
                      <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" key={eachItem.id}>{eachItem.user_dream_subject}</Text>
                  </View>
                  <TouchableOpacity style={styles.sections} onPress={() => ViewDream(eachItem.user_dream_id)}>
                      <Text style={styles.subSectionHeader}>Dream:</Text>
                      <Text style={styles.subSectionData}numberOfLines={9} ellipsizeMode="tail" key={eachItem.id}>{eachItem.user_dream}</Text>
                  </TouchableOpacity>
                </View>
                )
            })}
          </View>
      </ScrollView>
    </SafeAreaView>
  </LinearGradient>
)
}



export default DreamVault

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
  marginTop: '5%', marginBottom: '8%',
  textAlign: 'center'
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
}
})