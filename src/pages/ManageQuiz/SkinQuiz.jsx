import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Typography, Steps, Space, Tag, Divider, List } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import mapResponse from './mapResponse';
import { GetAllQuizAPI, submitQuizAPI } from '../../services/ManageQuizService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const SkinQuiz = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [mappedResponses, setMappedResponses] = useState({});
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const customerId = sessionStorage.getItem("customerId");

  const mapResponseValues = (questionId, answer) => {
    return mapResponse(null, answer);
  };

  const getKeyResponseIdentifier = (question) => {
    if (question.label) {
      return question.label;
    }
    return `question_${question.questionId}`;
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let quizQuestions = await GetAllQuizAPI();
        // Check if quizQuestions is an array
        if (Array.isArray(quizQuestions)) {
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
    const unansweredQuestions = questions.filter(q => responses[q.questionId] === null).length;
    if (unansweredQuestions > 0) {
      toast.warning(`Please answer all ${unansweredQuestions} remaining questions before submitting.`);
      return;
    }
    try {
      const finalResponses = Object.fromEntries(
        Object.entries(mappedResponses).filter(([_, v]) => v !== null)
      );
      const submissionResult = await submitQuizAPI(customerId, finalResponses);
      setResults(submissionResult.quizResult.customer.skinConcerns);
      if (onComplete) {
        onComplete({
          quizResult: submissionResult.quizResult.customer.skinConcerns,
        });

      }

      // Clear answers after successful submission:
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


  const currentQuestion = questions[currentQuestionIndex];
  // Guard: in case currentQuestion is undefined
  if (!currentQuestion) {
    return null;
  }
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
                {option}
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
