import React from 'react';
import {Text, StyleSheet} from 'react-native';
import ListItem from './../../../components/Utils/ListItem';
import moment from 'moment';
import lang from './../../../lang/Messages/utils/MessageList';
import {API_URL} from './../../../helpers/globalVariables';
import {useSelector} from 'react-redux';

const MessageList = (props: {messagesList: any; navigation: any}): any => {
    const activeLanguage = useSelector(
        (state: any) => state?.Translations?.language,
    );

    if (props.messagesList) {
        return props.messagesList && props.messagesList.length > 0 ? (
            props.messagesList.map((conversation: any, i: number) => {
                return (
                    <ListItem
                        API_URL={API_URL}
                        key={`MessageList-${i}`}
                        image={`${props.messagesList[i][0].receiverPhotoPath}`}
                        mainText={props.messagesList[i][0].receiverName}
                        subText={props.messagesList[i][0].messages[
                            props.messagesList[i][0].messages.length - 1
                        ].message.substring(0, 20)}
                        subSubText={moment(
                            props.messagesList[i][0].messages[
                                props.messagesList[i][0].messages.length - 1
                            ].updated_at,
                        ).format('LLL')}
                        onPress={(): void => {
                            props.navigation.navigate('ConversationDetails', {
                                conversationId: props.messagesList[i][0].id,
                                receiverId: props.messagesList[i][0].receiverId,
                            });
                        }}
                        userHadUnreadedMessages={
                            props.messagesList[i][0].userHadUnreadedMessages
                        }
                    />
                );
            })
        ) : (
            <Text style={styles.noResultsContainer}>
                {lang.noResults[activeLanguage]}
            </Text>
        );
    }
};

const styles = StyleSheet.create({
    noResultsContainer: {
        paddingLeft: 10,
    },
});

export default React.memo(MessageList);