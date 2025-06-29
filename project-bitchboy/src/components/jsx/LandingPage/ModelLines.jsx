import { useState, useEffect } from 'react';

function ModelLines() {
  const [showLines1, setShowLines1] = useState(false);
  const [showLines2, setShowLines2] = useState(false);
  const [linesProgress, setLinesProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);

      if (scrollProgress >= 0.40 && scrollProgress <= 0.60) {
        setShowLines1(true);
        setLinesProgress(Math.min(1, ((scrollProgress - 0.40) / 0.05))); // Uses only first 5% of scroll for animation
      } else {
        setShowLines1(false);
        setLinesProgress(0);
      }

      if (scrollProgress >= 0.75 && scrollProgress <= 0.85) {
        setShowLines2(true);
        setLinesProgress(Math.min(1, ((scrollProgress - 0.7) / 0.05))); // Uses only first 5% of scroll for animation
      } else {
        setShowLines2(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDelayedProgress = (progress, delay) => {
    return Math.max(0, Math.min(1, (progress - delay) / (0.3 - delay))); // Shorter animation window
  };

  const desktopStyles = {
    line1_1: {
      transform: 'rotate(5deg)',
      top: '30%',
      left: '45%',
      width: '350px',
      text: {
        right: '400px',
        top: '-80px',
        width: '350px',
        transform: 'rotate(-5deg)'
      }
    },
    line1_2: {
      transform: 'rotate(-10deg)',
      top: '55%',
      left: '40%',
      width: '250px',
      text: {
        right: '300px',
        top: '-40px',
        width: '350px',
        transform: 'rotate(10deg)'
      }
    },
    line2_1: {
      transform: 'rotate(150deg)',
      top: '37%',
      left: '-20%',
      width: '400px',
      text: {
        left: '-580px',
        top: '-225px',
        width: '550px',
        transform: 'rotate(-150deg)'
      }
    },
    line2_2: {
      transform: 'rotate(180deg)',
      top: '35%',
      left: '11%',
      width: '380px',
      text: {
        left: '-420px',
        top: '-85px',
        width: '380px',
        transform: 'rotate(-180deg)'
      }
    },
    line2_3: {
      transform: 'rotate(200deg)',
      top: '73%',
      left: '8%',
      width: '320px',
      text: {
        left: '-450px',
        top: '15px',
        width: '430px',
        transform: 'rotate(-200deg)'
      }
    }
  };

  const mobileStyles = {
    line1_1: {
      transform: 'rotate(45deg)',
      top: '40%',
      left: '60%',
      width: '100px',
      text: {
        right: '120px',
        top: '-40px',
        width: '250px',
        transform: 'rotate(-45deg)'
      }
    },
    line1_2: {
      transform: 'rotate(-30deg)',
      top: '55%',
      left: '50%',
      width: '100px',
      text: {
        right: '40px',
        top: '-20px',
        width: '250px',
        transform: 'rotate(30deg)'
      }
    },
    line2_1: {
      transform: 'rotate(110deg)',
      top: '50%',
      left: '-30%',
      width: '180px',
      text: {
        left: '-220px',
        top: '-125px',
        width: '250px',
        transform: 'rotate(-110deg)'
      }
    },
    line2_2: {
      transform: 'rotate(150deg)',
      top: '45%',
      left: '30%',
      width: '50px',
      text: {
        left: '-140px',
        top: '-125px',
        width: '130px',
        transform: 'rotate(-150deg)'
      }
    },
    line2_3: {
      transform: 'rotate(250deg)',
      top: '70%',
      left: '55%',
      width: '50px',
      text: {
        left: '-200px',
        top: '-120px',
        width: '320px',
        transform: 'rotate(-250deg)'
      }
    }
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <>
      <div className="model-lines-container" style={{ opacity: showLines1 ? 1 : 0 }}>
        <div className="model-line" style={{ 
          ...styles.line1_1,
          transformOrigin: 'right center',
        }}>
          <span className="line-text" style={{
            opacity: getDelayedProgress(linesProgress, 0) >= 0.8 ? 1 : 0,
            ...styles.line1_1.text,
            textAlign: 'left'
          }}>
            Designed for speed. Instantly switch animations, trigger scenes, and layer visuals with precision. Fully mappable, fully VJ-ready.
          </span>
        </div>

        <div className="model-line" style={{
          ...styles.line1_2,
          transformOrigin: 'right center',
        }}>
          <span className="line-text" style={{
            opacity: getDelayedProgress(linesProgress, 0.02) >= 0.8 ? 1 : 0,
            ...styles.line1_2.text,
            textAlign: 'left'
          }}>
            Control key parameters like opacity, brightness, and playback speed. Smooth, responsive, and perfect for live tweaking.
          </span>
        </div>
      </div>

      <div className="model-lines-container" style={{ opacity: showLines2 ? 1 : 0 }}>
        <div className="model-line" style={{ 
          ...styles.line2_1,
          transformOrigin: 'right center',
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            ...styles.line2_1.text,
            textAlign: 'center'
          }}>
            Quickly adjust effects like hue, zoom, and blur without diving into software menus. Subtle or wild, your visuals, your vibe.
          </span>
        </div>

        <div className="model-line" style={{ 
          ...styles.line2_2,
          transformOrigin: 'right center'
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            ...styles.line2_2.text,
            textAlign: 'center'
          }}>
            Total control with 8 knobs Rotate, spin, shift position, and change FOV! All in real time.
          </span>
        </div>

        <div className="model-line" style={{ 
          ...styles.line2_3,
          transformOrigin: 'right center'
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            ...styles.line2_3.text,
            textAlign: 'center'
          }}>
            Navigate your laptop without lifting a hand. Stay locked into the controller and run your whole set from one spot.
          </span>
        </div>
      </div>
    </>
  );
}

export default ModelLines;