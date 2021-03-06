import "bootstrap/dist/css/bootstrap.min.css";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "../public/styles.css";
import "dayjs/locale/en";

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
