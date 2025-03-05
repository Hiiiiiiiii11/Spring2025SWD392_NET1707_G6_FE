import React from 'react';
import { Collapse, Typography } from 'antd';
const { Title, Text } = Typography;

const FAQ = () => {
  const faqs = [
    { question: 'How can I determine my skin type?', answer: 'You can take our Skin Type Quiz or consult with a dermatologist...' },
    { question: 'What payment methods are available?', answer: 'We accept Credit Card, E-Wallet, and Cash on Delivery...' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Frequently Asked Questions</Title>
      <Collapse accordion>
        {faqs.map((faq, index) => (
          <Collapse.Panel header={faq.question} key={index}>
            <Text>{faq.answer}</Text>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default FAQ;