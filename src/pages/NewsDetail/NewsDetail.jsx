import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Breadcrumb,
  Tag,
  Space,
  Card,
  Avatar,
  Divider,
  Button,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  ShareAltOutlined,
  LeftOutlined,
  RightOutlined,
  FireOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { newsItems } from "../../components/News/News";
import "./newDetails.css";
const { Title, Text, Paragraph } = Typography;

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [prevNews, setPrevNews] = useState(null);
  const [nextNews, setNextNews] = useState(null);

  useEffect(() => {
    // Find the current news item
    const currentNews = newsItems.find((item) => item.id === id);
    setNews(currentNews);

    if (currentNews) {
      // Find related news that share tags with the current news
      const related = newsItems
        .filter(
          (item) =>
            item.id !== id &&
            item.tags.some((tag) => currentNews.tags.includes(tag))
        )
        .slice(0, 3);
      setRelatedNews(related);

      // Find previous and next news
      const currentIndex = newsItems.findIndex((item) => item.id === id);
      setPrevNews(currentIndex > 0 ? newsItems[currentIndex - 1] : null);
      setNextNews(
        currentIndex < newsItems.length - 1 ? newsItems[currentIndex + 1] : null
      );
    }
  }, [id]);

  if (!news) {
    return <div className="loading-container">Loading...</div>;
  }

  // Function to format content with paragraphs
  const formatContent = (content) => {
    return content
      .split(". ")
      .map((sentence, index) => <Paragraph key={index}>{sentence}.</Paragraph>);
  };

  return (
    <div className="news-detail-container">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/news">News</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{news.title}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="news-detail-header">
        <div className="news-meta-top">
          <Space>
            {news.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
            {news.trending && (
              <Tag icon={<FireOutlined />} color="red">
                Trending
              </Tag>
            )}
          </Space>
          <Text className="news-date">
            <CalendarOutlined /> {news.date}
          </Text>
        </div>

        <Title level={1} className="news-detail-title">
          {news.title}
        </Title>

        <Paragraph className="news-summary">{news.summary}</Paragraph>

        <div className="author-view-container">
          <div className="author-container">
            <Avatar
              src={`https://ui-avatars.com/api/?name=${news.author}&background=random`}
              size={48}
            />
            <div className="author-info">
              <Text className="author-name">{news.author}</Text>
              <Text type="secondary">Skincare Journalist</Text>
            </div>
          </div>

          <div className="view-share-container">
            <Tag icon={<EyeOutlined />} color="processing">
              {news.views} Views
            </Tag>
            <div className="share-buttons">
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                className="share-button"
              >
                Share
              </Button>
              <div className="social-icons">
                <Button
                  type="text"
                  icon={<FacebookOutlined />}
                  shape="circle"
                />
                <Button type="text" icon={<TwitterOutlined />} shape="circle" />
                <Button
                  type="text"
                  icon={<LinkedinOutlined />}
                  shape="circle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="news-detail-image-container">
        <img src={news.image} alt={news.title} className="news-detail-image" />
      </div>

      <div className="news-detail-content">{formatContent(news.content)}</div>

      <Divider />

      <div className="navigation-buttons">
        {prevNews && (
          <Link to={`/news/${prevNews.id}`} className="prev-button">
            <Button icon={<LeftOutlined />}>
              Previous:{" "}
              {prevNews.title.length > 25
                ? `${prevNews.title.substring(0, 25)}...`
                : prevNews.title}
            </Button>
          </Link>
        )}

        {nextNews && (
          <Link to={`/news/${nextNews.id}`} className="next-button">
            <Button icon={<RightOutlined />}>
              Next:{" "}
              {nextNews.title.length > 25
                ? `${nextNews.title.substring(0, 25)}...`
                : nextNews.title}
            </Button>
          </Link>
        )}
      </div>

      {relatedNews.length > 0 && (
        <div className="related-news-section">
          <Title level={3} className="related-title">
            Related News
          </Title>

          <Row gutter={[24, 24]}>
            {relatedNews.map((item) => (
              <Col xs={24} sm={8} key={item.id}>
                <Card
                  hoverable
                  className="related-news-card"
                  cover={
                    <img
                      alt={item.title}
                      src={item.image}
                      className="related-news-image"
                    />
                  }
                >
                  <div className="card-meta">
                    <Text className="news-date">
                      <CalendarOutlined /> {item.date}
                    </Text>
                    {item.trending && (
                      <Tag icon={<FireOutlined />} color="red">
                        Trending
                      </Tag>
                    )}
                  </div>

                  <Title
                    level={4}
                    ellipsis={{ rows: 2 }}
                    className="related-news-title"
                  >
                    {item.title}
                  </Title>

                  <Link to={`/news/${item.id}`}>
                    <Button type="primary" block>
                      Read Full Story
                    </Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div className="subscribe-banner">
        <div className="subscribe-content">
          <Title level={4}>Want more skincare updates?</Title>
          <Paragraph>
            Subscribe to our newsletter and never miss important skincare news.
          </Paragraph>
          <div className="subscribe-form-small">
            <input type="email" placeholder="Your email address" />
            <Button type="primary">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
