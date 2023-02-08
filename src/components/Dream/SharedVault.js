import React, {useState, useEffect} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from '@rneui/themed';

const SharedVault = ({navigation}) => {
    const [singleState, setSingleState] = useState(null);
    const [userProfileName, setUserProileName] = useState([])
    const [publicFavoritesView, setPublicFavoritesView] = useState(false)
    const [privateFavoritesView, setPrivateFavoritesView] = useState(false)

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
      }, []);


    

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
    return (
      <SafeAreaView>
      <ScrollView>
         {singleState ?     
                  <View>    
                      <View style={styles.container}>
                          <View>
                              <View style={styles.sections}>
                                  <Text style={styles.subSectionHeader}>User:</Text>
                                  <Text style={styles.subSectionData} key={singleState.profileName}>{singleState.profileName}</Text>
                              </View>
                              <View style={styles.sections}>
                                  <Text style={styles.subSectionHeader}>Subject:</Text>
                                  <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" key={singleState.user_dream_subject}>{singleState.user_dream_subject}</Text>
                              </View>
                              <View style={styles.sections} onPress={() => ViewDream(eachItem)}>
                                  <Text style={styles.subSectionHeader}>Dream:</Text>
                                  <Text style={styles.subSectionData} key={singleState.user_dream}>{singleState.user_dream}</Text>
                              </View>
                              <View style={styles.icons}>
                                  <Icon name='remove' size={30} color={"red"} styles={styles.icon} onPress={() => updateFavorites(eachItem.user_dream_id)} />
                              </View>
                              <View style={styles.forumReturn} >
                                  <Button 
                                      onPress={() => setSingleState(null)}
                                      title='Go back'
                                  /> 
                             
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
                              <View style={styles.iconHeader}>
                                  <Icon name='remove' size={35} color={"red"} styles={styles.icon} onPress={() => updateFavorites(eachItem.user_dream_id)} />
                                  <Icon name='group' size={30} color={"green"} styles={styles.icon}  onPress={() => console.log('bookmark')} />
                              </View>
                          </View>
                      </View>
                  </View>
              )
              })
              }
         
      </ScrollView>
  </SafeAreaView>
);
};
  
export default SharedVault;
  
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
        flex: 1
    },
    alert:{
        alignSelf: 'center', justifyContent: 'center',
        paddingRight: '10%',
        marginRight: '10%',
      }
 
});