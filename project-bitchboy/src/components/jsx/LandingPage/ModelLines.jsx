import { useState, useEffect } from 'react';

function ModelLines() {
  const [showLines1, setShowLines1] = useState(false);
  const [showLines2, setShowLines2] = useState(false);
  const [linesProgress, setLinesProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      
      // First set of lines - appear quickly and stay during holdLines1
      if (scrollProgress >= 0.40 && scrollProgress <= 0.60) {
        setShowLines1(true);
        // Modified progress calculation to make lines appear faster
        setLinesProgress(Math.min(1, ((scrollProgress - 0.40) / 0.05))); // Uses only first 5% of scroll for animation
      } else {
        setShowLines1(false);
        setLinesProgress(0);
      }

      // Second set of lines - appear quickly and stay during holdLines2
      if (scrollProgress >= 0.70 && scrollProgress <= 0.85) {
        setShowLines2(true);
        // Modified progress calculation to make lines appear faster
        setLinesProgress(Math.min(1, ((scrollProgress - 0.70) / 0.05))); // Uses only first 5% of scroll for animation
      } else {
        setShowLines2(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Faster line appearance with shorter delays
  const getDelayedProgress = (progress, delay) => {
    return Math.max(0, Math.min(1, (progress - delay) / (0.3 - delay))); // Shorter animation window
  };

  return (
    <>
      {/* First set of lines */}
      <div className="model-lines-container" style={{ opacity: showLines1 ? 1 : 0 }}>
        {/* Line 1-1: Corrected direction */}
        <div className="model-line" style={{ 
          transform: `scaleX(${getDelayedProgress(linesProgress, 0)})`,
          top: '30%',
          left: '35%',
          width: '350px',
          transformOrigin: 'right center',
          transform: 'rotate(5deg)'
        }}>
          <span className="line-text" style={{ 
            opacity: getDelayedProgress(linesProgress, 0) >= 0.8 ? 1 : 0,
            right: '400px', // Changed from left to right
            top: '-80px',
            width: '350px',
            textAlign: 'left', // Changed from right to left
            transform: 'rotate(-5deg)'
          }}>
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
          </span>
        </div>

        {/* Line 1-2: Corrected direction */}
        <div className="model-line" style={{ 
          transform: `scaleX(${getDelayedProgress(linesProgress, 0.02)})`,
          top: '55%',
          left: '30%',
          width: '250px',
          transformOrigin: 'right center',
          transform: 'rotate(-10deg)'
        }}>
          <span className="line-text" style={{ 
            opacity: getDelayedProgress(linesProgress, 0.02) >= 0.8 ? 1 : 0,
            right: '300px', // Changed from left to right
            top: '-40px',
            width: '350px',
            textAlign: 'left', // Changed from right to left
            transform: 'rotate(10deg)'
          }}>
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
          </span>
        </div>
      </div>

      {/* Second set of lines */}
      <div className="model-lines-container" style={{ opacity: showLines2 ? 1 : 0 }}>
        {/* First line of second set */}
        <div className="model-line" style={{ 
          transform: `scaleX(${getDelayedProgress(linesProgress, 0)}) rotate(150deg)`, // Changed from -30deg to 150deg
          top: '40%',
          left: '5%',
          width: '400px',
          transformOrigin: 'right center', // Changed from left to right
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            left: '-580px', // Changed from right to left
            top: '-225px',
            width: '550px',
            textAlign: 'center', // Changed from left to right
            transform: 'rotate(-150deg)' // Adjusted to match new line angle
          }}>
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet
          </span>
        </div>

        {/* Line 2-2: Diagonal line now pointing down-left */}
        <div className="model-line" style={{ 
          transform: `scaleX(${getDelayedProgress(linesProgress, 0.05)}) rotate(180deg)`, // Changed from 45deg to 135deg
          top: '45%',
          left: '20%',
          width: '380px',
          transformOrigin: 'right center' // Changed from left to right
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            left: '-420px', // Changed from right to left
            top: '-85px',
            width: '380px',
            textAlign: 'center', // Changed from left to right
            transform: 'rotate(-180deg)' // Adjusted to match new line angle
          }}>
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
          </span>
        </div>

        {/* Line 2-3: Diagonal line now pointing down-left */}
        <div className="model-line" style={{ 
          transform: `scaleX(${getDelayedProgress(linesProgress, 0.1)}) rotate(200deg)`, // Changed from 45deg to 135deg
          top: '70%',
          left: '25%',
          width: '320px',
          transformOrigin: 'right center' // Changed from left to right
        }}>
          <span className="line-text" style={{ 
            opacity: linesProgress >= 0.9 ? 1 : 0,
            left: '-450px', // Changed from right to left
            top: '15px',
            textAlign: 'center', // Changed from left to right
            width: '430px',
            transform: 'rotate(-200deg)' // Adjusted to match new line angle
          }}>
            Veyr cool trackpad. Like the coolest trackpad ever. Do you even feel like a plastic bag? Cool trackpad tho.
          </span>
        </div>
      </div>
    </>
  );
}

export default ModelLines;