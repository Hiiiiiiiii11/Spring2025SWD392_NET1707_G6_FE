import React from "react";
import { Typography, Card, Button, Row, Col, Avatar, Tag } from "antd";
import { Link } from "react-router-dom";
import {
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import "./Blog.css";
import tipskincare from "../../assets/tip-skincare.jpg"

const { Title, Text, Paragraph } = Typography;

// Export the blog list to be imported by other components
export const blogPosts = [
  {
    id: "B001",
    title: "Top 10 Skincare Tips for Oily Skin",
    summary:
      "Learn how to care for oily skin effectively with these expert-recommended tips.",
    content:
      "Dealing with oily skin can be challenging, but with the right approach, you can achieve a balanced, healthy complexion. Start by using a gentle foaming cleanser twice daily to remove excess oil without stripping your skin. Always follow with an oil-free, non-comedogenic moisturizer – yes, even oily skin needs hydration! Incorporate products with ingredients like niacinamide, salicylic acid, and clay masks to regulate sebum production and clear pores. Don't over-exfoliate as this can trigger more oil production. Use blotting papers throughout the day for quick touch-ups, and be sure to apply a lightweight, oil-free sunscreen daily. Finally, consider using a retinoid product at night to help control oil and prevent breakouts.",
    image: tipskincare,
    author: "Dr. Sarah Kim",
    date: "March 15, 2025",
    readTime: "8 min",
    views: 2457,
    likes: 342,
    categories: ["Oily Skin", "Skincare Tips"],
    featuredProducts: [
      { id: "P001", name: "Oil Control Foam Cleanser" },
      { id: "P008", name: "Mattifying Moisturizer" },
      { id: "P015", name: "Clay Purifying Mask" },
    ],
  },
  {
    id: "B002",
    title: "Hydrating Masks for Dry Skin: Ultimate Guide",
    summary:
      "Discover the best hydrating masks that will transform your dry, flaky skin into a smooth, dewy canvas.",
    content:
      "Dry skin requires intense hydration, especially during changing seasons. Hydrating masks are a powerful tool for infusing moisture deep into the skin layers. Look for masks containing hyaluronic acid, which can hold up to 1000 times its weight in water, providing deep hydration. Glycerin and ceramides are also excellent ingredients that help repair the skin barrier and lock in moisture. Sheet masks soaked in hydrating serums offer convenience and effectiveness for busy individuals. Overnight masks work while you sleep, allowing ingredients to penetrate deeply for maximum benefit. For severely dry skin, consider masks with natural oils like avocado or argan oil to restore lipids to the skin barrier. We recommend using a hydrating mask 2-3 times per week, especially after exfoliation, to maximize its benefits.",
    image:
      "https://www.lookfantastic.com/images?url=https://blogscdn.thehut.net/wp-content/uploads/sites/2/2019/01/29134500/hydrating_1200x672_acf_cropped.jpg&auto=avif&width=1200&fit=crop",
    author: "Emma Johnson",
    date: "March 10, 2025",
    readTime: "6 min",
    views: 1985,
    likes: 278,
    categories: ["Dry Skin", "Masks"],
    featuredProducts: [
      { id: "P045", name: "Overnight Hydration Mask" },
      { id: "P032", name: "Hyaluronic Acid Sheet Mask Set" },
      { id: "P027", name: "Ceramide Repair Mask" },
    ],
  },
  {
    id: "B003",
    title: "The Benefits of Vitamin C for Your Skin",
    summary:
      "Find out why Vitamin C is essential for healthy skin and how to incorporate it into your routine.",
    content:
      "Vitamin C is a powerhouse skincare ingredient with numerous benefits for all skin types. As a potent antioxidant, it neutralizes free radicals from environmental stressors like UV radiation and pollution, preventing premature aging. Regular use of Vitamin C serums can significantly brighten your complexion by inhibiting melanin production, which helps fade hyperpigmentation and dark spots. It's also crucial for collagen synthesis, improving skin firmness and reducing the appearance of fine lines. For best results, apply a Vitamin C serum in the morning after cleansing and before moisturizer, followed by sunscreen. Look for formulations with L-ascorbic acid at concentrations between 10-20% for maximum efficacy. Store your Vitamin C products in dark, airtight containers away from light and heat to prevent oxidation, which can reduce effectiveness.",
    image:
      "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/11165923-3724961978962314.jpg&format=webp&auto=avif&width=640&height=640&fit=crop",
    author: "Dr. Michael Chen",
    date: "March 5, 2025",
    readTime: "7 min",
    views: 3210,
    likes: 455,
    categories: ["Antioxidants", "Brightening"],
    featuredProducts: [
      { id: "P061", name: "20% Pure Vitamin C Serum" },
      { id: "P072", name: "Vitamin C Brightening Moisturizer" },
      { id: "P085", name: "Antioxidant Protection Drops" },
    ],
  },
  {
    id: "B004",
    title: "Nighttime Routine for Glowing Skin",
    summary:
      "Follow these steps for a glowing complexion that will have everyone asking about your skincare secrets.",
    content:
      "Your nighttime skincare routine is crucial for skin repair and regeneration. Start with a double cleanse: first an oil-based cleanser to remove makeup and sunscreen, followed by a gentle water-based cleanser to deep clean pores. Apply a toner to balance your skin's pH and prep it for the next steps. This is the perfect time to incorporate active ingredients like retinol for cell turnover, peptides for collagen production, or AHAs/BHAs for gentle exfoliation. Layer a hydrating serum with ingredients like hyaluronic acid or niacinamide, focusing on your specific skin concerns. Seal everything in with a nourishing night cream or facial oil. For an extra boost, use an overnight mask 2-3 times weekly. Ensure you're getting 7-8 hours of sleep on a clean pillowcase (changed weekly), and consider using a humidifier in your bedroom to maintain optimal skin hydration levels while you sleep.",
    image:
      "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/11098714-1994866124309290.jpg&format=webp&auto=avif&width=640&height=640&fit=crop",
    author: "Sophia Nguyen",
    date: "February 28, 2025",
    readTime: "9 min",
    views: 4125,
    likes: 587,
    categories: ["Nighttime Routine", "Skin Repair"],
    featuredProducts: [
      { id: "P093", name: "Gentle Cleansing Oil" },
      { id: "P104", name: "Retinol Night Repair Cream" },
      { id: "P112", name: "Peptide Recovery Serum" },
    ],
  },
];

const Blog = () => {
  return (
    <div className="blog-container">
      <div className="blog-header">
        <Title level={1} className="main-title">
          Skincare Journal
        </Title>
        <Text className="blog-subtitle">
          Expert advice and insights for your best skin ever
        </Text>
      </div>

      <div className="featured-post">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <img
              alt={blogPosts[0].title}
              src={blogPosts[0].image}
              className="featured-image"
            />
          </Col>
          <Col xs={24} md={12}>
            <div className="featured-content">
              <Tag color="magenta">Featured Post</Tag>
              <Title level={2}>{blogPosts[0].title}</Title>
              <Paragraph className="featured-summary">
                {blogPosts[0].summary}
              </Paragraph>
              <div className="post-meta">
                <Avatar src="https://i.imgur.com/7D7I6dI.png" size={36} />
                <div className="meta-info">
                  <Text strong>{blogPosts[0].author}</Text>
                </div>
              </div>
              <Link to={`/blog/${blogPosts[0].id}`}>
                <Button type="primary" size="large" className="read-button">
                  Read Article
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>

      <Title level={3} className="section-title">
        Latest Articles
      </Title>

      <Row gutter={[24, 24]} style={{ marginTop: 10 }}>
        {blogPosts.slice(1).map((post) => (
          <Col xs={24} sm={12} lg={8} key={post.id}>
            <Card
              hoverable
              className="blog-card"
              cover={
                <div className="card-image-container">
                  <img
                    alt={post.title}
                    src={post.image}
                    className="card-image"
                  />
                  {post.categories.map((category, index) => (
                    <Tag key={index} className="category-tag">
                      {category}
                    </Tag>
                  ))}
                </div>
              }
            >
              <Title level={4} className="card-title">
                {post.title}
              </Title>
              <Paragraph className="card-summary" ellipsis={{ rows: 2 }}>
                {post.summary}
              </Paragraph>
              <div className="card-meta">
                <div className="author-info">
                  <Avatar src="https://i.imgur.com/7D7I6dI.png" size={28} />
                  <Text className="author-name">{post.author}</Text>
                </div>
                <div className="post-stats">
                </div>
              </div>
              <Link to={`/blog/${post.id}`}>
                <Button type="primary" block className="read-more-button">
                  Read More
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Blog;
