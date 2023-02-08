import { StyleSheet, Text, View, SectionList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Button from '../../reuseableComponents/DonationButton'
import { SafeAreaView } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios'
import { useQuery } from "react-query"

const Dictionary = ({navigation}) => {
   //rr const dataLoaded = []
//relaod
  
// one sec. almost done
    const AxiosGetData = async() => {
        const postApiCall = await axios.get(`http://10.0.0.211:8000/dream_dictionary_entry`)
        return(postApiCall.data)
        // returns an array of arrays
    }
    const {data:dataLoaded, isLoading: dataIsLoading, error: dataLoadingError} = useQuery("postApiCall", AxiosGetData)
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
    const selectedWord = (e) => {
        let objSearch = dataLoaded.find(o => o.name === e);
        // searches the array of object that is carried into this component for the name of e, "e" is a prop. The value of the button pressed
        navigation.navigate('Word', { objSearch })
    }
    const filterDataByCategory = (arr) => {
        const filteredArr = []
        arr.map((each)=>{
          (!filteredArr.find((i) => i.title ===each.category) && each.category)&&filteredArr.push({title:each.category, data:[]})
        })
    //Above code loops thru each item and checks if that item, category is in the filterArr ( new arr ),
    // it also checks if each item has a category. (if it dosent have cargory it does nothing)
    // if catrgoery is in the array it does nothing.
    //if both are true (unable to find and has category) it pushes an object with the caturoty as a title and an empty arr
       arr.map((each)=>{
           filteredArr.map((eachName)=>{
               each.category === eachName.title && eachName.data.push(each)
            })
     })
        return filteredArr
    }
    return (

        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <SafeAreaView>
                {/* this will make the keyboard go up on screen upon type */}
                    {/* this will make the keyboard disappear when user press on screen */}
                    <LinearGradient colors={['#de6262', '#ffb88c']}>    
                        <View style={{marginTop: '10%'}}><Button/></View>
                        <SearchableDropdown
                            onTextChange={(text)=>{}}
                            //On text change listner on the searchable input
                            onItemSelect={(item) => selectedWord(item.name)}
                            //onItemSelect called after the selection from the dropdown
                            containerStyle={{ 
                                marginTop: '10%',
                                // marginBottom: '-50%',
                                width: '90%',
                                marginLeft: '5%',
                                marginRight: '5%',
                            }}
                            setSort={(item, searchedText)=>item?.name?.startsWith(searchedText||'')}
                            //suggestion container style
                            textInputStyle={{
                                //inserted text style
                                padding: 12,
                                fontSize: '25%',
                                fontWeight: '500',
                                borderWidth: 1,
                                backgroundColor: '#FFFF',
                                borderRadius: '30%',
                            }}
                            itemStyle={{
                                //single dropdown item style
                                padding: '3%',
                                marginTop: '3%',
                                backgroundColor: 'white',
                                borderRadius: '30%',
                            }}
                            itemTextStyle={{
                                //text style of a single dropdown item
                                color: 'black',
                                fontSize: '20%',
                                paddingLeft: '3%',
                                fontWeight: '700'
                            }}
                            itemsContainerStyle={{
                                //items container style you can pass maxHeight
                                //to restrict the items dropdown hieght
                                maxHeight: '50%',
                            }}
                            items={dataLoaded}
                            //mapping of item array
                            placeholder="Search"
                            placeholderTextColor='black'
                            //place holder for the search input
                            resetValue={false}
                            //reset textInput Value with true and false state
                            underlineColorAndroid="transparent"
                            //To remove the underline from the android input
                            />
                        <SectionList
                            sections={filterDataByCategory(dataLoaded)} 
                            keyExtractor={(item, index)=> item+index}
                            renderItem={({item}) => (
                                <TouchableOpacity  onPress={() => selectedWord(item.name)}><Text style={styles.dataName}>{item.name}</Text></TouchableOpacity>
                            )}
                            renderSectionHeader={({section: {title}}) => (<Text style={styles.categoryHeader}>{title}</Text>          
                            )}        
                        />
                    </LinearGradient>
            </SafeAreaView>
        </KeyboardAvoidingView>

    )
}
export default Dictionary
//reload
const styles = StyleSheet.create({
    container:{
        height: '100%',
    },
    categoryHeader:{
       fontSize:'30', color:'white', fontSize: '50%', fontWeight: '900%',
       width:'100%',
       textAlign: 'right',
       marginTop:'20%'
    },
    dataName:{
        padding: 10,
        fontSize: 20, fontWeight: '500',
        borderBottomColor: 'white',  borderBottomWidth: 1, 
        color: 'black',
        fontWeight: '800', fontSize: '25%',
        borderWidth: '0.3%', borderBottomWidth: 0,
    },
    alert:{
        fontSize: '40%',
        alignSelf: 'center', justifyContent: 'center',
        marginTop: '40%'
    }
  });