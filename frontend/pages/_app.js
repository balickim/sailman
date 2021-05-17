import "@public/mdb-react-ui-kit.scss";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "@public/styles.scss";
import "dayjs/locale/en";

import { AuthProvider, ProtectRoute } from "@components/auth/AuthProvider";
import Head from "next/head";

import BackgroundImage from "@components/BackgroundImage";

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
