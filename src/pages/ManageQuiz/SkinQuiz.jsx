import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Typography, Steps, Spin } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { GetAllQuizAPI, submitQuizAPI } from '../../services/ManageQuizService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const SkinQuiz = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({}); // lưu index option trả lời theo questionId
  const [mappedResponses, setMappedResponses] = useState({}); // lưu giá trị mapped theo question (key có thể là questionId hoặc label)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const customerId = sessionStorage.getItem("customerId");

  // Hàm chuyển đổi giá trị trả lời (bạn có thể tuỳ chỉnh theo logic của mình)
  const mapResponseValues = (questionId, answer) => {
    return answer;
  };

  // Hàm lấy key identifier cho mỗi câu hỏi
  const getKeyResponseIdentifier = (question) => {
    return question.questionId;
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let quizQuestions = await GetAllQuizAPI();
        if (Array.isArray(quizQuestions)) {
          // Giới hạn nếu cần, ví dụ lấy 15 câu đầu
          if (quizQuestions.length > 15) {
            quizQuestions = quizQuestions.slice(0, 15);
          }
          setQuestions(quizQuestions);
          const initialResponses = {};
          const initialMappedResponses = {};
          quizQuestions.forEach(question => {
            initialResponses[question.questionId] = null;
            initialMappedResponses[getKeyResponseIdentifier(question)] = null;
          });
          setResponses(initialResponses);
          setMappedResponses(initialMappedResponses);
        } else {
          toast.error('No quiz questions available.');
        }
      } catch (err) {
        toast.error('Failed to load quiz questions');
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleResponseChange = (questionId, selectedIndex) => {
    const currentQuestion = questions.find(q => q.questionId === questionId);
    if (!currentQuestion || !currentQuestion.options) return;
    const selectedOption = currentQuestion.options[selectedIndex];
    const mappedValue = mapResponseValues(questionId, selectedOption);
    const keyIdentifier = getKeyResponseIdentifier(currentQuestion);
    setResponses(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
    setMappedResponses(prev => ({
      ...prev,
      [keyIdentifier]: mappedValue
    }));
  };

  const nextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || responses[currentQuestion.questionId] === null) {
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    const canNavigate = index <= currentQuestionIndex + 1;
    const allPreviousAnswered = questions.slice(0, index).every(q => responses[q.questionId] !== null);
    if (canNavigate && allPreviousAnswered) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmit = async () => {
    // Kiểm tra nếu còn câu hỏi chưa trả lời
    const unansweredCount = questions.filter(q => responses[q.questionId] === null).length;
    if (unansweredCount > 0) {
      toast.warning(`Please answer all ${unansweredCount} remaining questions before submitting.`);
      return;
    }
    try {
      const finalResponses = questions.map(q => ({
        questionId: q.questionId,
        response: mappedResponses[getKeyResponseIdentifier(q)]
      }));
      const submissionResult = await submitQuizAPI(customerId, finalResponses);
      console.log(submissionResult);
      // Giả sử API trả về kết quả trong submissionResult.quizResult
      if (submissionResult && submissionResult.quizResult) {
        const { recommendedSkinType } = submissionResult.quizResult;
        // Lưu recommendedSkinType vào session
        sessionStorage.setItem("recommendedSkinType", recommendedSkinType);
        if (onComplete) {
          onComplete({ quizResult: recommendedSkinType });
        }
        toast.success("Quiz submitted successfully!");
      } else {
        toast.error("Quiz submission failed!");
      }
      // Reset lại câu trả lời sau khi submit
      const resetResponses = {};
      const resetMappedResponses = {};
      questions.forEach(question => {
        resetResponses[question.questionId] = null;
        resetMappedResponses[getKeyResponseIdentifier(question)] = null;
      });
      setResponses(resetResponses);
      setMappedResponses(resetMappedResponses);
      setCurrentQuestionIndex(0);
    } catch (err) {
      toast.error('Failed to submit quiz!');
    }
  };
  const formatOptionForDisplay = (option) => {
    if (!option) return '';
    const words = option.split('_');


    const capitalizedWords = words.map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    );


    return capitalizedWords.join(' ');
  };


  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const options = currentQuestion.options || [];

  return (
    <div className="skin-quiz-container">
      <ToastContainer />
      <Steps
        current={currentQuestionIndex}
        size="small"
        style={{ maxWidth: 800, margin: '0 auto 20px' }}
        onChange={goToQuestion}
      >
        {questions.map((_, index) => (
          <Step key={index} disabled={index > currentQuestionIndex + 1} />
        ))}
      </Steps>

      <Card
        title={<Title level={4}>Skin Type Assessment Quiz</Title>}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <div style={{ minHeight: 200 }}>
          <Title level={5}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Title>
          <Paragraph strong style={{ fontSize: 16, marginBottom: 20 }}>
            {currentQuestion.question}
          </Paragraph>

          <Radio.Group
            onChange={(e) => handleResponseChange(currentQuestion.questionId, e.target.value)}
            value={responses[currentQuestion.questionId]}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {options.map((option, index) => (
              <Radio key={`${currentQuestion.questionId}-${index}`} value={index} style={{ fontSize: 16 }}>
                {formatOptionForDisplay(option)}
              </Radio>
            ))}
          </Radio.Group>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {!isFirstQuestion && (
            <Button type="default" onClick={prevQuestion} icon={<ArrowLeftOutlined />}>
              Previous
            </Button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {!isLastQuestion ? (
              <Button
                type="primary"
                onClick={nextQuestion}
                disabled={responses[currentQuestion.questionId] === null}
                icon={<ArrowRightOutlined />}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={responses[currentQuestion.questionId] === null}
                icon={<CheckOutlined />}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Text type="secondary">
          <InfoCircleOutlined /> Your answers help us determine your skin type and recommend suitable products.
        </Text>
      </div>
    </div>
  );
};

export default SkinQuiz;
