import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import Link from "next/link";

const Breadcrumbs = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const LOCALE = "common";

  const { t } = useTranslation(LOCALE);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  const validateObjectId = (id) => {
    let bool = false;
    if (id.length === 24) bool = /[a-f]+/.test(id);
    return bool;
  };

  const convertBreadcrumb = (string) => {
    let cleanString =
      string.match(/\w+=\w+/g) === null
        ? string
        : string.substring(0, string.indexOf("?")); // delete url parameters from breadcrumb

    let cleanStringArray = cleanString.split("-");

    const isLastPartMongoObjectId = validateObjectId(cleanStringArray.pop());
    cleanString = isLastPartMongoObjectId
      ? cleanStringArray.join("-")
      : cleanString; // if something contains mongodb objectId at the end then delete that id

    const upperCaseString =
      cleanString.charAt(0).toUpperCase() + cleanString.slice(1);
    let translation = t(upperCaseString);

    if (translation.startsWith(LOCALE)) {
      translation = cleanString.charAt(0).toUpperCase() + cleanString.slice(1);
    } // if there is no translation

    return translation.replace(/-/g, " ").toUpperCase();
  };

  return (
    <small style={{ fontSize: "12px" }}>
      <nav aria-label="breadcrumbs">
        <ol className="breadcrumb">
          <li>
            <Link href="/">
              <a>{t("Home").toUpperCase()}</a>
            </Link>
          </li>
          {breadcrumbs.map((breadcrumb, i) => {
            const length = breadcrumbs.length;
            if (length === i + 1) {
              return (
                <li key={breadcrumb.href}>
                  <a>{convertBreadcrumb(breadcrumb.breadcrumb)}</a>
                </li>
              );
            } else {
              return (
                <li key={breadcrumb.href}>
                  <Link href={breadcrumb.href}>
                    <a>{convertBreadcrumb(breadcrumb.breadcrumb)}</a>
                  </Link>
                </li>
              );
            }
          })}
        </ol>
      </nav>
    </small>
  );
};

export default Breadcrumbs;
