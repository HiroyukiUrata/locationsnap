import Head from 'next/head'
import UploadComponent from '../components/UploadComponent';
import 'tailwindcss/tailwind.css';
export default function Fileupload() {
    return (
      <>
        <Head>
          <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
        </Head>
        <UploadComponent/>
       </>
    )
  }
