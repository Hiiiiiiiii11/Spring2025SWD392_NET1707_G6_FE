import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Button, 
  Radio, 
  Spin, 
  Result, 
  Typography, 
  Steps, 
  Space,
  Tag,
  Divider,
  List,
  message
} from 'antd';
import { 
  ArrowRightOutlined, 
  ArrowLeftOutlined, 
  CheckOutlined,
  SkinOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import mapResponse from './mapResponse';
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const SkinQuiz = ({ customerId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [mappedResponses, setMappedResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const API_BASE_URL = 'http://localhost:8080/api';
  
  const getKeyResponseIdentifier = (question) => {
    if (question.label) {
      return question.label;
    }
    return `question_${question.questionId}`;
  };
  
  const formatOptionForDisplay = (option) => {
    if (!option) return '';
    const words = option.split('_');
    
    
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    );
    
   
    return capitalizedWords.join(' ');
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/quiz/questions`);
        let quizQuestions = response.data;
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
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load quiz questions. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching questions:', err);
        message.error('Failed to load quiz questions');
      }
    };
    fetchQuestions();
  }, []);
  
  const handleResponseChange = (questionId, selectedIndex) => {
    const currentQuestion = questions.find(q => q.questionId === questionId);
    if (!currentQuestion || !currentQuestion.options) return;
    
    const selectedOption = currentQuestion.options[selectedIndex];
    const keyIdentifier = getKeyResponseIdentifier(currentQuestion);
    
    // Get mapped value using the correct label
    const label = currentQuestion.label;
    const mappedValue = mapResponse(label, selectedOption);
    
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
      message.warning(`Please answer all ${unansweredQuestions} remaining questions before submitting.`);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Chuyển đổi responses sang format mảng như yêu cầu
      const formattedResponses = questions.map(question => {
        const questionId = question.questionId;
        const selectedIndex = responses[questionId];
        const selectedOption = question.options[selectedIndex];
        
        return {
          questionId: questionId,
          response: selectedOption
        };
      });
      
      const response = await axios.post(
        `${API_BASE_URL}/quiz/submit/${customerId || 1}`,
        formattedResponses
      );
      
      setResults(response.data.quizResult);
      setRecommendedProducts(response.data.recommendedProducts);
      
      if (onComplete) {
        onComplete({
          quizResult: response.data.quizResult,
          recommendedProducts: response.data.recommendedProducts
        });
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to submit quiz. Please try again later.');
      setIsLoading(false);
      console.error('Error submitting quiz:', err);
      message.error('Failed to submit quiz');
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Loading your skin assessment..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error}
        extra={[
          <Button type="primary" key="retry" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        ]}
      />
    );
  }
  
  if (results) {
    return (
      <Card 
        title={<Title level={3} style={{ textAlign: 'center' }}>Your Skin Analysis Results</Title>}
        style={{ maxWidth: 1000, margin: '0 auto' }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>
            <SkinOutlined /> Your Skin Type:
          </Title>
          <Tag color="blue" style={{ fontSize: 16, padding: '5px 10px' }}>
            {results.recommendedSkinType}
          </Tag>
          <Paragraph style={{ marginTop: 16 }}>
            Based on your responses, your skin appears to be {results.recommendedSkinType.toLowerCase()} type.
            This assessment is designed to help you understand your skin better and guide you toward
            appropriate skincare products.
          </Paragraph>
        </div>
        
        {results.recommendedConcerns && results.recommendedConcerns.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>Your Skin Concerns:</Title>
            <Space wrap>
              {results.recommendedConcerns.map((concern, index) => (
                <Tag color="purple" key={index} style={{ fontSize: 14, padding: '4px 8px', margin: '4px' }}>
                  {concern}
                </Tag>
              ))}
            </Space>
          </div>
        )}
        
        <Divider />
        
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Recommended Products</Title>
          {recommendedProducts.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
              dataSource={recommendedProducts}
              renderItem={product => (
                <List.Item>
                  <Card 
                    hoverable 
                    cover={product.imageURL && <img alt={product.productName} src={product.imageURL} />}
                  >
                    <Card.Meta
                      title={product.productName}
                      description={
                        <>
                          <div style={{ marginBottom: 8 }}>{product.category}</div>
                          <div style={{ marginBottom: 8 }}>{product.description}</div>
                          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>${product.price}</div>
                          <Space>
                            {product.targetsConcerns && product.targetsConcerns.map((concern, i) => (
                              <Tag key={i} color="green">{concern}</Tag>
                            ))}
                          </Space>
                          <Button 
                            type="primary" 
                            style={{ marginTop: 12 }}
                            onClick={() => window.location.href = `/products/${product.productID}`}
                          >
                            View Details
                          </Button>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Paragraph>No specific products recommended at this time.</Paragraph>
          )}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" size="large" onClick={() => window.location.href = '/products'}>
            Browse All Products
          </Button>
        </div>
      </Card>
    );
  }
  
  if (questions.length === 0) {
    return (
      <Result
        status="info"
        title="No Questions Available"
        subTitle="There are no quiz questions available at the moment."
      />
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const options = currentQuestion.options || [];
  
  return (
    <div className="skin-quiz-container">
      <Steps
        current={currentQuestionIndex}
        size="small"
        style={{ maxWidth: 800, margin: '0 auto 20px' }}
        onChange={goToQuestion}
      >
        {questions.map((_, index) => (
          <Step 
            key={index} 
            disabled={index > currentQuestionIndex + 1} 
          />
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
              <Radio 
                key={`${currentQuestion.questionId}-${index}`} 
                value={index}
                style={{ fontSize: 16 }}
              >
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