import React, { useEffect, useState, useRef } from "react";
import { Text, Flex, Button, Center, Heading, VStack, ScrollView, ChevronRightIcon, View } from "native-base";
import { Linking } from "react-native";
import pocketbase from "../pocketbase";
import WorkTile from "../components/WorkTile";
import Bowl from "../components/Bowl";
import Footer from "../components/Footer";
import { useI18n } from '../components/LangContext';
import { FBAalytics } from '../firebaseConfig';
import { logEvent } from "firebase/analytics";

const Work = () => {
    const [works, setWork] = useState([]);
    const componentMounted = useRef(true);
    const i18n = useI18n();
    
    useEffect(() => {
        const fetchWork = async () => {
            try {
                const data = await pocketbase.collection('work').getFullList({
                    filter: 'hidden = false',
                    sort: '-featured',
                });

                setWork(data);
            } catch (error) {
                console.log('error', error);
            }
        };
        if (componentMounted.current) {
            fetchWork();
        }

        return () => {
            componentMounted.current = false; 
        };
    }, []);

    const handleButtonClick = async (url, event_name) => {
        Linking.openURL(url);        
        await logEvent(FBAalytics, event_name, {
          // event parameters
          location: "sidebar",
        });
    };  

    return ( 
        <ScrollView w={"100%"}>
            <View w={[400, "100%", 640]} alignSelf={"center"}>
                <Bowl />
                <VStack p={5} pb={5} pt={0} mt={[-130, -130, -200]} justifyContent={"space-between"}>
                    <Heading mt={headings.mt} mb={headings.mb} pb={headings.pb} size={headings.size} borderBottomWidth={headings.bbw} borderBottomColor={headings.bbc} alignSelf={"flex-start"}>
                        {i18n.t('work')}
                    </Heading>
                    <Text fontSize={16} textAlign={"justify"}>{i18n.t('workPage.workIntro')}</Text>
                </VStack>      

                {/* Work Component */}
                <Center>
                    <Flex flex={1} flexWrap={"wrap"} flexDirection={"row"} justifyContent={["center", "center", "space-between"]} >
                        {works.map((work, index) => (  
                            //work.hidden !== true?
                            <WorkTile key={work.id} data={work} cameFrom="Work" />
                            //:null
                        ))}
                    </Flex>
                </Center>

                <Center>
                    <Button mt={12} alignSelf="center" onPress={() => handleButtonClick('https://jamietaylor.me/resume-jamie-taylor.pdf', 'resume_opened') } >
                        <Text color={"white"}>{i18n.t('workPage.resumeCTA')} <ChevronRightIcon size="xs" color="white" /></Text>
                    </Button>
                </Center>

                <Footer />
            </View>
        </ScrollView>
    );
}
 
export default Work;

//Styles
const headings = { mt: 1, mb: 4, pb: 2, size: "md", bbw: 3, bbc: "warmGray.500" }
