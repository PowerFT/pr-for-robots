export type Webinar = {
  id: string;
  title: string;
  description: string;
  /** Thumbnail in /public/images. Replaced by the Claude Design export assets. */
  thumbnail: string;
  /** Watch URL — to be filled in once the recordings are hosted. */
  url: string;
};

export const videos: Webinar[] = [
  {
    id: "seo-world-run-by-machines",
    title: "PR for Robots: How Publicity Fuels SEO in a World Run by Machines",
    description:
      "Discover why earned media, authority and reputation have become powerful signals for both traditional search engines and AI-driven search.",
    thumbnail: "",
    url: "",
  },
  {
    id: "travel-disrupted",
    title: "PR for Robots: Managing AI Search While Travel Is Disrupted",
    description:
      "Learn how travel and tourism brands can protect their visibility and reputation when AI is increasingly influencing traveler decisions during periods of disruption.",
    thumbnail: "",
    url: "",
  },
  {
    id: "real-estate",
    title: "PR for Robots: How Publicity Fuels Customer AI Searches for Real Estate",
    description:
      "Explore how publicity and third-party credibility help real estate brands become more discoverable and trustworthy when buyers turn to AI for advice.",
    thumbnail: "",
    url: "",
  },
];
