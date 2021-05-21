import "@public/styles/mdb-react-ui-kit.scss";
import "@public/styles/styles.scss";

import "nprogress/nprogress.css";
import "react-image-gallery/styles/scss/image-gallery.scss";
import "react-quill/dist/quill.snow.css";

import "dayjs/locale/en";

import { AuthProvider, ProtectRoute } from "@components/auth/AuthProvider";
import Head from "next/head";

import BackgroundImage from "@components/BackgroundImage";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <meta name="theme-color" content="#317EFB" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AuthProvider>
        <ProtectRoute>
          <BackgroundImage />
          <Component {...pageProps} />
        </ProtectRoute>
      </AuthProvider>
    </>
  );
}

export default MyApp;
