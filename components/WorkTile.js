import {Text, Image, FlatList, AspectRatio, Stack, View, Pressable, Container, Icon, Flex, Avatar, Button, Link, HStack, Center, Heading, VStack, Box, ScrollView, Divider  } from "native-base";




function WorkTile({data}) {  
    const imageFull = data.imageFull;
    console.log(imageFull);
    return ( 
        <VStack flex={1} shadow="2" rounded="lg" w={{ base: "120px", md: 50, lg: 48 }} _light={{ bg: "coolGray.50" }} _dark={{ bg: "gray.700" }} overflow={"hidden"}>
            <AspectRatio ratio= {{ 
                            base: 16/9,
                            md: 16/9
                        }} height= {{
                            base: 20,
                            md: 20
                         }}
            >
            <Image resizeMode="cover" source={{
                uri: imageFull
            }} alt="Alternate Text" />                
            </AspectRatio>
            <Text bold position="absolute" color="coolGray.50" top="0" m="4">
                {data.type.toUpperCase()}
            </Text>           
            <Stack space="2" p="4">
                <Text color="gray.400">{data.created_at}</Text>
                <Heading size={"md"} fontWeight="medium" isTruncated>
                    {data.name}
                </Heading>
                <Text isTruncated noOfLines={[2,4,4]}>                
                    {data.blurb}
                </Text>
            </Stack>
            <Box justifyContent={"sp"} position={"relative"} bottom={5}>
                <Text _light={{ color : "primary.800" }} _dark={{ color : "primary.300" }}>Find out more</Text>
            </Box>
            
        </VStack>
    );
}

export default WorkTile;