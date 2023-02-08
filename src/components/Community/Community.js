import React, {useState, useContext, useRef} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Text, View, ActivityIndicator, Button } from 'react-native';
import { Icon, Badge } from '@rneui/themed';
import { useQuery } from "react-query"
import axios from "axios"
// import { ScrollLocationStatus } from '../context/ScrollLocation';
import { CommentStatus } from '../../context/Comment';

const Community = ({navigation}) => {
    
    const [singleState, setSingleState] = useState(null);
    const [apiRequstForum, setApiRequstForum] = useState(null) //used to refresh API request for likes and coments
    // used to show and hide components on the screen
    // const [currentScroll, setCurrentScroll] = useContext(ScrollLocationStatus)
// need to fix this for scrollView. Trying to see how can I scroll to where I left off

// useFocusEffect(()=>{
//     scrollViewRef.scrollTo({ x: 0, y: currentScroll, animated: true })
// })
    const ViewDream = (singleItemValue) => {
      setSingleState(singleItemValue)
    //   userd for conditional render
    }

    const AxiosGettData = async()=>{
        
        const postApiCall = await axios.get(`http://10.0.0.211:8000/forum_post`)
        setApiRequstForum(postApiCall.data)
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
    const CommunityPostReaction = async(e)=>{
        let endpoints = [
            await axios.post(`http://10.0.0.211:8000/forum_post_interaction`,{hearts:true, dream_id:e[1]}),
            await axios.get(`http://10.0.0.211:8000/forum_post`)
        ]
        // groups all axios request to one so the server only sends one API requset out
        const endpointRequestResponse = await axios.all(endpoints)
        setApiRequstForum(endpointRequestResponse[1].data)
        // the first response will be the post update
    }
    // const handleScroll = (event) => {
    //     setCurrentScroll(event.nativeEvent.contentOffset.y)
    //    }
    return (
    <SafeAreaView>
        <ScrollView> 
            {singleState ?     
                    <View>    
                        <View style={styles.container}>
                            <View>
                                <View style={styles.sections}>
                                    <Text style={styles.subSectionHeader}>User:</Text>
                                    <Text style={styles.subSectionData}>{singleState.userName}</Text>
                                </View>
                                <View style={styles.sections}>
                                    <Text style={styles.subSectionHeader}>Subject:</Text>
                                    <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" key={singleState.id}>{singleState.user_dream_subject}</Text>
                                </View>
                                <View style={styles.sections} onPress={() => ViewDream(eachItem)}>
                                    {/* first thingg that is happening, is this is the event handler that sends. let me show you in the simulator */}
                                    {/* when you click on one of those dream thing it sends the "user_dream_id"  to the next view so you can view it in full. wathc this*/}
                                    <Text style={styles.subSectionHeader}>Dream:</Text>
                                    <Text style={styles.subSectionData} key={singleState.id}>{singleState.user_dream}</Text>
                                </View>
                                <View style={styles.icons}>
                                    <Icon raised name='comment' type='FontAwesome' color='green' onPress={() => navigation.navigate('CommunityPostReaction', { eachItem })} />
                                    <Icon raised name='group-add' type='MaterialIcons' color='orange' onPress={() => console.log('Tag a group or person')} />
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
            apiRequstForum.map((eachItem, index)=>{
                return(
                    <View key={`${new Date().toString()}-${index}`}>                  
                        <View style={styles.container}>
                            <View>
                                <View style={styles.sections}>
                                    <Text style={styles.subSectionHeader}>User:</Text>
                                    <Text style={styles.subSectionData}>{eachItem.userName}</Text>
                                </View>
                                <View style={styles.sections}>
                                    <Text style={styles.subSectionHeader}>Subject:</Text>
                                    <Text style={styles.subSectionData} numberOfLines={2} ellipsizeMode="tail" key={eachItem.id}>{eachItem.user_dream_subject}</Text>
                                </View>
                                <TouchableOpacity style={styles.sections} onPress={() => ViewDream(eachItem)}>
                                    <Text style={styles.subSectionHeader}>Dream:</Text>
                                    <Text style={styles.subSectionData}numberOfLines={3} ellipsizeMode="tail" key={eachItem.id}>{eachItem.user_dream}</Text>
                                </TouchableOpacity>
                                <View style={styles.icons}>
                                    <Icon raised name='heart' type='font-awesome' color='red' onPress={() => CommunityPostReaction(['heart', eachItem.user_dream_id])}/><Badge value={eachItem.user_dream_likes} status="primary" containerStyle={{ position: 'absolute', left: 60, fontSize:'10%' }}/>
                                    <Icon raised name='comment' type='FontAwesome' color='green' onPress={() => navigation.navigate('PostReaction', { eachItem })} />
                                    <Icon raised name='group-add' type='MaterialIcons' color='orange' onPress={() => console.log('Tag a group or person')} />
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
  
export default Community;
  
const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'row',
        borderBotomColor: 'black', borderTopWidth: 1,
        paddingLeft: '3%', paddingTop: '15%'
    },
    sections: {
        flexDirection: 'row', flexWrap: 'wrap', flex: 1,
        paddingBottom: '5%'
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
    icons:{
        margin: '5%',
        flexDirection: 'row',
        alignContent: 'center', justifyContent: 'center'
      },
    alert:{
        fontSize: '25%', 
        alignSelf: 'center', justifyContent: 'center',
      }, 
    badge:{
        flexDirection: 'row',
        marginLeft: '10%',
      },
 
});