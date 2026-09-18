import {Text, VStack, Link, Image, Button, ChevronRightIcon, ChevronLeftIcon, Heading, ScrollView, useColorModeValue, View } from "native-base";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Linking, } from "react-native";
import Bowl from "../components/Bowl";
import Footer from "../components/Footer";
import { useI18n } from '../components/LangContext';
import { FBAalytics } from '../firebaseConfig';
import { logEvent } from "firebase/analytics";

function WorkDetail({data}) { 
    const { cameFrom, workDetail } = data.params;
    const navigation = useNavigation(); 
    const iconColor = useColorModeValue("black", "white");
    const i18n = useI18n();

    const date = new Date(workDetail.created_at);
    const hasValidDate = !Number.isNaN(date.getTime());
    const dateCreated = hasValidDate
        ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
        : "";

    i18n.translations.en["dyna" + cameFrom + workDetail.id + "description"] = workDetail.description;    
    i18n.translations.ja["dyna" + cameFrom + workDetail.id + "description"] = workDetail.description_ja;    
    i18n.translations.en["dyna" + cameFrom + workDetail.id + "date"] = dateCreated;    
    i18n.translations.ja["dyna" + cameFrom + workDetail.id + "date"] = hasValidDate
        ? i18n.strftime(date, "%Y年%m月%d日")
        : "";

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
                <VStack p={5} pb={5} pt={0} mt={[-130, -130, -200]} justifyContent={"space-between"}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"}>
                        {/* <Link to={{ screen: cameFrom }}>{cameFrom}</Link>  */}
                        <Link isUnderlined={false} onPress={() => navigation.dispatch( CommonActions.goBack() )}>
                            <Text fontSize={16} fontWeight={500}>
                            {cameFrom !== 'work' ? ( i18n.t('work') ) : i18n.t('posts')} <ChevronRightIcon size="xs" color={iconColor} /> </Text> {i18n.t("dyna" + cameFrom + workDetail.id+"name")}
                        </Link>
                    </Heading>
                    <Text fontSize={12} textAlign={"justify"}>{i18n.t('workDetailsPage.dateTitle')}: {i18n.t("dyna" + cameFrom + workDetail.id + "date")}</Text>              
                </VStack>  

                <VStack  p={5} pb={5} pt={0}   justifyContent={"space-between"}>                
                    <Text fontSize={16} textAlign={"justify"}>{i18n.t("dyna" + cameFrom + workDetail.id+"description")}</Text>         
                </VStack>  

                <VStack  p={5} pb={5} pt={0}  justifyContent={"space-between"}>
                    <Text fontSize={16} textAlign={"justify"}>
                        <Image w={640} height={300} source={{
                            uri: workDetail.imageFull
                        }} alt={i18n.t("dyna" + cameFrom + workDetail.id)} />    
                    </Text>   
                </VStack>  

                { workDetail.imageFull2 !== null && workDetail.imageFull2 !== "" ? 
                    <VStack  p={5} pb={5} pt={0}  justifyContent={"space-between"}>
                        <Text fontSize={16} textAlign={"justify"}>
                            <Image w={640} height={300} source={{
                                uri: workDetail.imageFull2
                            }} alt={i18n.t("dyna" + cameFrom + workDetail.id)} />    
                        </Text>   
                    </VStack>  
                : null }

                <VStack  p={5} pb={5} pt={0}  justifyContent={"space-between"}>
                    { workDetail.url !== null && workDetail.url !== "" ? 
                        <Text fontSize={16} textAlign={"justify"}>{i18n.t('workDetailsPage.openURLCTA')} - <Link 
                            onPress={() => handleButtonClick(workDetail.url, i18n.t("dyna" + cameFrom + workDetail.id+"name") + "_opened") }
                            _text={{ _light:{ color: "primary.600" }, _dark: { color: "primary.300" }}}
                            _hover={{ _text:{ _light: { color: "primary.400" }, _dark: { color: "primary.100" }, textDecoration: "none" } }}
                            isExternal>{workDetail.url}</Link></Text> : null }
                    <Button my={3} alignSelf="center" color="white" onPress={() => navigation.dispatch( CommonActions.goBack() )} >
                        <Text color="white" ><ChevronLeftIcon size="xs" color="white" /> {i18n.t('workDetailsPage.backCTA')}</Text>                        
                    </Button>

                </VStack>  

                <Footer />
            </View>
        </ScrollView>
    );
}

export default WorkDetail;

const headings = { mt: 1, mb: 4, pb: 2, size: "md", bbw: 3, bbc: "warmGray.500" }
