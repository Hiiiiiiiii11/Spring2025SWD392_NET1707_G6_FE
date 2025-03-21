import React from "react";
import { Typography, Card, Button, List, Tag, Avatar, Space } from "antd";
import { Link } from "react-router-dom";
import { CalendarOutlined, FireOutlined, EyeOutlined } from "@ant-design/icons";
import "./News.css";

const { Title, Text, Paragraph } = Typography;

export const newsItems = [
  {
    id: "N001",
    title: "New Skincare Trends in 2025",
    summary:
      "Discover the latest skincare innovations and trends dominating the beauty industry this year.",
    content:
      "The skincare landscape is constantly evolving, and 2025 brings exciting innovations to the forefront. This year, we're seeing a surge in biome-friendly formulas that work with your skin's natural microbiome rather than disrupting it. Fermented ingredients are making a major comeback, offering enhanced potency and bioavailability. Waterless beauty continues to gain momentum as brands prioritize sustainability while delivering concentrated formulations. Personalized skincare powered by AI analysis is becoming more accessible, allowing consumers to receive custom recommendations based on their unique skin concerns. Finally, 'skin cycling' – the practice of rotating active ingredients throughout the week – has become the preferred method for maximizing efficacy while minimizing irritation. These trends reflect the industry's move toward more sustainable, personalized, and scientifically-backed skincare solutions.",
    image: "http://nationalbiznews.com/wp-content/uploads/2024/09/suyu.png",
    date: "March 18, 2025",
    author: "Jessica Wang",
    views: 3452,
    trending: true,
    tags: ["Trends", "Innovation", "2025"],
  },
  {
    id: "N002",
    title: "Launch of New Moisturizer Line with Breakthrough Ingredients",
    summary:
      "Our revolutionary moisturizer collection features cutting-edge peptide technology for unparalleled hydration results.",
    content:
      "We're thrilled to announce the launch of our most advanced moisturizer collection to date. After three years of intensive research and development, our team has created a revolutionary formulation featuring our proprietary Triple-Peptide Complex™. This breakthrough technology works at the cellular level to strengthen the skin barrier, boost hydration by 89% within one hour, and maintain optimal moisture levels for up to 72 hours. The line includes three specialized formulas: Ultra Repair (for dry and sensitive skin), Balanced Renewal (for combination skin), and Oil-Control Hydration (for oily and acne-prone skin). Each product is dermatologist-tested, non-comedogenic, and formulated without parabens, sulfates, and synthetic fragrances. The sustainable packaging is made from 85% post-consumer recycled materials, aligning with our commitment to environmental responsibility. The new moisturizer line will be available in stores nationwide and on our website starting April 1st.",
    image:
      "https://imageio.forbes.com/specials-images/imageserve/67b627384c55833db42e4f4c/Valmont-Vitality-Line/0x0.jpg?format=jpg&width=1440",
    date: "March 15, 2025",
    author: "Dr. Robert Kim",
    views: 4876,
    trending: true,
    tags: ["Product Launch", "Moisturizer", "Innovation"],
  },
  {
    id: "N003",
    title: "Eco-Friendly Skincare Packaging Initiative Reduces Plastic Waste",
    summary:
      "Our comprehensive sustainability program aims to eliminate single-use plastic from all product packaging by 2026.",
    content:
      "In a bold move toward environmental responsibility, we're proud to announce our comprehensive eco-packaging initiative. Starting next month, all new products will feature our innovative plant-based packaging that biodegrades completely within 12 months in industrial composting facilities. For existing products, we're transitioning to fully recyclable alternatives and implementing a container return program that offers customers a 15% discount on their next purchase when they return empty packaging. Our refill stations will be rolled out to 50 flagship stores worldwide, allowing customers to refill their favorite products at a 20% discount compared to buying a new container. These changes are projected to eliminate over 200 tons of plastic waste annually. The initiative is part of our broader sustainability commitment, which includes sourcing 80% of ingredients from renewable sources and achieving carbon neutrality in all operations by 2027. 'This isn't just about reducing our environmental footprint—it's about revolutionizing how the beauty industry approaches packaging altogether,' says our Chief Sustainability Officer.",
    image:
      "https://forexpropreviews.com/wp-content/uploads/2025/01/FunderPro-Incredible-Features-Exclusive-Discount-994x559.png",
    date: "March 10, 2025",
    author: "Emma Phillips",
    views: 2985,
    trending: false,
    tags: ["Sustainability", "Eco-Friendly", "Packaging"],
  },
  {
    id: "N004",
    title:
      "Exclusive Discount Event This Weekend Features Limited Edition Sets",
    summary:
      "Join us for a special two-day event offering up to 40% off on premium skincare collections and exclusive gift-with-purchase opportunities.",
    content:
      "Mark your calendars for our biggest savings event of the season this weekend! On March 22-23, customers will enjoy unprecedented discounts on our most popular skincare lines, including limited-edition gift sets not available at any other time of year. Our Platinum Members will receive early access starting at 8 AM on Saturday, with general access beginning at noon. The highlight of the event is our Mystery Box promotion—spend $150 or more and receive a curated selection of premium products valued at $200+. Additionally, the first 100 customers each day will receive a deluxe sample set featuring our soon-to-be-released summer collection. Virtual consultations with our skincare experts will be available by appointment throughout the weekend, offering personalized recommendations to help you maximize your purchases. 'We wanted to create an event that not only offers exceptional value but also helps our customers discover new products perfectly suited to their skincare needs,' explains our Marketing Director. The event will be available both in-store and online, with free shipping on all orders.",
    image:
      "https://us.medik8.com/cdn/shop/files/20231114_-_PDP_Asset_2_-_Total_Moisture_-_Benefits_-_US.jpg?v=1724793532&width=1024",
    date: "March 5, 2025",
    author: "Marcus Johnson",
    views: 5421,
    trending: true,
    tags: ["Event", "Discount", "Limited Edition"],
  },
  {
    id: "N005",
    title: "Clinical Study Reveals Exceptional Results for Anti-Aging Serum",
    summary:
      "Groundbreaking 12-month clinical trial demonstrates significant wrinkle reduction and skin firmness improvement with our flagship serum.",
    content:
      "The results are in from our comprehensive 12-month clinical study, and they exceed even our optimistic projections. Our Advanced Renewal Serum demonstrated remarkable efficacy in addressing multiple signs of aging across diverse skin types and age groups. The independently conducted study involving 320 participants revealed a 42% reduction in fine lines and wrinkles after 8 weeks, with results continuing to improve throughout the 12-month period. Particularly noteworthy was the 38% improvement in skin firmness and a 54% enhancement in skin radiance, as measured by specialized imaging technology and dermatologist assessment. Participant satisfaction was exceptionally high, with 93% reporting visible improvements and 89% stating they would continue using the product after the study concluded. 'What makes these results particularly significant is the consistency of improvement across different age groups and skin types,' notes the lead dermatologist overseeing the study. These findings position our Advanced Renewal Serum as one of the most effective anti-aging formulations available without a prescription, substantiating our commitment to creating products with scientifically validated results.",
    image:
      "https://cdn.accentuate.io/558287257635/18997624406051/4-v1721106976128.png?1200x628",
    date: "February 28, 2025",
    author: "Dr. Patricia Liu",
    views: 3780,
    trending: false,
    tags: ["Clinical Study", "Anti-Aging", "Research"],
  },
  {
    id: "N006",
    title: "Celebrity Esthetician Joins Our Team as Global Skincare Advisor",
    summary:
      "Renowned skincare expert Mia Rodriguez brings her expertise to our product development and education initiatives.",
    content:
      "We're thrilled to announce that celebrity esthetician Mia Rodriguez has joined our team as Global Skincare Advisor. With over 15 years of experience working with A-list clients and a devoted following of over 3 million social media users, Rodriguez brings unparalleled expertise in advanced treatment protocols and formulation science. In her new role, she will collaborate with our R&D team on developing innovative products, lead our professional education program, and create exclusive content for our digital platforms. Rodriguez is particularly recognized for her expertise in treating hyperpigmentation and acne scarring, having developed several groundbreaking treatment protocols adopted by luxury spas worldwide. 'What drew me to this partnership was the brand's unwavering commitment to formula integrity and the perfect balance between cutting-edge innovation and proven ingredients,' Rodriguez explains. Her first collaborative product—a specialized treatment for post-inflammatory hyperpigmentation—is already in development with an anticipated release in Fall 2025. Rodriguez will make her first public appearance representing the brand at the International Skincare Symposium next month.",
    image:
      "https://imageskincare.com/cdn/shop/files/DAILY__1_1d070749-d0d8-445b-992c-089a447072a6.png?v=1712238288&width=1000",
    date: "February 20, 2025",
    author: "Sophia Williams",
    views: 4125,
    trending: true,
    tags: ["Partnership", "Celebrity", "Expert"],
  },
];

const News = () => {
  // Separate trending news
  const trendingNews = newsItems.filter((item) => item.trending);
  const regularNews = newsItems.filter((item) => !item.trending);

  return (
    <div className="news-container">
      <div className="news-header">
        <Title level={1} className="main-news-title">
          Skincare News & Updates
        </Title>
        <Text className="news-subtitle">
          Stay informed about the latest developments in skincare
        </Text>
      </div>

      {/* Trending News Section */}
      <div className="trending-section">
        <div className="section-header">
          <Title level={3} className="section-title">
            <FireOutlined className="trending-icon" /> Trending News
          </Title>
        </div>

        <div className="trending-grid">
          {trendingNews.map((item, index) => (
            <Card
              key={item.id}
              hoverable
              className={`trending-card ${index === 0 ? "featured-trending" : ""
                }`}
              cover={
                <div className="trending-image-container">
                  <img
                    alt={item.title}
                    src={item.image}
                    className="trending-image"
                  />
                  <div className="trending-badge">Trending</div>
                </div>
              }
            >
              <div className="card-meta">
                <Text className="news-date">
                  <CalendarOutlined /> {item.date}
                </Text>
                <Text className="news-views">
                  <EyeOutlined /> {item.views}
                </Text>
              </div>

              <Title level={4} className="trending-title">
                {item.title}
              </Title>
              <Paragraph ellipsis={{ rows: 2 }} className="trending-summary">
                {item.summary}
              </Paragraph>

              <div className="news-tags">
                {item.tags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="author-row">
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${item.author}&background=random`}
                />
                <Text className="author-name">{item.author}</Text>
              </div>

              <div className="news-card-button">
                <Link to={`/news/${item.id}`}>
                  <Button type="primary">Read Full Story</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>



    </div>
  );
};

export default News;
