import useTranslation from 'next-translate/useTranslation';

import Layout from '@components/layout/Layout';
import styles from '@pages/index.module.scss';

const Index = () => {
  let { t } = useTranslation('home');

  return (
    <>
      <Layout wrap={false}>
        {/* <!-- Introduction --> */}
        <section className={`container-fluid ${styles.introduction}`} id="introduction">
          <div className="container-fluid pt-5"></div>
          {/* <div className={`pt-5 ${styles.menu}`}> */}
          <ul className={`pt-5 ${styles.menu}`}>
            <li className={`${styles.item}`}>
              <p className={`${styles.child}`}>LOREM IPSUM</p>
            </li>
            <li className={`${styles.item}`}>
              <p className={`${styles.child}`}>DOLOR SIT AMET</p>
            </li>
            <li className={`${styles.item}`}>
              <p className={`${styles.child}`}>LOREM IPSUM</p>
            </li>
            <li className={`${styles.item}`}>
              <p className={`${styles.child}`}>DOLOR SIT AMET</p>
            </li>
          </ul>
          {/* </div> */}
        </section>

        {/* <!-- About us --> */}
        <section className={`container-fluid ${styles.aboutUs}`} id="about">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <h2>
                  <small>Who We Are</small>About
                  <br />
                  Our Blog
                </h2>
              </div>
              <div className="col-md-4">
                <p>
                  To enjoy good health, to bring true happiness to one's family, to bring peace to
                  all, one must first discipline and control one's own mind. If a man can control
                  his mind he can find the way to Enlightenment, and all wisdom and virtue will
                  naturally come to him.
                </p>
                <p>
                  Saving our planet, lifting people out of poverty, advancing economic growth...
                  these are one and the same fight. We must connect the dots between climate change,
                  water scarcity, energy shortages, global health, food security and women's
                  empowerment. Solutions to one problem must be solutions for all.
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  Our greatest happiness does not depend on the condition of life in which chance
                  has placed us, but is always the result of a good conscience, good health,
                  occupation, and freedom in all just pursuits.
                </p>
                <p>
                  Being in control of your life and having realistic expectations about your
                  day-to-day challenges are the keys to stress management, which is perhaps the most
                  important ingredient to living a happy, healthy and rewarding life.
                </p>
                <p>
                  <a href="#" className="btn btn-primary">
                    Explore More
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container-fluid pt-5"></div>

        {/* <!-- Call to Action --> */}
        <section className={`text-center text-white ${styles.callToAction}`}>
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-xl-9 mx-auto">
                <h2 className="mb-4">Ready to get started?</h2>
              </div>
              <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                <form>
                  <div className="form-row">
                    <div className="col-12 col-md-9 mb-2 mb-md-0">
                      <input
                        type="email"
                        className="form-control myform form-control-lg"
                        placeholder="Enter your email..."
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <button type="submit" className="btn mybtn btn-block btn-lg btn-danger">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Index;
