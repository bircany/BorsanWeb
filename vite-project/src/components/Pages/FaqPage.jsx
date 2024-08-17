import { Card, Col, Row, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import '../../css/FAQ.css';

const faqData = [
  {
    question: "Nasıl şifre elde edebilirim?",
    answer: "Şifre elde etmek için kayıt olma sayfasına gidin ve kayıt formunu doldurun. Kayıt işleminden sonra, e-posta adresinize bir doğrulama maili gönderilecektir."
  },
  {
    question: "Hesabımı nasıl doğrularım?",
    answer: "Kayıt işlemi sırasında belirtilen e-posta adresine bir doğrulama maili gönderilecektir. Bu maildeki linke tıklayarak hesabınızı doğrulayabilirsiniz."
  },
  {
    question: "Şifremi unuttum, nasıl geri alabilirim?",
    answer: "Giriş sayfasındaki 'Şifremi Unuttum' linkine tıklayın. E-posta adresinizi girerek şifre sıfırlama talebinde bulunabilirsiniz."
  },
  {
    question: "Hesap bilgilerimi nasıl güncelleyebilirim?",
    answer: "Hesap bilgilerinizi güncellemek için profil sayfasına gidin ve gerekli değişiklikleri yapın. Güncelleme işlemi tamamlandıktan sonra bilgilerinizi kaydetmeyi unutmayın."
  },
  {
    question: "Üyelik avantajları nelerdir?",
    answer: "Üyelik avantajları arasında özel teklifler, erken erişim fırsatları ve üyeye özel içerikler bulunmaktadır. Üye olarak bu avantajlardan yararlanabilirsiniz."
  }
];

const FaqPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/login'); 

  (
    <div className="faq-container">
      <Button onClick={handleBack} type="primary" className="back-button">
        <ArrowLeftOutlined />
      </Button>
      <h1 className="faq-title">Sıkça Sorulan Sorular</h1>
      <Row gutter={16}>
        {faqData.map((faq, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card title={faq.question} bordered={false} className="faq-card">
              {faq.answer}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};


  return (
    <div className="faq-container">
      <Button onClick={handleBack} type="primary" className="back-button">
        <ArrowLeftOutlined />
      </Button>
      <h1 className="faq-title">Sıkça Sorulan Sorular</h1>
      <Row gutter={16}> 
        {faqData.map((faq, index) => ( 
          <Col span={8} key={index}>
            <Card title={faq.question} bordered={false} className="faq-card">
              {faq.answer}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FaqPage;
