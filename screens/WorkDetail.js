import React, { useEffect, useState } from 'react';
import {Text, VStack, Link, Image, Button, ChevronRightIcon, ChevronLeftIcon, Heading, ScrollView, useColorModeValue, View, Spinner } from "native-base";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Linking, } from "react-native";
import Bowl from "../components/Bowl";
import Footer from "../components/Footer";
import { useI18n } from '../components/LangContext';
import { FBAalytics } from '../firebaseConfig';
import { logEvent } from "firebase/analytics";
import pocketbase from '../pocketbase';
import { isPocketBaseId, toWorkSlug } from '../utils/workSlug';

function WorkDetail({data}) {
    const id = data.params?.id;
    const slug = data.params?.slug;
    const [result, setResult] = useState(null);
    const navigation = useNavigation();
    const i18n = useI18n();

    useEffect(() => {
        let active = true;
        setResult(null);

        const loadWork = async () => {
            const recordId = id || (isPocketBaseId(slug) ? slug : null);
            const record = recordId
                ? await pocketbase.collection('work').getOne(recordId, { requestKey: null })
                : (await pocketbase.collection('work').getFullList({
                    filter: 'hidden = false',
                    requestKey: null,
                })).find(work => toWorkSlug(work.name) === slug);

            if (!record) throw new Error('Work item not found');
            return record;
        };

        loadWork()
            .then(record => {
                if (active) setResult({ id, slug, record });
            })
            .catch(error => {
                if (active) setResult({ id, slug, error });
            });
        return () => { active = false; };
    }, [id, slug]);

    if (!result || result.id !== id || result.slug !== slug) {
        return <VStack flex={1} justifyContent="center"><Spinner accessibilityLabel="Loading project" /></VStack>;
    }

    if (result.error || result.record.hidden) {
        return (
            <VStack flex={1} justifyContent="center" alignItems="center" space={4} p={5}>
                <Text>{i18n.t('e404.welcomeBar')}</Text>
                <Button onPress={() => navigation.navigate('WorkOverview')}>
                    {i18n.t('workDetailsPage.backCTA')}
                </Button>
            </VStack>
        );
    }

    return <WorkDetailContent workDetail={result.record} />;
}

function WorkDetailContent({workDetail}) {
    const navigation = useNavigation(); 
    const iconColor = useColorModeValue("black", "white");
    const i18n = useI18n();
    const isJapanese = i18n.locale?.toLowerCase().startsWith('ja');
    const workName = isJapanese && workDetail.name_ja ? workDetail.name_ja : workDetail.name;
    const workDescription = isJapanese && workDetail.description_ja
        ? workDetail.description_ja
        : workDetail.description;
    const descriptionParagraphs = isJapanese
        ? (workDescription || '')
            .trim()
            .split(/\r?\n\s*\r?\n/)
            .map(paragraph => paragraph.replace(/\r?\n[ \t]*/g, '').replace(/[ \t]{2,}/g, ' ').trim())
            .filter(Boolean)
        : [(workDescription || '').replace(/\s+/g, ' ').trim()].filter(Boolean);

    const date = new Date(workDetail.created_at);
    const hasValidDate = !Number.isNaN(date.getTime());
    const dateCreated = hasValidDate
        ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
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
                            {i18n.t('work')} <ChevronRightIcon size="xs" color={iconColor} /> </Text> {workName}
                        </Link>
                    </Heading>
                    <Text fontSize={12} textAlign={"justify"}>{i18n.t('workDetailsPage.dateTitle')}: {isJapanese && hasValidDate ? i18n.strftime(date, "%Y年%m月%d日") : dateCreated}</Text>
                </VStack>  

                <VStack  p={5} pb={5} pt={0}   justifyContent={"space-between"}>                
                    <VStack space={4}>
                        {descriptionParagraphs.map((paragraph, index) => (
                            <Text key={index} fontSize={16} textAlign={"justify"}>{paragraph}</Text>
                        ))}
                    </VStack>
                </VStack>  

                <VStack  p={5} pb={5} pt={0}  justifyContent={"space-between"}>
                    <Text fontSize={16} textAlign={"justify"}>
                        <Image w={640} height={300} source={{
                            uri: workDetail.imageFull
                        }} alt={workName} />
                    </Text>   
                </VStack>  

                { workDetail.imageFull2 !== null && workDetail.imageFull2 !== "" ? 
                    <VStack  p={5} pb={5} pt={0}  justifyContent={"space-between"}>
                        <Text fontSize={16} textAlign={"justify"}>
                            <Image w={640} height={300} source={{
                                uri: workDetail.imageFull2
                            }} alt={workName} />
                        </Text>   
                    </VStack>  
                : null }

                <VStack  p={5} pb={5} pt={0}  justifyContent={"space-between"}>
                    { workDetail.url !== null && workDetail.url !== "" ? 
                        <Text fontSize={16} textAlign={"justify"}>{i18n.t('workDetailsPage.openURLCTA')} - <Link 
                            onPress={() => handleButtonClick(workDetail.url, workName + "_opened") }
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
