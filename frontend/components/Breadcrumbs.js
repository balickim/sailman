import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import Link from "next/link";

const convertBreadcrumb = (string) => {
  return string
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü")
    .toUpperCase();
};

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

  return (
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
                <a>
                  {convertBreadcrumb(
                    t(
                      breadcrumb.breadcrumb.charAt(0).toUpperCase() +
                        breadcrumb.breadcrumb.slice(1)
                    ).startsWith(LOCALE)
                      ? breadcrumb.breadcrumb
                      : t(
                          breadcrumb.breadcrumb.charAt(0).toUpperCase() +
                            breadcrumb.breadcrumb.slice(1)
                        )
                  )}
                </a>
              </li>
            );
          } else {
            return (
              <li key={breadcrumb.href}>
                <Link href={breadcrumb.href}>
                  <a>
                    {convertBreadcrumb(
                      t(
                        breadcrumb.breadcrumb.charAt(0).toUpperCase() +
                          breadcrumb.breadcrumb.slice(1)
                      ).startsWith(LOCALE)
                        ? breadcrumb.breadcrumb
                        : t(
                            breadcrumb.breadcrumb.charAt(0).toUpperCase() +
                              breadcrumb.breadcrumb.slice(1)
                          )
                    )}
                  </a>
                </Link>
              </li>
            );
          }
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
