import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import lang from './../../lang/SharedComponents/UserPreview';
import {useSelector} from 'react-redux';

const bike: any = require('./../../assets/images/bike.png');
const dotEmpty: any = require('./../../assets/images/dotEmpty.png');

interface UserPreviewProps {
    description: string;
    hobbies: {name: string}[];
}

const UserPreview = ({description, hobbies}: UserPreviewProps) => {
    const activeLanguage = useSelector(
        (state: any) => state?.Translations?.language,
    );

    return (
        <View>
            {description && (
                <Text style={styles.userPreviewSectionDescContainer}>
                    {description}
                </Text>
            )}
            {hobbies && hobbies.length > 0 && (
                <View style={styles.userPreviewSectionHobbyContainer}>
                    <View style={styles.userPreviewSectionHeaderContainer}>
                        <Image
                            style={styles.userPreviewSectionHeaderImage}
                            source={bike}
                        />
                        <Text style={styles.userPreviewSectionHeaderText}>
                            {lang.hobby[activeLanguage]}
                        </Text>
                    </View>
                    {hobbies &&
                        hobbies.map((hobby: any, i: number) => {
                            return (
                                <View
                                    style={styles.userPreviewListItemContainer}
                                    key={`hobbies-${i}`}>
                                    <Image
                                        style={styles.userPreviewListItemImage}
                                        source={dotEmpty}
                                    />
                                    <Text
                                        style={
                                            styles.userPreviewSectionListText
                                        }>
                                        {hobby.name}
                                    </Text>
                                </View>
                            );
                        })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    userPreviewSectionContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    userPreviewSectionDescContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffe4d3',
        paddingBottom: 30,
        paddingTop: 30,
    },
    userPreviewSectionHobbyContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffefe2',
        paddingBottom: 30,
    },
    userPreviewSectionKidsContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff6ef',
        paddingBottom: 30,
    },
    userPreviewSectionHeaderContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
        marginTop: 20,
    },
    userPreviewSectionHeaderImage: {
        width: 45,
        height: 45,
    },
    userPreviewSectionHeaderText: {
        fontSize: 24,
        fontWeight: '600',
        paddingLeft: 20,
        color: '#424242',
        //fontFamily: "Open Sans"
    },
    userPreviewListItemContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 65,
    },
    userPreviewListItemImage: {
        width: 15,
        height: 15,
        marginRight: 10,
    },
    userPreviewSectionListText: {
        fontSize: 14,
        color: '#424242',
        //fontFamily: "Open Sans"
    },
    userPreviewDescription: {
        fontSize: 14,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
        color: '#424242',
        //fontFamily: "Open Sans"
    },
});

export default UserPreview;
