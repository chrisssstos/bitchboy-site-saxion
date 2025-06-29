import React, { useState, useEffect } from 'react';

function ModelLines() {
  const [showLines1, setShowLines1] = useState(false);
  const [showLines2, setShowLines2] = useState(false);
  const [linesProgress, setLinesProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [hiddenLines, setHiddenLines] = useState(new Set());

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
        setLinesProgress(Math.min(1, ((scrollProgress - 0.40) / 0.05)));
      } else {
        setShowLines1(false);
        setLinesProgress(0);
      }

      if (scrollProgress >= 0.75 && scrollProgress <= 0.85) {
        setShowLines2(true);
        setLinesProgress(Math.min(1, ((scrollProgress - 0.7) / 0.05)));
      } else {
        setShowLines2(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDelayedProgress = (progress, delay) => {
    return Math.max(0, Math.min(1, (progress - delay) / (0.3 - delay)));
  };

  const handleClose = (lineId) => {
    setHiddenLines(prev => new Set([...prev, lineId]));
  };

  const isLineVisible = (lineId) => !hiddenLines.has(lineId);

  // Reset hidden lines when sections change
  useEffect(() => {
    if (!showLines1 && !showLines2) {
      setHiddenLines(new Set());
    }
  }, [showLines1, showLines2]);

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
      left: '18%',
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

  const WindowsDialog = ({ children, title, lineId, style }) => (
    <div
      style={{
        position: 'absolute',
        fontSize: isMobile ? '0.85rem' : '1.4rem',
        color: '#000000',
        transition: 'opacity 0.2s ease',
        pointerEvents: 'auto',
        whiteSpace: 'normal',
        lineHeight: isMobile ? '1.2' : '1.4',
        display: 'block',
        backgroundColor: '#c0c0c0',
        border: isMobile ? '2px solid' : '3px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        borderRadius: '0',
        padding: '0',
        boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf, 3px 3px 6px rgba(0,0,0,0.4)',
        fontFamily: '"MS Sans Serif", "Segoe UI", Tahoma, sans-serif',
        fontWeight: 'normal',
        WebkitFontSmoothing: 'none',
        minWidth: isMobile ? '140px' : '250px',
        ...style
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          position: 'relative',
          height: isMobile ? '18px' : '26px',
          background: 'linear-gradient(90deg, #000080 0%, #0000ff 100%)',
          borderBottom: '1px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: isMobile ? '10px' : '14px',
            fontWeight: 'bold',
            padding: '0 4px',
            userSelect: 'none',
          }}
        >
          {title}
        </span>
        
        {/* Window Controls */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {/* Minimize button */}
          <button
            style={{
              width: isMobile ? '14px' : '18px',
              height: isMobile ? '14px' : '18px',
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              fontSize: isMobile ? '8px' : '10px',
              lineHeight: isMobile ? '12px' : '16px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer',
              padding: 0,
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.preventDefault()}
          >
            _
          </button>
          
          {/* Maximize button */}
          <button
            style={{
              width: isMobile ? '14px' : '18px',
              height: isMobile ? '14px' : '18px',
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              fontSize: isMobile ? '8px' : '10px',
              lineHeight: isMobile ? '12px' : '16px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer',
              padding: 0,
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.preventDefault()}
          >
            □
          </button>
          
          {/* Close button */}
          <button
            style={{
              width: isMobile ? '14px' : '18px',
              height: isMobile ? '14px' : '18px',
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              fontSize: isMobile ? '8px' : '10px',
              lineHeight: isMobile ? '12px' : '16px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer',
              padding: 0,
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
            onClick={() => handleClose(lineId)}
            onMouseDown={(e) => {
              e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
              e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #000000';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
              e.currentTarget.style.boxShadow = '';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div
        style={{
          padding: isMobile ? '6px' : '12px',
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div className="model-lines-container" style={{ opacity: showLines1 ? 1 : 0 }}>
        {isLineVisible('line1_1') && (
          <div className="model-line" style={{ 
            ...styles.line1_1,
            transformOrigin: 'right center',
          }}>
            <WindowsDialog
              title="1. HIGH PROFILE SWITCHES"
              lineId="line1_1"
              style={{
                opacity: getDelayedProgress(linesProgress, 0) >= 0.8 ? 1 : 0,
                ...styles.line1_1.text,
                textAlign: 'left'
              }}
            >
              Instantly switch animations, trigger scenes, and layer visuals with precision. Fully mappable, LED powered, fully VJ-ready.
            </WindowsDialog>
          </div>
        )}

        {isLineVisible('line1_2') && (
          <div className="model-line" style={{
            ...styles.line1_2,
            transformOrigin: 'right center',
          }}>
            <WindowsDialog
              title="2. VERTICAL FADERS"
              lineId="line1_2"
              style={{
                opacity: getDelayedProgress(linesProgress, 0.02) >= 0.8 ? 1 : 0,
                ...styles.line1_2.text,
                textAlign: 'left'
              }}
            >
              Control key parameters like opacity, brightness, and playback speed. Smooth & responsive, like your nuns pie.
            </WindowsDialog>
          </div>
        )}
      </div>

      <div className="model-lines-container" style={{ opacity: showLines2 ? 1 : 0 }}>
        {isLineVisible('line2_1') && (
          <div className="model-line" style={{ 
            ...styles.line2_1,
            transformOrigin: 'right center',
          }}>
            <WindowsDialog
              title="3. HORIZONTAL FADERS"
              lineId="line2_1"
              style={{ 
                opacity: linesProgress >= 0.9 ? 1 : 0,
                ...styles.line2_1.text,
                textAlign: 'center'
              }}
            >
              Quickly adjust effects like hue, zoom, and blur without diving into software menus. Subtle or wild, your visuals, your vibe.
            </WindowsDialog>
          </div>
        )}

        {isLineVisible('line2_2') && (
          <div className="model-line" style={{ 
            ...styles.line2_2,
            transformOrigin: 'right center'
          }}>
            <WindowsDialog
              title="4. KNOBS"
              lineId="line2_2"
              style={{ 
                opacity: linesProgress >= 0.9 ? 1 : 0,
                ...styles.line2_2.text,
                textAlign: 'center'
              }}
            >
              Rotate, spin, shift position, and hue shift the earth. All in real time.
            </WindowsDialog>
          </div>
        )}

        {isLineVisible('line2_3') && (
          <div className="model-line" style={{ 
            ...styles.line2_3,
            transformOrigin: 'right center'
          }}>
            <WindowsDialog
              title="5. TRACKPAD"
              lineId="line2_3"
              style={{ 
                opacity: linesProgress >= 0.9 ? 1 : 0,
                ...styles.line2_3.text,
                textAlign: 'center'
              }}
            >
              Navigate your laptop without lifting a hand. Stay locked into the controller and run your whole set from one spot.
            </WindowsDialog>
          </div>
        )}
      </div>
    </>
  );
}

export default ModelLines;