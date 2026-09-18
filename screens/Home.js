import { Text, Container, Icon, Flex, Avatar, Button, Link, HStack, Center, Heading, VStack, ScrollView, ChevronRightIcon, useColorModeValue, View, Modal, Image } from "native-base";
import { useNavigation, CommonActions  } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Linking, Platform } from "react-native";
import Bowl from "../components/Bowl";
import Footer from "../components/Footer";
import { useI18n } from '../components/LangContext';
import { useState } from "react";
import { FBAalytics } from '../firebaseConfig';
import { logEvent } from "firebase/analytics";

const webModalAnimationProps = Platform.OS === "web" ? {
    _fade: {
        animate: { transition: { useNativeDriver: false } },
        exit: { transition: { useNativeDriver: false } },
    },
    _backdropFade: {
        animate: { transition: { useNativeDriver: false } },
        exit: { transition: { useNativeDriver: false } },
    },
} : {};

const Home = () => {
    const navigation = useNavigation(); 
    const iconColor = useColorModeValue("black", "white");
    const i18n = useI18n();
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = async (url, event_name) => {
        if(url !== null) Linking.openURL(url); 
        await logEvent(FBAalytics, event_name, {
          // event parameters
          location: "home",
        });
    };  

    return (        
        <ScrollView w={"100%"}>
            <View w={[400, "100%", 640]} alignSelf={"center"}>
                <Bowl />

                <Flex alignItems="center" mt={[-180, -200, -225]}>
                    <Center m={4} p={4} px={[2,4,6]} rounded="md" textAlign="center" _dark={{ bg: "coolGray.700:alpha.70" }} _light={{ bg: "primary.50:alpha.50" }}>
                        <Text fontSize={["xs", "sm",]}>{i18n.t('homePage.welcomeBar')}</Text>
                    </Center>
                </Flex>

                {/* Header */}
                <HStack p={5} justifyContent={"space-between"}>
                    <Container alignSelf={"flex-start"}>
                        <Heading size={"xl"}>{i18n.t('name')}</Heading>
                        <Text fontSize={"md"}>{i18n.t('homePage.titles')}</Text>
                    </Container>
                    <Link onPress={() => handleButtonClick(null, "profilePic_opened") && setShowModal(true)}>
                        <Avatar borderWidth={2} mt={0} alignSelf="center" size={[20, 110]} source={ require("../assets/me.jpg")} > Jamie </Avatar>
                    </Link>                        
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} {...webModalAnimationProps}>
                        <Modal.Content maxWidth="600px">
                            <Modal.CloseButton />
                            <Image w={600} height={600} source={{
                                uri: require("../assets/me.jpg")
                                }} alt={i18n.t('homePage.profileDesc')} />    
                            <Modal.Body>
                                <Center>
                                    {i18n.t('homePage.profileDesc')}
                                </Center>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </HStack>

                {/* Work */}
                <VStack space={2} p={5} pt={0}  justifyContent={"space-between"}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"} >
                    {i18n.t('homePage.aboutTitle')}
                    </Heading>

                    <Text fontSize={16} textAlign={"justify"}>{i18n.t('homePage.about')}</Text>                    
                    <Button my={3} alignSelf="center" onPress={() => navigation.dispatch( CommonActions.navigate({ name: 'Work',  params: { cameFrom: 'Home' } } ) ) } >
                        <Text color={"white"}>{i18n.t('homePage.workCTA')} <ChevronRightIcon size="xs" color="white" /></Text>
                    </Button>

                </VStack>
                

                {/* Bio */}
                <VStack p={5} pt={0}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"} >
                        {i18n.t('homePage.timeLineTitle')}
                    </Heading>
                    <VStack>
                        <HStack alignItems={"baseline"} mb={timeline.mb}>
                            <Heading size={"md"}>1982</Heading><Text fontSize={16} ml={timeline.ml}>{i18n.t('homePage.y1982')}</Text>
                        </HStack>

                        <HStack alignItems={"baseline"} mb={timeline.mb}>
                            <Heading size={"md"}>1998</Heading><Text fontSize={16} ml={timeline.ml}>{i18n.t('homePage.y1998')}</Text>
                        </HStack>                    

                        <HStack alignItems={"baseline"} mb={timeline.mb}>
                            <Heading size={"md"}>2000</Heading><Text fontSize={16} ml={timeline.ml}>{i18n.t('homePage.y2000')}</Text>
                        </HStack>
                        
                        <HStack alignItems={"baseline"} mb={timeline.mb}>
                            <Heading size={"md"}>2008</Heading><Text fontSize={16} ml={timeline.ml}>{i18n.t('homePage.y2008.part1')}
                                <Link onPress={() => handleButtonClick('https://htmyell.com', "htmyell_opened") }
                                _text={{ _light:{ color: "primary.600" }, _dark: { color: "primary.300" }}}
                                _hover={{ _text:{ _light: { color: "primary.400" }, _dark: { color: "primary.100" }, textDecoration: "none" } }}
                               isExternal>{i18n.t('homePage.y2008.part2')}</Link>{i18n.t('homePage.y2008.part3')}</Text>
                        </HStack>                    
                    </VStack>            
                </VStack>


                {/* I Love */}
                <VStack space={2} p={5} pt={0}  justifyContent={"space-between"}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"} >
                        {i18n.t('homePage.iHeartTitle')} <Icon as={MaterialCommunityIcons } name="cards-heart" color={iconColor} size="md"  mt={.5} mr={1} />
                    </Heading>            
                    <Text fontSize={16}>{i18n.t('homePage.iHeart.part1')}
                        <Link onPress={() => handleButtonClick('https://open.spotify.com/album/6ZsEY7hIq4av7P5MzHnXv6', "spotify_opened") }
                            _text={{ _light:{ color: "primary.600" }, _dark: { color: "primary.300" }}}
                            _hover={{ _text:{ _light: { color: "primary.400" }, _dark: { color: "primary.100" }, textDecoration: "none" } }}
                        isExternal>{i18n.t('homePage.iHeart.part2')}</Link>
                        {i18n.t('homePage.iHeart.part3')}</Text>                    
                </VStack>


                {/* Socials */}
                <VStack space={2} p={5} pt={0}  justifyContent={"space-between"}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"} >
                        {i18n.t('homePage.socialMediaTitle')}
                    </Heading>
                    <HStack justifyContent={"space-evenly"} direction={["column", "row", "row"]}>
                        <Button onPress={() => { handleButtonClick("https://github.com/jamielife/", "github_opened")}} w={["100%", "auto", "auto"]} 
                                my={[2,0,0]} fontSize={18} px={4} alignSelf={"flex-start"}><Text color={"white"}><Icon as={MaterialCommunityIcons } name="github"    color="white" size="md"  mt={.5} mr={1} /> @jamielife</Text></Button>
                        <Button onPress={() => { handleButtonClick("https://instagram.com/jamielife/", "instagram_opened")}} w={["100%", "auto", "auto"]}
                                my={[2,0,0]} fontSize={18} px={4} alignSelf={"flex-start"}><Text color={"white"}><Icon as={MaterialCommunityIcons } name="instagram" color="white" size="md"  mt={.5} mr={1} /> @jamielife</Text></Button>
                        <Button onPress={() => { handleButtonClick("https://www.linkedin.com/in/jvptaylor/", "linkedin_opened")}} w={["100%", "auto", "auto"]}
                                my={[2,0,0]} fontSize={18} px={4} alignSelf={"flex-start"}><Text color={"white"}><Icon as={MaterialCommunityIcons } name="linkedin"  color="white" size="md"  mt={.5} mr={1} /> @jvptaylor</Text></Button>
                    </HStack>
                </VStack>

                {/* Site */}
                <VStack space={2} p={5} pt={0}  justifyContent={"space-between"}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"} >
                        {i18n.t('homePage.siteTitle')}
                    </Heading>            
                    <Text fontSize={16}>{i18n.t('homePage.siteInfo.part1')}
                        <Link onPress={() => handleButtonClick('https://github.com/jamielife/portfolio', "github_opened")}
                            _text={{ _light:{ color: "primary.600" }, _dark: { color: "primary.300" }}}
                            _hover={{ _text:{ _light: { color: "primary.400" }, _dark: { color: "primary.100" }, textDecoration: "none" } }} 
                            isExternal>{i18n.t('homePage.siteInfo.part2')}</Link>{i18n.t('homePage.siteInfo.part3')}</Text>
                </VStack>            

                <Footer />
            </View>
        </ScrollView>
    );
}

export default Home;

//Styles
const timeline = { mb: 4, ml: 5 };
const headings = { mt: 1, mb: 4, pb: 2, size: "md", bbw: 3, bbc: "warmGray.500" }
