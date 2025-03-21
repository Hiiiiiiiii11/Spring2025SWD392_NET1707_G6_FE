import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Breadcrumb,
  Avatar,
  Tag,
  Divider,
  Card,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./BlogDetail.css";
import { blogPosts } from "../../components/Blog/Blog";

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  useEffect(() => {
    // Find the current blog post
    const currentBlog = blogPosts.find((post) => post.id === id);
    setBlog(currentBlog);

    if (currentBlog) {
      // Find related posts that share categories with the current post
      const related = blogPosts
        .filter(
          (post) =>
            post.id !== id &&
            post.categories.some((category) =>
              currentBlog.categories.includes(category)
            )
        )
        .slice(0, 3);
      setRelatedPosts(related);

      // Find previous and next posts
      const currentIndex = blogPosts.findIndex((post) => post.id === id);
      setPrevPost(currentIndex > 0 ? blogPosts[currentIndex - 1] : null);
      setNextPost(
        currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null
      );
    }
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  // Function to format content with paragraphs
  const formatContent = (content) => {
    return content
      .split(". ")
      .map((sentence, index) => <Paragraph key={index}>{sentence}.</Paragraph>);
  };

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/blog">Blog</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Title level={1} className="blog-detail-title">
          {blog.title}
        </Title>

        <div className="blog-detail-meta">
          <div className="author-section">
            <Avatar src="https://i.imgur.com/7D7I6dI.png" size={48} />
            <div className="author-info">
              <Text strong className="author-name">
                {blog.author}
              </Text>
              <Text type="secondary" className="publish-date">
                <ClockCircleOutlined /> {blog.date} · {blog.readTime} read
              </Text>
            </div>
          </div>


        </div>
      </div>

      <div className="blog-detail-content">
        <div className="featured-image-container">
          <img src={blog.image} alt={blog.title} className="featured-image" />
        </div>

        <div className="content-body">
          <Paragraph className="summary">
            <strong>{blog.summary}</strong>
          </Paragraph>

          <Divider />

          <div className="main-content">{formatContent(blog.content)}</div>

          <Divider />

          <div className="navigation-buttons">
            <div className="prev-button">
              {prevPost && (
                <Link to={`/blog/${prevPost.id}`} >
                  <Button icon={<LeftOutlined />}>
                    Previous
                  </Button>
                </Link>
              )}
            </div>
            <div className="next-button">
              {nextPost && (
                <Link to={`/blog/${nextPost.id}`} >
                  <Button icon={<RightOutlined />}>
                    Next
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="related-posts-section">
          <Title level={3}>Related Articles</Title>
          <Row gutter={[24, 24]}>
            {relatedPosts.map((post) => (
              <Col xs={24} md={8} key={post.id}>
                <Card
                  hoverable
                  className="related-post-card"
                  cover={
                    <img
                      alt={post.title}
                      src={post.image}
                      className="related-post-image"
                    />
                  }
                >
                  <Title
                    level={4}
                    ellipsis={{ rows: 2 }}
                    className="related-post-title"
                  >
                    {post.title}
                  </Title>
                  <div className="related-post-meta">
                    <Text type="secondary">{post.date}</Text>
                    <Space>
                      <Text type="secondary">
                        <EyeOutlined /> {post.views}
                      </Text>
                      <Text type="secondary">
                        <HeartOutlined /> {post.likes}
                      </Text>
                    </Space>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <Button type="primary" size="middle" block>
                      Read Article
                    </Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
