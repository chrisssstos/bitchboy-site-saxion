import "./css/PricingPage.css";

export default function PricingPage() {
  return (
    <div className="pricing-page">
      <div className="container noselect">
        <div className="canvas">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`tracker tr-${i + 1}`}></div>
          ))}
          <div id="card">
            <div className="card-content">
              <div className="card-glare"></div>
              <div className="cyber-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="title1">
                BITCHBOY
                <br />
                ORIGINAL MODEL
              </div>
              <div className="glowing-elements">
                <div className="glow-1"></div>
                <div className="glow-2"></div>
                <div className="glow-3"></div>
              </div>

              <img src="../../public/images/bitchboy_product.png" alt="Card Center" className="card-image" />

              <div className="subtitle1">
                <span>PRE-ORDER NOW FOR</span>
                <span className="highlight"> 500€</span>
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
    </div>
  );
}
