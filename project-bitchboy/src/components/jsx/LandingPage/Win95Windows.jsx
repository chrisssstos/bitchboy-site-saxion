import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

function Win95Windows({ scrollProgress }) {
  const [windows, setWindows] = useState([
    {
      id: 1,
      title: 'System Information',
      content: 'CPU: Intel Pentium 133MHz\nRAM: 16MB\nHDD: 1.2GB\nOS: Windows 95',
      position: { x: 50, y: 50 },
      isOpen: true,
      zIndex: 1
    },
    {
      id: 2,
      title: 'Welcome to BitchBoy',
      content: 'Welcome to the future of VJing!\n\nBitchBoy is a MIDI controller designed for VJs by VJs. Click and drag windows to explore our features.',
      position: { x: 200, y: 150 },
      isOpen: true,
      zIndex: 2
    },
    {
      id: 3,
      title: 'Features',
      content: 'BitchBoy Features:\n• 32 RGB Buttons\n• 8 Precision Sliders\n• 6 Rotary Knobs\n• Resolume Integration\n• TouchDesigner Ready',
      position: { x: 350, y: 100 },
      isOpen: true,
      zIndex: 3
    }
  ]);

  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [highestZ, setHighestZ] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate windows based on scroll progress
  useEffect(() => {
    if (scrollProgress !== undefined) {
      setWindows(prevWindows => prevWindows.map((window, index) => {
        let newPosition = { ...window.position };
        
        // Different animation patterns for each window
        if (index === 0) {
          // First window slides in from left
          const progress = THREE.MathUtils.clamp(scrollProgress * 3, 0, 1);
          newPosition.x = -300 + (350 * progress);
        } else if (index === 1) {
          // Second window slides in from right
          const progress = THREE.MathUtils.clamp((scrollProgress - 0.1) * 3, 0, 1);
          newPosition.x = window.innerWidth + (-(window.innerWidth - 200) * progress);
        } else if (index === 2) {
          // Third window slides in from bottom
          const progress = THREE.MathUtils.clamp((scrollProgress - 0.2) * 3, 0, 1);
          newPosition.y = window.innerHeight + (-(window.innerHeight - 100) * progress);
        }
        
        return { ...window, position: newPosition };
      }));
    }
  }, [scrollProgress]);

  const handleMouseDown = (e, windowId) => {
    const window = windows.find(w => w.id === windowId);
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
    
    setDragging(windowId);
    
    // Bring window to front
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: newZ } : w
    ));
  };

  const handleMouseMove = (e) => {
    if (dragging !== null) {
      setWindows(prev => prev.map(window => 
        window.id === dragging
          ? {
              ...window,
              position: {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
              }
            }
          : window
      ));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleClose = (windowId) => {
    setWindows(prev => prev.map(window =>
      window.id === windowId ? { ...window, isOpen: false } : window
    ));
  };

  useEffect(() => {
    if (dragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, dragOffset]);

  // Mobile-specific window positions
  const mobilePositions = [
    { x: 10, y: 50 },
    { x: 10, y: 200 },
    { x: 10, y: 350 }
  ];

  return (
    <div className="win95-desktop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 5
    }}>
      {windows.map((window, index) => (
        window.isOpen && (
          <div
            key={window.id}
            className="win95-window"
            style={{
              position: 'absolute',
              left: `${isMobile ? mobilePositions[index].x : window.position.x}px`,
              top: `${isMobile ? mobilePositions[index].y : window.position.y}px`,
              zIndex: window.zIndex,
              width: isMobile ? '90vw' : '300px',
              border: '2px solid #000',
              background: '#c0c0c0',
              boxShadow: `
                inset 1px 1px 0 #ffffff,
                inset -1px -1px 0 #808080,
                4px 4px 0 rgba(0, 0, 0, 0.3)
              `,
              pointerEvents: 'auto',
              opacity: scrollProgress !== undefined ? Math.min(scrollProgress * 5, 1) : 1,
              transform: `scale(${isMobile ? 0.9 : 1})`
            }}
          >
            <div 
              className="win95-header"
              onMouseDown={(e) => !isMobile && handleMouseDown(e, window.id)}
              style={{
                background: '#000080',
                color: '#fff',
                padding: '3px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: isMobile ? 'default' : 'move',
                userSelect: 'none',
                height: '22px'
              }}
            >
              <span style={{
                fontWeight: 'bold',
                fontSize: '13px',
                paddingLeft: '5px',
                fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif'
              }}>{window.title}</span>
              <button 
                onClick={() => handleClose(window.id)}
                style={{
                  background: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: '0 5px',
                  height: '16px',
                  width: '18px',
                  fontSize: '10px',
                  lineHeight: '12px',
                  textAlign: 'center',
                  fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ff6b6b';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#c0c0c0';
                  e.target.style.color = '#000';
                }}
                onMouseDown={(e) => {
                  e.target.style.borderColor = '#808080 #ffffff #ffffff #808080';
                  e.target.style.boxShadow = 'inset 1px 1px 0 #000000';
                }}
                onMouseUp={(e) => {
                  e.target.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ✕
              </button>
            </div>
            <div style={{
              padding: '15px',
              background: '#c0c0c0',
              fontFamily: '"MS Sans Serif", Tahoma, Geneva, sans-serif'
            }}>
              <p style={{
                color: '#000',
                fontSize: '13px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.4
              }}>{window.content}</p>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export default Win95Windows;