import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// Use dynamic import to avoid SSR issues with the Landing component
const Landing = dynamic(() => import('../components/Landing/Landing'), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>QuickCampaigns</title>
        <meta name="description" content="QuickCampaigns - Create Facebook Ad Campaigns Quickly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Landing />
    </>
  )
}

export default Home
