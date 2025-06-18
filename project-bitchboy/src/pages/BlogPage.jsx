import "./css/BlogPage.css";
import { useEffect } from 'react';

export default function BlogPage() {

    useEffect(() => {
    if (window.instgrm) {
      // If embed script already loaded
      window.instgrm.Embeds.process();
    } else {
      // Load script only once
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        window.instgrm.Embeds.process();
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
     <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink="https://www.instagram.com/p/DI8TWFGsxXy/?utm_source=ig_embed&amp;utm_campaign=loading"
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: "3px",
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "1px",
        maxWidth: "540px",
        minWidth: "326px",
        padding: 0,
        width: "calc(100% - 2px)",
      }}
    >
      <div style={{ padding: "16px" }}>
        <a
          href="https://www.instagram.com/p/DI8TWFGsxXy/?utm_source=ig_embed&amp;utm_campaign=loading"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#FFFFFF",
            lineHeight: 0,
            padding: "0 0",
            textAlign: "center",
            textDecoration: "none",
            width: "100%",
            display: "block",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: "50%",
                flexGrow: 0,
                height: "40px",
                marginRight: "14px",
                width: "40px",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: "4px",
                  height: "14px",
                  marginBottom: "6px",
                  width: "100px",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: "4px",
                  height: "14px",
                  width: "60px",
                }}
              ></div>
            </div>
          </div>

          <div style={{ padding: "19% 0" }}></div>

          <div
            style={{
              display: "block",
              height: "50px",
              margin: "0 auto 12px",
              width: "50px",
            }}
          >
            {/* Instagram SVG logo — insert as raw HTML or component if needed */}
          </div>

          <div style={{ paddingTop: "8px" }}>
            <div
              style={{
                color: "#3897f0",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                fontWeight: 550,
                lineHeight: "18px",
              }}
            >
              View this post on Instagram
            </div>
          </div>

          <div style={{ padding: "12.5% 0" }}></div>

          {/* Additional decorative layout blocks removed for brevity */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: "4px",
                height: "14px",
                marginBottom: "6px",
                width: "224px",
              }}
            ></div>
            <div
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: "4px",
                height: "14px",
                width: "144px",
              }}
            ></div>
          </div>
        </a>

        <p
          style={{
            color: "#c9c8cd",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "17px",
            marginBottom: 0,
            marginTop: "8px",
            overflow: "hidden",
            padding: "8px 0 7px",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <a
            href="https://www.instagram.com/p/DI8TWFGsxXy/?utm_source=ig_embed&amp;utm_campaign=loading"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#c9c8cd",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "normal",
              lineHeight: "17px",
              textDecoration: "none",
            }}
          >
            A post shared by BitchBoy (@bitchboy.vj)
          </a>
        </p>
      </div>
    </blockquote>
    </div>
  );
}
