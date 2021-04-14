import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

const Index = () => {
  const { locale, locales } = useRouter();
  const router = useRouter();

  return (
    <>
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
        <>
          <Layout>
            <h2>Current locale: {locale}</h2>
          </Layout>
          <div>
            <h2>All locales:</h2>
            <nav>
              <ul>
                {locales.map((loc) => (
                  <li key={loc}>
                    <Link href={router.asPath} locale={loc}>
                      <a>{loc}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Index;
