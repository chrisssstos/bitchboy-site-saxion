import "./css/BlogPage.css";
import { useEffect } from "react";

export default function BlogPage() {
  useEffect(() => {
    const scriptExists = document.querySelector('script[src="https://www.instagram.com/embed.js"]');

    if (!window.instgrm && !scriptExists) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => window.instgrm.Embeds.process();
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  const posts = [
    "https://www.instagram.com/p/DI8TWFGsxXy/",
    "https://www.instagram.com/p/DIGy8Ywt_YQ/",
    "https://www.instagram.com/p/DJg4sUgIe3-/",
    // Add more Instagram post URLs here
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", padding: "20px" }}>
      {posts.map((url, index) => (
        <blockquote
          key={index}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-captioned  // this enables caption
          data-instgrm-version="14"
          style={{ maxWidth: "540px", width: "100%" }}
        ></blockquote>
      ))}
    </div>
  );
}
