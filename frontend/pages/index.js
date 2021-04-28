import Layout from "../components/Layout";
import useTranslation from "next-translate/useTranslation";

import styles from "./index.module.scss";

const Index = () => {
  let { t } = useTranslation("home");

  return (
    <>
      <Layout />
      <main>
        <section className={`container-fluid ${styles.introduction}`}>
          <h1 className="text-center mt-5">{t("Sailman project")}</h1>
        </section>
        <section className={`container-fluid ${styles.abousUs}`}></section>
      </main>
    </>
  );
};

export default Index;
