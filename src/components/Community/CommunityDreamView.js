import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import React, {useContext } from 'react'
import axios from "axios";
import { useQuery } from "react-query"
import { Icon } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { DreamIdStatus } from '../../context/DreamId';

const DreamView = ({navigation, route}) => {
  const [dreamId, setdreamId] = useContext(DreamIdStatus)

    const AxiosPostData = async() => {
      const dreamIdValue = route.params.dreamId
      const userProfileInfo = await SecureStore.getItemAsync('userProfile')
      const userProfileJson = JSON.parse(userProfileInfo)
      const profileName = userProfileJson['profile_name']
      const dreamSendData = {'dream_id' : dreamIdValue, sourceView :route['name'], 'profileName':profileName}

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
      const goToComment = (e) => {
        setdreamId(e)
        navigation.navigate('DreamReaction')
       
      }
      const passDreamId = dataLoaded[0]['user_dream_id']

  return (
    <SafeAreaView>
      <ScrollView>
          <View style={styles.allSections}>
            <View style={styles.sections}>
                <Text style={styles.subSectionHeader}>User:</Text>
                <Text style={styles.subSectionData}>{dataLoaded[0]['userName']}</Text>
            </View>
            <View style={styles.sections}>
                <Text style={styles.subSectionHeader}>Last updated:</Text>
                <Text style={styles.subSectionData}>{dataLoaded[0]['updated_at']}</Text>
            </View>
            <View style={styles.sections}>
                <Text style={styles.subSectionHeader}>Subject:</Text>
                <Text style={styles.subSectionData}>{dataLoaded[0]['user_dream_subject']}</Text>
            </View>
            <View style={styles.sections} onPress={() => ViewDream(dataLoaded[0]['user_dream_id'])}>
                <Text style={styles.subSectionHeader}>Dream:</Text>
                <Text style={styles.subSectionData}>{dataLoaded[0]['user_dream']}</Text>
            </View>
            <View style={styles.icons}>
              <Icon raised name='comment' type='FontAwesome' color='green' onPress={()=>{goToComment(dataLoaded[0]['user_dream_id'])}} />
              <Icon raised name='group-add' type='MaterialIcons' color='black' onPress={() => console.log('Tag a group or person')} />
              <Icon raised name='bookmark' type='Entypo' color='red' onPress={() => console.log('bookmark')} />
            </View>
          </View>
     

       

        <View style={styles.buttonView}>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Community Help</Text>
          </TouchableOpacity>
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
    })