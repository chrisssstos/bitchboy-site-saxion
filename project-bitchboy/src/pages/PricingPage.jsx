import "./css/PricingPage.css";

export default function PricingPage() {
  return (
    <div className="pricing-page">
      {/* Product card */}
      <div className="container noselect">
        
        <div className="canvas">
          <div class="tracker tr-1"></div>
          <div class="tracker tr-2"></div>
          <div class="tracker tr-3"></div>
          <div class="tracker tr-4"></div>
          <div class="tracker tr-5"></div>
          <div class="tracker tr-6"></div>
          <div class="tracker tr-7"></div>
          <div class="tracker tr-8"></div>
          <div class="tracker tr-9"></div>
          <div id="card">
            <div className="card-content">
              <div className="card-glare"></div>
              <div className="cyber-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="title1">BITCHBOY ORIGINAL MODEL</div>
              <div className="glowing-elements">
                <div className="glow-1"></div>
                <div className="glow-2"></div>
                <div className="glow-3"></div>
              </div>

              <img
                src="../../public/images/bitchboy_product.png"
                alt="Card Center"
                className="card-image"
              />

              <div className="subtitle1">
                <span className="highlight">500€</span>
              </div>
              <div className="card-particles">
                <span></span>
                <span></span>
                <span></span> <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="corner-elements">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="scan-line"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Link to Kickstarter Card */}
      <a href="https://www.kickstarter.com/" target="_blank" rel="noopener noreferrer">
      <div class="container2">
        <div class="left-side">
          <div class="card-swipe">
            <div class="card-line"></div>
            <div class="buttons"></div>
          </div>
          <div class="post">
            <div class="post-line"></div>
            <div class="screen">
              <div class="icon">$$$</div>
            </div>
            <div class="numbers"></div>
            <div class="numbers-line2"></div>
          </div>
        </div>
        <div class="right-side">
          <div class="new">GRAB IT NOW</div>
          <svg
            class="arrow"
            viewBox="0 0 451.846 451.847"
            height="512"
            width="512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#000000"
              data-old_color="#000000"
              class="active-path"
              data-original="#000000"
              d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"
            ></path>
          </svg>
        </div>
      </div>
      </a>
    </div>
  );
}
