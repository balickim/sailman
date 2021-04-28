import "../public/bootstrap.scss";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "../public/styles.scss";
import "dayjs/locale/en";

import { AuthProvider, ProtectRoute } from "../components/auth/AuthProvider";
import Head from "next/head";

import BackgroundImage from "../components/BackgroundImage";

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProtectRoute>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <BackgroundImage />
        <Component {...pageProps} />
      </ProtectRoute>
    </AuthProvider>
  );
}

export default MyApp;
