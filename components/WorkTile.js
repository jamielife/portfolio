import { Linking } from "react-native";
import {Text, Image, Stack, Pressable, Heading, Icon, Tooltip, Box } from "native-base";
import { useNavigation, CommonActions  } from '@react-navigation/native';
import { useI18n } from '../components/LangContext';
import { MaterialIcons } from "@expo/vector-icons";
import { FBAalytics } from '../firebaseConfig';
import { logEvent } from "firebase/analytics";
import { toWorkSlug } from '../utils/workSlug';

function WorkTile({data, cameFrom}) {
    const navigation = useNavigation(); 
    const i18n = useI18n();  

    i18n.translations.en["dyna" + cameFrom + data.id] = data.blurb;
    i18n.translations.en["dyna" + cameFrom + data.id + "name"] = data.name;
    i18n.translations.en["dyna" + cameFrom + data.id + "type"] = data.type;
    i18n.translations.ja["dyna" + cameFrom + data.id] = data.blurb_ja;
    i18n.translations.ja["dyna" + cameFrom + data.id + "name"] = data.name_ja;
    i18n.translations.ja["dyna" + cameFrom + data.id + "type"] = data.type_ja;

    const handleButtonClick = async (url, event_name) => {
        Linking.openURL(url);        
        await logEvent(FBAalytics, event_name, {
          // event parameters
          location: "sidebar",
        });
    };      

    return ( 
        <Pressable m={2} shadow="2" rounded="lg" w={{ base: 96, md: 72, lg: 48 }} 
            _light={{ bg: "coolGray.50" }} _dark={{ bg: "gray.800" }} 
            onPress={() => {
                if(cameFrom == "Work") navigation.dispatch( CommonActions.navigate({ name: 'WorkDetail', params: { slug: toWorkSlug(data.name) } } ) );
                else handleButtonClick(data.url, i18n.t("dyna" + cameFrom + data.id + "name") + "__tile_opened");
            }} 
            _hover={{ _light:{ bg: "white" }, _dark:{ bg: "gray.800:alpha.60" }, style:{ transform: [{ scale: 1.025 }] } }}
            _pressed={{ style:{ transform: [{ scale: .965 }] }}}
            >
                <Image borderTopRadius="10" w={"100%"} h={110} key={data.id} resizeMode="cover" source={{
                    uri: data.imageFull
                }} alt={data.blurb} />

            {/* Category */}
            <Text bold position="absolute" color="coolGray.50" top="0" m={3} mt={2} style={{
                textShadowColor: 'rgba(0, 0, 0, 1)',
                textShadowOffset: {width: 2, height: 2},
                textShadowRadius: 8
            }} >
                {i18n.t("dyna" + cameFrom + data.id + "type").toUpperCase()}
            </Text>

            {/* External Tooltip & Icon */}
            { cameFrom == "Posts" ? 
                    <Tooltip label={i18n.t('postsPage.externalToolTip')} openDelay={250} placement={"right top"} >
                        
                        <Box position="absolute" w={8} h={8} color="white" top={-5} right={-5} bgColor={"primary.500"} justifyContent={"center"}  borderRadius="full" shadow={"4"}>
                            <Icon pl={"2px"} as={MaterialIcons} name="open-in-new" size="sm" color={"white"} alignSelf={"center"} />
                        </Box>
                        
                    </Tooltip>
                : null
            }

            <Stack space="2" p="4">
                <Heading size={"md"} fontWeight="medium">
                    { i18n.t("dyna" + cameFrom + data.id + "name") }
                </Heading>
                <Text isTruncated noOfLines={[2,4,4]} _light={{ color: "coolGray.600" }} _dark={{ color: "coolGray.300" }}>
                    {i18n.t("dyna" + cameFrom + data.id)}
                </Text>
            </Stack>
        </Pressable>
    );
}

export default WorkTile;
