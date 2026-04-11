export const RSS_FEEDS = [
  {
    name: "IEEE Spectrum Robotics",
    url: "https://spectrum.ieee.org/feeds/feed.rss",
    filter: "robot",
  },
  {
    name: "The Robot Report",
    url: "https://www.therobotreport.com/feed/",
  },
  {
    name: "TechCrunch Robotics",
    url: "https://techcrunch.com/tag/robotics/feed/",
  },
  {
    name: "Automation World",
    url: "https://www.automationworld.com/rss.xml",
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    filter: "robot",
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/ai/feed/",
    filter: "robot",
  },
  {
    name: "Wired Robots",
    url: "https://www.wired.com/feed/tag/robots/rss",
  },
];

export interface RawFeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  sourceName: string;
}
