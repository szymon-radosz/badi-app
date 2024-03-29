import React, {useState, useEffect, useRef} from 'react';
import {
    SafeAreaView,
    Dimensions,
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import MainScreenHeader from './MainScreenHeader/MainScreenHeader';
import MapView, {Marker} from 'react-native-maps';
import SelectCategory from './SelectCategory/SelectCategory';
import SelectDate from './SelectDate/SelectDate';
import BottomPanel from './../../components/SharedComponents/BottomPanel';
import {withNavigation} from 'react-navigation';
import ButtonComponent from './../../components/Utils/ButtonComponent';
import {useSelector, useDispatch} from 'react-redux';
import lang from './../../lang/Start/Start';
import {
    setDateFrom,
    setDateTo,
    setStartViewMapLatitude,
    setStartViewMapLongitude,
} from './../../store/searchFilter/actions';
import {Modalize} from 'react-native-modalize';
import {getEvents} from './../../store/events/actions';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {customOrangeColor} from './../../assets/global/globalStyles';
import EventContent from './../EventDetails/utils/EventContent';

const calendar: any = require('./../../assets/images/calendar.png');
const group: any = require('./../../assets/images/group.png');

interface MainScreenProps {
    navigation: any;
}

const Start = ({navigation}: MainScreenProps) => {
    const modalizeRef = useRef<Modalize>(null);

    const dispatch = useDispatch();

    const userToken = useSelector((state: any) => state?.User?.details?.token);
    const activeLanguage = useSelector(
        (state: any) => state?.Translations?.language,
    );
    const activeCategory = useSelector(
        (state: any) => state?.Categories?.activeCategory,
    );
    const activeDateFrom = useSelector(
        (state: any) => state?.SearchFilter?.dateFrom,
    );
    const activeDateTo = useSelector(
        (state: any) => state?.SearchFilter?.dateTo,
    );
    const startViewMapLatitude = useSelector(
        (state: any) => state?.SearchFilter?.startViewMapLatitude,
    );
    const startViewMapLongitude = useSelector(
        (state: any) => state?.SearchFilter?.startViewMapLongitude,
    );
    const events = useSelector((state: any) => state?.Events?.events);

    const [showSelectCategory, setSelectCategory] = useState(false);
    const [showSelectDate, setSelectDate] = useState(false);

    useEffect(() => {
        if (!activeDateFrom) {
            dispatch(setDateFrom(new Date().toISOString().slice(0, 10)));
        }

        if (!activeDateTo) {
            dispatch(
                setDateTo(
                    new Date(new Date().setDate(new Date().getDate() + 7))
                        .toISOString()
                        .slice(0, 10),
                ),
            );
        }
    }, [activeDateFrom, activeDateTo]);

    useEffect(() => {
        if (startViewMapLatitude && startViewMapLongitude) {
            // console.log([
            //     'dispatch get events',
            //     startViewMapLatitude,
            //     startViewMapLongitude,
            // ]);
            handleGetEvents(
                startViewMapLatitude,
                startViewMapLongitude,
                activeCategory?.id ? activeCategory?.id : null,
            );
        }
    }, [startViewMapLatitude, startViewMapLongitude]);

    const handleGetEvents = (
        latitude?: number,
        longitude?: number,
        categoryId?: number,
    ) => {
        dispatch(getEvents(latitude, longitude, categoryId));
    };

    const handleSelectCategory = (id: number, name: string) => {
        handleGetEvents(
            startViewMapLatitude,
            startViewMapLongitude,
            id ? id : null,
        );
        setSelectCategory(false);
    };

    const returnListItem = ({item}) => {
        // let acceptedUsersCount = item?.users?.filter(user => user.is_accepted)?.length;

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate('EventDetails', {eventId: item?.id});
                }}>
                <View style={styles.listItemContainer}>
                    <EventContent
                        categoryName={item?.category?.name}
                        title={item?.title}
                        description={item?.description}
                        date={item?.date}
                        membersLimit={item?.members_limit}
                        acceptedUsersCount={
                            item?.users?.filter(user => user.is_accepted)
                                ?.length
                        }
                        commentsCount={
                            item?.comments?.length ? item?.comments?.length : 0
                        }
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const renderContent = () => (
        <View style={styles.content}>
            <Text style={styles.listTitle}>
                {lang.listTitle[activeLanguage]}
            </Text>
            <FlatList data={events} renderItem={returnListItem} />
        </View>
    );

    const handleMapDragend = (e: any) => {
        console.log(['handleMapDragend', e]);

        dispatch(setStartViewMapLatitude(e?.latitude));
        dispatch(setStartViewMapLongitude(e?.longitude));
    };

    return (
        <>
            {showSelectCategory ? (
                <SelectCategory
                    onClose={() => setSelectCategory(false)}
                    navigation={navigation}
                    handleSelectCategory={handleSelectCategory}
                />
            ) : null}

            {showSelectDate ? (
                <SelectDate
                    onClose={() => setSelectDate(false)}
                    navigation={navigation}
                />
            ) : null}

            <SafeAreaView style={styles.container}>
                <View
                    style={styles.wrapper}
                    // data-test="FindUsers"
                >
                    <MainScreenHeader
                        navigation={navigation}
                        setSelectCategory={(value: boolean) =>
                            setSelectCategory(value)
                        }
                        setSelectDate={(value: boolean) => setSelectDate(value)}
                        selectedCategoryName={activeCategory?.name}
                        selectedDateRange={`${lang.from[activeLanguage]}: ${activeDateFrom}\n${lang.to[activeLanguage]}: ${activeDateTo}`}
                    />

                    <Modalize
                        ref={modalizeRef}
                        modalStyle={styles.content__modal}
                        alwaysOpen={200}
                        handlePosition="inside"
                        modalTopOffset={150}>
                        {renderContent()}
                    </Modalize>

                    <MapView
                        initialRegion={
                            activeLanguage === 'pl'
                                ? {
                                      //warsaw
                                      latitude: startViewMapLatitude
                                          ? startViewMapLatitude
                                          : 52.237049,
                                      longitude: startViewMapLongitude
                                          ? startViewMapLongitude
                                          : 21.017532,
                                      latitudeDelta: 0.0922,
                                      longitudeDelta: 0.0421,
                                  }
                                : {
                                      //london
                                      latitude: startViewMapLatitude
                                          ? startViewMapLatitude
                                          : 51.509865,
                                      longitude: startViewMapLongitude
                                          ? startViewMapLongitude
                                          : -0.118092,
                                      latitudeDelta: 0.0922,
                                      longitudeDelta: 0.0421,
                                  }
                        }
                        onRegionChangeComplete={handleMapDragend}
                        style={styles.map}>
                        {events
                            ? events?.map((event, i) => {
                                  return (
                                      <Marker
                                          draggable={false}
                                          coordinate={{
                                              latitude: event.latitude,
                                              longitude: event.longitude,
                                          }}
                                      />
                                  );
                              })
                            : null}
                    </MapView>
                    <View style={styles.bottomBtnContainer}>
                        {!userToken ? (
                            <ButtonComponent
                                pressButtonComponent={() =>
                                    navigation?.navigate('Register')
                                }
                                buttonComponentText={
                                    lang.register[activeLanguage]
                                }
                                fullWidth={false}
                                underlayColor="#dd904d"
                                whiteBg={false}
                                showBackIcon={false}
                            />
                        ) : null}
                    </View>
                </View>
                <BottomPanel
                    data-test="BottomPanel"
                    navigation={navigation}
                    showFeedbackBtn={true}
                />
            </SafeAreaView>
        </>
    );
};

export default withNavigation(Start);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 210,
    },
    bottomBtnContainer: {
        position: 'absolute',
        bottom: 60,
        zIndex: 1,
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        width: Dimensions.get('screen').width,
    },
    content: {
        padding: 20,
    },
    content__modal: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.45,
        shadowRadius: 16,
        flex: 0,
    },
    content__subheading: {
        marginBottom: 2,

        fontSize: 16,
        fontWeight: '600',
        color: '#ccc',
    },

    content__heading: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },

    content__description: {
        paddingTop: 10,
        paddingBottom: 10,

        fontSize: 15,
        fontWeight: '200',
        lineHeight: 22,
        color: '#666',
    },

    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 20,
        textAlign: 'center',
    },
    listItemContainer: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    listItemSeparator: {
        width: 50,
        height: 3,
        backgroundColor: customOrangeColor,
        borderRadius: 2,
        marginTop: 10,
        marginBottom: 20,
    },
    listItemCategory: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    listItemImg: {
        width: 20,
        marginRight: 10,
    },
    listItemBottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemBottomElement: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        marginTop: 20,
        paddingRight: 30,
    },
    listItemTitle: {
        fontSize: 15,
    },
    listItemDescription: {
        fontSize: 13,
    },
    listItemDate: {
        fontSize: 14,
    },
    listItemMembers: {
        fontSize: 14,
    },
});
