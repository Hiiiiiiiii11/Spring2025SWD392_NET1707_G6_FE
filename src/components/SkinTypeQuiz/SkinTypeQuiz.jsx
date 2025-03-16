import React, { useState } from 'react';
import { Button, Radio, Typography, Card, Progress, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './SkinTypeQuiz.css';

const { Title, Text } = Typography;

const SkinTypeQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { question: "Da bạn có bị dầu vào cuối ngày không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có nhạy cảm với sản phẩm không?", options: ['Rất nhạy cảm', 'Hơi nhạy cảm', 'Không nhạy cảm'] },
    { question: "Da bạn có bị khô hoặc bong tróc không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Lỗ chân lông của bạn có lớn không?", options: ['Rất lớn', 'Bình thường', 'Nhỏ'] },
    { question: "Da bạn có xuất hiện nếp nhăn sớm không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có bị đỏ hoặc kích ứng không?", options: ['Thường xuyên', 'Hiếm', 'Không bao giờ'] },
    { question: "Da bạn có sáng mịn tự nhiên không?", options: ['Có', 'Không', 'Trung bình'] },
    { question: "Da bạn có bị bóng nhờn ở vùng chữ T không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Bạn có thường xuyên tiếp xúc với ánh nắng không?", options: ['Thường xuyên', 'Hiếm', 'Không'] },
    { question: "Da bạn có bị mất nước (dehydrated) không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Bạn có sử dụng kem chống nắng hàng ngày không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có bị mụn thường xuyên không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có cảm giác căng sau khi rửa mặt không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Bạn có thói quen dưỡng ẩm hàng ngày không?", options: ['Có', 'Không', 'Thỉnh thoảng'] },
    { question: "Da bạn có đều màu không?", options: ['Có', 'Không', 'Trung bình'] },
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [current]: value });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      let skinType = 'Normal';
      const oilyScore = [answers[0], answers[7], answers[11]].filter(a => a === 'Có').length;
      const dryScore = [answers[2], answers[9], answers[12]].filter(a => a === 'Có').length;
      const sensitiveScore = [answers[1], answers[5]].filter(a => a.includes('nhạy')).length;
      const combinationScore = [answers[0], answers[7]].filter(a => a === 'Thỉnh thoảng').length;

      if (oilyScore >= 2) skinType = 'Oily';
      else if (dryScore >= 2) skinType = 'Dry';
      else if (sensitiveScore >= 1) skinType = 'Sensitive';
      else if (combinationScore >= 1 && oilyScore === 1) skinType = 'Combination';

      setCurrent(current + 1); // Chuyển sang bước kết quả
      setTimeout(() => {
        alert(`Loại da của bạn: ${skinType}. Đề xuất sản phẩm: [Sản phẩm phù hợp ${skinType.toLowerCase()}].`);
      }, 500);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="quiz-container">
      <Title className="quiz-title">Skin Type Quiz</Title>
      <Progress
        percent={(current / (questions.length + 1)) * 100}
        showInfo={false}
        strokeColor={{
          '0%': '#87e8de',
          '100%': '#ffadd2',
        }}
        className="quiz-progress"
      />
      <Card className="quiz-card" bordered={false}>
        <Row justify="center" align="middle">
          <Col span={24}>
            {current < questions.length ? (
              <>
                <Text className="quiz-question">{questions[current].question}</Text>
                <Radio.Group
                  onChange={(e) => handleAnswer(e.target.value)}
                  value={answers[current]}
                  className="quiz-radio-group"
                >
                  {questions[current].options.map((option) => (
                    <Radio value={option} key={option} className="quiz-option">
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
                <div className="quiz-buttons">
                  {current > 0 && (
                    <Button onClick={prev} className="quiz-prev-btn">
                      <LoadingOutlined spin={false} /> Previous
                    </Button>
                  )}
                  <Button type="primary" onClick={next} className="quiz-next-btn">
                    {current === questions.length - 1 ? 'Submit' : 'Next'} <LoadingOutlined spin={false} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="quiz-result">
                <Title level={3} className="quiz-result-title">
                  Your Skin Type Result
                </Title>
                <Text className="quiz-result-text">
                  Thank you for completing the quiz! Your skin type will be displayed here soon. (Mock result: Check console for details.)
                </Text>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SkinTypeQuiz;