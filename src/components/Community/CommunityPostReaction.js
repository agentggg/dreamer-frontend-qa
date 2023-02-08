import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView} from 'react-native'
import React, {useState} from 'react'
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const PostReaction = ({route}) => {
    const [comment, setComment] = useState('‼️⚠️Please be respectful and curtious. Comments can be deleted.⚠️‼️')
    const postData = route.params.eachItem
    const { control, reset, formState: { errors } } = useForm()
 
  return (
        <KeyboardAwareScrollView> 
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.advisory}>
                            <Text style={styles.advisorText}>{comment}</Text>
                        </View>
                        <View style={styles.sections}>
                            <Text style={styles.subSectionHeader}>User:</Text>
                            <Text style={styles.subSectionData}>{postData.userName}</Text>
                        </View>
                        <View style={styles.sections}>
                            <Text style={styles.subSectionHeader}>Subject:</Text>
                            <Text style={styles.subSectionData}> {postData.user_dream_subject}</Text>
                        </View>
                        <View style={styles.sections}>
                            <Text style={styles.subSectionHeader}>Dream:</Text>
                            <Text style={styles.subSectionData}> {postData.user_dream}</Text>
                        </View>
                        <View styles={styles.bottomSection}>
                            
                        <Controller control={control}render={({field: { value }}) => (
                        <TextInput
                            style={styles.text}
                            value={value}
                            placeholder="Comment"
                            multiline={true}
                            returnKeyType="Post"
                            onSubmitEditing={() => {
                                reset()
                                setComment(value)
                            }}
                        />      
                        )}
                        
                        name="Comment"
                        />
                        <Icon name="check" size={30} styles={styles.icon} color="green" />

                        </View>
                        <View styles={styles.bottomIcon}>
                            <Icon name="check-circle-o" size={30} styles={styles.icon} color="green" />
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
  )
}

export default PostReaction

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', flex: 1,
        justifyContent: 'center', alignContent: 'center', 
        padding: '3%', height:'100%'
    },
    advisory: {
        flex: 1,
    },
    sections: {
        flex: 1,
    },
    bottomSection:{
        flexDirection: 'row',
        flex: 1,
    },
    bottomIcon:{
       flex: 0.5
    },
    icon:{
        color: 'green',
    },
    text: {
        fontSize: '15%', fontWeight: '300',
        borderWidth: 2, borderRadius: '30%', borderColor: "#20232a",
        marginTop: '10%', paddingLeft: '5%',
        height: '30%'
    },
    advisorText:{
        textAlign: 'center',
    },
    subSectionHeader:{
        fontWeight: '900', fontSize: '20%',
        padding: '1%',
    },
    subSectionData:{
        fontWeight: '350', fontSize: '20%',
        padding: '1%',
    },
})