import useTranslation from 'next-translate/useTranslation';

import packageJson from '@root/package.json';

const Layout = () => {
  let { t } = useTranslation('common');

  return (
    <>
      <footer
        className="container-fluid text-white bg-success pt-5 pb-5"
        style={{
          position: 'relative',
          bottom: '0',
          left: '0',
        }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 ">
                  <div className="logo-part">
                    <img src="https://i.ibb.co/sHZz13b/logo.png" className="w-50 logo-footer" />
                    <p>7637 Laurel Dr. King Of Prussia, PA 19406</p>
                    <p>Use this tool as test data for an automated system or find your next pen</p>
                  </div>
                </div>
                <div className="col-md-6 px-4">
                  <h6> About Company</h6>
                  <p>But horizontal lines can only be a full pixel high.</p>
                  <a href="#" className="btn-footer">
                    {' '}
                    More Info{' '}
                  </a>
                  <br />
                  <a href="#" className="btn-footer">
                    {' '}
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 px-4">
                  <h6> Help us</h6>
                  <div className="row ">
                    <div className="col-md-6">
                      <ul>
                        <li>
                          {' '}
                          <a href="#"> Home</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> About</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Service</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Team</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Help</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Contact</a>{' '}
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6 px-4">
                      <ul>
                        <li>
                          {' '}
                          <a href="#"> Cab Faciliy</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Fax</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Terms</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Policy</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Refunds</a>{' '}
                        </li>
                        <li>
                          {' '}
                          <a href="#"> Paypal</a>{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 ">
                  <h6> Newsletter</h6>
                  <div className="social">
                    <a href="#">
                      <i className="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="#">
                      <i className="fa fa-instagram" aria-hidden="true"></i>
                    </a>
                  </div>
                  <form className="form-footer my-3">
                    <input type="text" placeholder="search here...." name="search" />
                    <input type="button" value="Go" />
                  </form>
                  <p>That's technology limitation of LCD monitors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float-end">
          <p>Version: {packageJson.version}</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
