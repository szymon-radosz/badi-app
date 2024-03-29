import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    SafeAreaView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import axios from 'axios';
import ButtonComponent from './../../components/Utils/ButtonComponent';
import InputComponent from './../../components/Utils/InputComponent';
import lang from './../../lang/Auth/Register';
import {
    customOrangeColor,
    fontSizeBig,
    loaderContainer,
} from './../../assets/global/globalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {setAlert} from '../../../app/store/alert/actions';
import {setLoader} from '../../../app/store/loader/actions';
import {setUserDetails} from '../../../app/store/user/actions';
import {API_URL} from './../../helpers/globalVariables';
import {returnTranslation} from './../../helpers/globalMethods';

const loaderImage: any = require('./../../assets/images/loader.gif');

interface IRegisterProps {
    navigation: any;
}

const Register = ({navigation}: IRegisterProps) => {
    const dispatch = useDispatch();
    const activeLanguage = useSelector(
        (state: any) => state?.Translations?.language,
    );
    const translations = useSelector(
        (state: any) => state?.Translations?.translations,
    );

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [platform, setPlatform] = useState('');

    useEffect(() => {
        if (Platform.OS === 'ios') {
            setPlatform('ios');
        } else {
            setPlatform('android');
        }
    }, []);

    const validateEmail = (email: string) => {
        var re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const registerUser = async () => {
        if (!name || !email || !password || !passwordConf) {
            dispatch(setAlert('danger', lang.allFieldsError[activeLanguage]));
        } else if (password !== passwordConf) {
            dispatch(
                setAlert(
                    'danger',
                    lang.passwordAndConfirmationNotMatchedError[activeLanguage],
                ),
            );
        } else if (password == passwordConf && password.length < 6) {
            dispatch(
                setAlert('danger', lang.passwordLengthError[activeLanguage]),
            );
        } else if (!validateEmail(email)) {
            dispatch(setAlert('danger', lang.emailError[activeLanguage]));
        } else if (
            password === passwordConf &&
            name &&
            email &&
            password &&
            passwordConf &&
            validateEmail(email)
        ) {
            try {
                // let API_URL = context.API_URL;

                dispatch(setLoader(true));

                axios
                    .post(API_URL + '/checkIfEmailExists', {
                        email: email,
                    })
                    .then(async response => {
                        if (
                            response.data.status === 'OK' &&
                            response.data.result === 1
                        ) {
                            //console.log(["checkIfEmailExists", response.data.result]);

                            dispatch(
                                setAlert(
                                    'danger',
                                    lang.accountExistsError[activeLanguage],
                                ),
                            );

                            setEmail('');

                            dispatch(setLoader(false));
                        } else {
                            axios
                                .post(API_URL + '/register', {
                                    name: name,
                                    nickname: name,
                                    email: email,
                                    password: password,
                                    platform: platform,
                                })
                                .then((response: any) => {
                                    console.log(response.data);
                                    if (response?.data?.result?.token) {
                                        dispatch(setLoader(false));

                                        dispatch(
                                            setAlert(
                                                'success',
                                                lang.confirmAccountSuccess[
                                                    activeLanguage
                                                ],
                                            ),
                                        );

                                        setName('');
                                        setEmail('');
                                        setPassword('');
                                        setPasswordConf('');

                                        // context.setUserData(response.data.user);
                                        dispatch(
                                            setUserDetails(
                                                response?.data?.result?.user,
                                            ),
                                        );
                                        // context.setUserLoggedIn(true);
                                        //navProps.setUserData(response.data.user);
                                    }
                                })
                                .catch(error => {
                                    console.log(['e', error]);
                                    dispatch(setLoader(false));
                                    setAlert(
                                        'danger',
                                        `${returnTranslation(
                                            error?.response?.data?.msg
                                                ? error?.response?.data?.msg
                                                : lang.registerError[
                                                      activeLanguage
                                                  ],
                                            translations,
                                            activeLanguage,
                                        )}`,
                                    );
                                });
                        }
                    });
            } catch (error) {
                setAlert(
                    'danger',
                    `${returnTranslation(
                        error?.response?.data?.msg
                            ? error?.response?.data?.msg
                            : lang.registerError[activeLanguage],
                        translations,
                        activeLanguage,
                    )}`,
                );
            }
        } else {
            dispatch(
                setAlert(
                    'danger',
                    lang.passwordAndConfirmationNotMatchedError[activeLanguage],
                ),
            );
        }
    };

    return (
        <React.Fragment>
            <SafeAreaView style={styles.areaContainer}>
                <ScrollView keyboardShouldPersistTaps={'always'}>
                    <View style={styles.container}>
                        <Text style={styles.headerText}>
                            {lang.header[activeLanguage]}
                        </Text>

                        <InputComponent
                            placeholder={lang.nick[activeLanguage]}
                            inputOnChange={(name: string) => setName(name)}
                            value={name}
                            secureTextEntry={false}
                            maxLength={100}
                        />
                        <InputComponent
                            placeholder={lang.email[activeLanguage]}
                            inputOnChange={(email: string) => setEmail(email)}
                            value={email}
                            secureTextEntry={false}
                            maxLength={100}
                        />
                        <InputComponent
                            placeholder={lang.password[activeLanguage]}
                            inputOnChange={(password: string) =>
                                setPassword(password)
                            }
                            value={password}
                            secureTextEntry={true}
                            maxLength={100}
                        />
                        <InputComponent
                            placeholder={
                                lang.passwordConfirmation[activeLanguage]
                            }
                            inputOnChange={(passwordConf: string) =>
                                setPasswordConf(passwordConf)
                            }
                            value={passwordConf}
                            secureTextEntry={true}
                            maxLength={100}
                        />
                        <TouchableHighlight
                            onPress={() => {
                                Linking.openURL('');
                            }}
                            underlayColor={'#fff'}>
                            <Text style={styles.termsBtn}>
                                {lang.registerAcceptTerms[activeLanguage]}
                            </Text>
                        </TouchableHighlight>

                        <ButtonComponent
                            pressButtonComponent={registerUser}
                            buttonComponentText={lang.register[activeLanguage]}
                            fullWidth={false}
                            underlayColor="#dd904d"
                            whiteBg={false}
                            showBackIcon={false}
                        />

                        <View style={styles.subBtnSection}>
                            <Text style={styles.subBtnSectionAsk}>
                                {lang.haveAccount[activeLanguage]}
                            </Text>
                            <TouchableHighlight
                                onPress={() => navigation.navigate('Login')}
                                underlayColor={'#fff'}>
                                <Text style={styles.registerBtn}>
                                    {lang.login[activeLanguage]}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            {/* )} */}
        </React.Fragment>
    );
};

interface Style {
    container: ViewStyle;
    headerText: TextStyle;
    subBtnSection: ViewStyle;
    subBtnSectionAsk: TextStyle;
    registerBtn: TextStyle;
    loaderContainer: any;
    termsBtn: TextStyle;
    areaContainer: ViewStyle;
    loaderImg: ImageStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    areaContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerText: {
        textAlign: 'center',
        color: '#333',
        fontWeight: '600',
        fontSize: fontSizeBig,
        marginTop: 70,
        paddingBottom: 50,
        //fontFamily: "Open Sans"
    },
    subBtnSection: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    subBtnSectionAsk: {
        color: '#333',
        fontSize: 16,
        //fontFamily: "Open Sans"
    },
    termsBtn: {
        color: '#a3a3a3',
        fontWeight: '600',
        fontSize: 10,
        paddingTop: 10,
        paddingBottom: 10,
        //fontFamily: "Open Sans"
    },
    registerBtn: {
        color: customOrangeColor,
        fontSize: 16,
        //fontFamily: "Open Sans"
    },
    loaderContainer: loaderContainer,
    loaderImg: {width: 100, height: 100},
});

export default Register;
