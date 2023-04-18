import Head from 'next/head'
import dynamic from 'next/dynamic'
import 'tailwindcss/tailwind.css';
import LocationSnap from '../components/LocationSnap';
import Mock from '../components/Mock';

export default function Home() {
  return (
  <>
    <Head>
      <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
    </Head>
    {/* <Mock/> */}
    <LocationSnap />
  </>
  )
}