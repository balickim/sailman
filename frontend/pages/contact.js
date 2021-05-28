import Layout from '@components/layout/Layout';
import ContactForm from '@components/forms/ContactForm';

const Contact = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
