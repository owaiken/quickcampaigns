import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Heading, Text, Button, Container, VStack, HStack, Image } from '@chakra-ui/react'
import NextLink from 'next/link'
  
const Home: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>SpeedyCampaign</title>
        <meta name="description" content="SpeedyCampaign - Create Facebook Ad Campaigns Quickly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center">
          <Image src="/assets/logo-header.png" alt="SpeedyCampaign Logo" maxW="300px" mb={4} />
          
          <Heading as="h1" size="2xl" textAlign="center">
            Welcome to SpeedyCampaign
          </Heading>
          
          <Text fontSize="xl" textAlign="center" maxW="800px">
            Create Facebook Ad Campaigns Quickly and Efficiently. Our platform helps you build and upload campaigns at lightning speed, directly from your desktop.
          </Text>
          
          <HStack spacing={4} pt={4}>
            <NextLink href="/accounts/login" passHref>
              <Button as="a" colorScheme="blue" size="lg">
                Login
              </Button>
            </NextLink>
            <NextLink href="/accounts/signup" passHref>
              <Button as="a" colorScheme="green" size="lg">
                Sign Up
              </Button>
            </NextLink>
          </HStack>
          
          <Box w="100%" mt={10}>
            <VStack spacing={8}>
              <Heading as="h2" size="xl" textAlign="center">
                Key Features
              </Heading>
              
              <HStack spacing={8} flexWrap="wrap" justifyContent="center">
                <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" maxW="300px">
                  <Heading fontSize="xl">Lightning-Fast Creation</Heading>
                  <Text mt={4}>Build and launch campaigns in seconds, not hours.</Text>
                </Box>
                
                <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" maxW="300px">
                  <Heading fontSize="xl">Seamless Integration</Heading>
                  <Text mt={4}>Upload directly from your desktop, no more navigating sluggish web interfaces.</Text>
                </Box>
                
                <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" maxW="300px">
                  <Heading fontSize="xl">Streamlined Testing</Heading>
                  <Text mt={4}>Effortlessly test a large number of creatives to optimize ad performance.</Text>
                </Box>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default Home
