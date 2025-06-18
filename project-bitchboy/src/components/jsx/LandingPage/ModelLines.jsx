import { useState, useEffect } from 'react';

function ModelLines() {
  const [showLines1, setShowLines1] = useState(false);
  const [showLines2, setShowLines2] = useState(false);
  const [linesProgress, setLinesProgress] = useState(0);

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

  return (
    <>
      {/* First set of lines */}
      <div className="model-lines-container" style={{ opacity: showLines1 ? 1 : 0 }}>
        {/* Line 1-1: */}
        <div className="model-line" style={{ 
          transform: `rotate(5deg)`,
          top: '30%',
          left: '35%',
          width: '350px',
          transformOrigin: 'right center',
        }}>
          <span className="line-text" style={{
            opacity: getDelayedProgress(linesProgress, 0) >= 0.8 ? 1 : 0,
            right: '400px',
            top: '-80px',
            width: '350px',
            textAlign: 'left',
            transform: 'rotate(-5deg)'
          }}>
            Designed for speed. Instantly switch animations, trigger scenes, and layer visuals with precision. Fully mappable, fully VJ-ready.
          </span>
        </div>

        {/* Line 1-2:*/}
        <div className="model-line" style={{
          transform: `rotate(-10deg)`,
          top: '55%',
          left: '30%',
          width: '250px',
          transformOrigin: 'right center',
        }}>
          <span className="line-text" style={{
            opacity: getDelayedProgress(linesProgress, 0.02) >= 0.8 ? 1 : 0,
            right: '300px',
            top: '-40px',
            width: '350px',
            textAlign: 'left',
            transform: 'rotate(10deg)'
          }}>
            Control key parameters like opacity, brightness, and playback speed. Smooth, responsive, and perfect for live tweaking.
          </span>
        </div>
      </div>

      {/* Second set of lines */}
      <div className="model-lines-container" style={{ opacity: showLines2 ? 1 : 0 }}>
        {/* First line of second set */}
        <div className="model-line" style={{ 
          transform: `rotate(150deg)`,
          top: '40%',
          left: '10%',
          width: '400px',
          transformOrigin: 'right center',
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            left: '-580px',
            top: '-225px',
            width: '550px',
            textAlign: 'center',
            transform: 'rotate(-150deg)'
          }}>
            Quickly adjust hue, zoom, and blur without diving into software menus. Subtle or wild, your visuals, your vibe.
          </span>
        </div>

        {/* Line 2-2: */}
        <div className="model-line" style={{ 
          transform: `rotate(180deg)`,
          top: '45%',
          left: '25%',
          width: '380px',
          transformOrigin: 'right center'
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            left: '-420px',
            top: '-85px',
            width: '380px',
            textAlign: 'center',
            transform: 'rotate(-180deg)'
          }}>
            Total control over 3D movement. Rotate, spin, shift position, and change FOV! All in real time.
          </span>
        </div>

        {/* Line 2-3: */}
        <div className="model-line" style={{ 
          transform: `rotate(200deg)`,
          top: '70%',
          left: '30%',
          width: '320px',
          transformOrigin: 'right center'
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            left: '-450px',
            top: '15px',
            textAlign: 'center',
            width: '430px',
            transform: 'rotate(-200deg)'
          }}>
            Navigate your laptop without lifting a hand. Stay locked into the controller and run your whole set from one spot.
          </span>
        </div>
      </div>
    </>
  );
}

export default ModelLines;