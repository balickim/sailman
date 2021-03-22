import "bootstrap/dist/css/bootstrap.min.css";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "../public/styles.css";
import "dayjs/locale/en";

import { AuthProvider, ProtectRoute } from "../actions/AuthProvider";

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProtectRoute>
        <Component {...pageProps} />
      </ProtectRoute>
    </AuthProvider>
  );
}

export default MyApp;
