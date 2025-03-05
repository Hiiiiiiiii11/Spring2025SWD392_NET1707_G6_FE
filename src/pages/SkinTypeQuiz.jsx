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
    // 5 câu hỏi mới
    { question: "Da bạn có dễ bị mụn hoặc lỗ chân lông to không?", options: ['Rất dễ', 'Thỉnh thoảng', 'Không'] },
    { question: "Da bạn có bị đỏ hoặc kích ứng khi tiếp xúc với nắng không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có cảm giác căng hoặc khô sau khi rửa mặt không?", options: ['Luôn luôn', 'Thỉnh thoảng', 'Không bao giờ'] },
    { question: "Bạn có thường xuyên sử dụng sản phẩm dưỡng ẩm không?", options: ['Hàng ngày', 'Thỉnh thoảng', 'Không'] },
    { question: "Da bạn có sáng đều màu hay có vùng tối màu không?", options: ['Đều màu', 'Có vùng tối', 'Không chắc chắn'] },
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [current]: value });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      let skinType = 'Normal'; // Mặc định

      // Logic xác định loại da dựa trên tất cả 8 câu trả lời
      if (
        answers[0] === 'Có' && // Da dầu vào cuối ngày
        answers[3] === 'Rất dễ' && // Dễ bị mụn/lỗ chân lông to
        answers[5] !== 'Luôn luôn' // Không căng khô sau rửa mặt
      ) skinType = 'Oily';

      if (
        answers[0] === 'Không' && // Không dầu vào cuối ngày
        answers[2] === 'Có' && // Da khô hoặc bong tróc
        answers[5] === 'Luôn luôn' // Căng khô sau rửa mặt
      ) skinType = 'Dry';

      if (
        answers[0] === 'Thỉnh thoảng' && // Thỉnh thoảng dầu vào cuối ngày
        answers[3] === 'Thỉnh thoảng' && // Thỉnh thoảng mụn/lỗ chân lông to
        answers[2] === 'Thỉnh thoảng' // Thỉnh thoảng khô hoặc bong tróc
      ) skinType = 'Combination';

      if (
        answers[1] === 'Rất nhạy cảm' || // Da nhạy cảm với sản phẩm
        answers[4] === 'Có' // Da đỏ/kích ứng với nắng
      ) skinType = 'Sensitive';

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