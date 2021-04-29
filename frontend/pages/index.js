import Layout from "../components/Layout";
import useTranslation from "next-translate/useTranslation";

import styles from "./index.module.scss";

const Index = () => {
  let { t } = useTranslation("home");

  return (
    <>
      <Layout wrap={false}>
        {/* <!-- Introduction --> */}
        <section
          className={`container-fluid ${styles.introduction}`}
          id="introduction"
        >
          <h1 className="text-center pt-5">{t("Sailman project")}</h1>
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
                  To enjoy good health, to bring true happiness to one's family,
                  to bring peace to all, one must first discipline and control
                  one's own mind. If a man can control his mind he can find the
                  way to Enlightenment, and all wisdom and virtue will naturally
                  come to him.
                </p>
                <p>
                  Saving our planet, lifting people out of poverty, advancing
                  economic growth... these are one and the same fight. We must
                  connect the dots between climate change, water scarcity,
                  energy shortages, global health, food security and women's
                  empowerment. Solutions to one problem must be solutions for
                  all.
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  Our greatest happiness does not depend on the condition of
                  life in which chance has placed us, but is always the result
                  of a good conscience, good health, occupation, and freedom in
                  all just pursuits.
                </p>
                <p>
                  Being in control of your life and having realistic
                  expectations about your day-to-day challenges are the keys to
                  stress management, which is perhaps the most important
                  ingredient to living a happy, healthy and rewarding life.
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

        {/* <!-- Testimonials --> */}
        <section className={`text-center ${styles.testimonials}`}>
          <div className="container">
            <h2 className="mb-5">What people are saying...</h2>
            <div className="row">
              <div className="col-lg-4">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    alt=""
                  />
                  <h5>Fred S.</h5>
                  <p className="font-weight-dark mb-0">
                    "Lorem ipsum dolor sit amet!"
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="https://images.pexels.com/photos/324658/pexels-photo-324658.jpeg?auto=compress&cs=tinysrgb&h=350"
                    alt=""
                  />
                  <h5>Margaret E.</h5>
                  <p className="font-weight-dark mb-0">
                    "Lorem ipsum dolor sit amet"
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                  <img
                    className="img-fluid rounded-circle mb-3"
                    src="https://images.pexels.com/photos/372042/pexels-photo-372042.jpeg?auto=compress&cs=tinysrgb&h=350"
                    alt=""
                  />
                  <h5>Sarah W.</h5>
                  <p className="font-weight-dark mb-0">
                    "Lorem ipsum dolor sit amet!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Services--> */}
        <section className={`bg-primary text-white ${styles.services}`}>
          <div className="container">
            <h2>Services</h2>
            <p className=" mb-5">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form.
            </p>
            <div className="row">
              <div className="col-sm-6 col-lg-4 mb-3">
                <h6>Ex cupidatat eu</h6>
                <p className="">
                  Ex cupidatat eu officia consequat incididunt labore occaecat
                  ut veniam labore et cillum id et.
                </p>
              </div>
              <div className="col-sm-6 col-lg-4 mb-3">
                <h6>Tempor aute occaecat</h6>
                <p className="">
                  Tempor aute occaecat pariatur esse aute amet.
                </p>
              </div>
              <div className="col-sm-6 col-lg-4 mb-3">
                <h6>Voluptate ex irure</h6>
                <p className="">
                  Voluptate ex irure ipsum ipsum ullamco ipsum reprehenderit non
                  ut mollit commodo.
                </p>
              </div>
              <div className="col-sm-6 col-lg-4 mb-3">
                <h6>Tempor commodo</h6>
                <p className="">
                  Tempor commodo nostrud ex Lorem occaecat duis occaecat minim.
                </p>
              </div>
              <div className="col-sm-6 col-lg-4 mb-3">
                <h6>Et fugiat sint occaecat</h6>
                <p className="">
                  Et fugiat sint occaecat voluptate incididunt anim nostrud ea
                  cillum cillum consequat.
                </p>
              </div>
              <div className="col-sm-6 col-lg-4 mb-3">
                <h6>Et labore tempor et</h6>
                <p className="">Et labore tempor et adipisicing dolor.</p>
              </div>
            </div>
          </div>
        </section>

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
                      <button
                        type="submit"
                        className="btn mybtn btn-block btn-lg btn-danger"
                      >
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
