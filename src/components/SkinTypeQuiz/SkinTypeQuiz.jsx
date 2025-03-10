import React, { useState } from 'react';
import { Steps, Button, Radio, Typography } from 'antd';
const { Title, Text } = Typography;

const SkinTypeQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { question: "Da bạn có bị dầu vào cuối ngày không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có nhạy cảm với sản phẩm không?", options: ['Rất nhạy cảm', 'Hơi nhạy cảm', 'Không nhạy cảm'] },
    { question: "Da bạn có bị khô hoặc bong tróc không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [current]: value });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Xác định loại da dựa trên câu trả lời (logic mẫu)
      let skinType = 'Normal'; // Mặc định
      if (answers[0] === 'Có' && answers[1] === 'Không' && answers[2] === 'Không') skinType = 'Oily';
      if (answers[0] === 'Không' && answers[1] === 'Không' && answers[2] === 'Có') skinType = 'Dry';
      if (answers[0] === 'Thỉnh thoảng' && answers[1] === 'Hơi nhạy cảm' && answers[2] === 'Thỉnh thoảng') skinType = 'Combination';
      if (answers[1] === 'Rất nhạy cảm') skinType = 'Sensitive';
      alert(`Loại da của bạn: ${skinType}. Đề xuất sản phẩm phù hợp sẽ hiển thị sau!`);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>Skin Type Quiz</Title>
      <Steps current={current} items={questions.map((q, i) => ({ title: `Question ${i + 1}` }))} />
      <div style={{ marginTop: 24 }}>
        <Text>{questions[current].question}</Text>
        <Radio.Group onChange={(e) => handleAnswer(e.target.value)} value={answers[current]} style={{ marginTop: 16, display: 'block' }}>
          {questions[current].options.map((option) => (
            <Radio value={option} key={option}>{option}</Radio>
          ))}
        </Radio.Group>
        <Button type="primary" onClick={next} style={{ marginTop: 16 }}>
          {current === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default SkinTypeQuiz;