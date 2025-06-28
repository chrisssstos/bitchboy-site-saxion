import { useState, useEffect, useRef, useCallback } from 'react';

function ModelLines() {
  const [showLines1, setShowLines1] = useState(false);
  const [showLines2, setShowLines2] = useState(false);
  const [showLines3, setShowLines3] = useState(false);
  const [showLines4, setShowLines4] = useState(false);
  const [showLines5, setShowLines5] = useState(false);
  const [linesProgress, setLinesProgress] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  // Track which windows have been closed
  const [closedWindows, setClosedWindows] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  // Window dragging states
  const [draggingWindow, setDraggingWindow] = useState(null);
  const dragInfoRef = useRef({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });

  // Define specific starting positions for each window
  const [windowPositions, setWindowPositions] = useState({
    1: { x: 300, y: 150 },
    2: { x: 600, y: 700 },
    3: { x: 150, y: 350 },
    4: { x: 650, y: 400 },
    5: { x: 400, y: 300 }
  });

  // Window sizes for dotted outline
  const windowSizes = {
    1: { width: 420, height: 120 },
    2: { width: 420, height: 120 },
    3: { width: 420, height: 120 },
    4: { width: 420, height: 120 },
    5: { width: 420, height: 120 }
  };

  // Refs for window elements
  const windowRefs = useRef({});
  const rafRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);

      if (scrollProgress >= 0.40 && scrollProgress <= 0.60) {
        if (!closedWindows[1]) setShowLines1(true);
        if (!closedWindows[2]) setShowLines2(true);
        setLinesProgress(Math.min(1, (scrollProgress - 0.40) / 0.05));
      } else {
        setShowLines1(false);
        setShowLines2(false);
        setLinesProgress(0);
      }

      if (scrollProgress >= 0.75 && scrollProgress <= 0.85) {
        if (!closedWindows[3]) setShowLines3(true);
        if (!closedWindows[4]) setShowLines4(true);
        if (!closedWindows[5]) setShowLines5(true);
        setLinesProgress(Math.min(1, (scrollProgress - 0.75) / 0.10));
      } else {
        setShowLines3(false);
        setShowLines4(false);
        setShowLines5(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [closedWindows]);

  // Mouse event handlers
  const handleMouseDown = useCallback((windowId, e) => {
    if (e.target.closest('.window-controls')) return;
    e.preventDefault();

    setDraggingWindow(windowId);
    const pos = windowPositions[windowId];
    dragInfoRef.current = {
      startX: pos.x,
      startY: pos.y,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y
    };
  }, [windowPositions]);

  const updateDragPosition = useCallback((e) => {
    if (!draggingWindow || !windowRefs.current[draggingWindow]) return;

    const newX = e.clientX - dragInfoRef.current.offsetX;
    const newY = e.clientY - dragInfoRef.current.offsetY;

    const maxX = window.innerWidth - 450;
    const maxY = window.innerHeight - 200;

    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));

    const win = windowRefs.current[draggingWindow];
    win.style.left = `${clampedX}px`;
    win.style.top  = `${clampedY}px`;
  }, [draggingWindow]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingWindow) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateDragPosition(e));
    };

    const handleMouseUp = (e) => {
      if (!draggingWindow) return;

      const newX = e.clientX - dragInfoRef.current.offsetX;
      const newY = e.clientY - dragInfoRef.current.offsetY;
      const maxX = window.innerWidth - 450;
      const maxY = window.innerHeight - 200;

      setWindowPositions(prev => ({
        ...prev,
        [draggingWindow]: {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        }
      }));

      setDraggingWindow(null);
    };

    if (draggingWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [draggingWindow, updateDragPosition]);

  const handleClose = (windowId) => {
    setClosedWindows(prev => ({ ...prev, [windowId]: true }));
    switch (windowId) {
      case 1: setShowLines1(false); break;
      case 2: setShowLines2(false); break;
      case 3: setShowLines3(false); break;
      case 4: setShowLines4(false); break;
      case 5: setShowLines5(false); break;
      default: break;
    }
  };

  const WindowDialog = ({ id, title, children, show }) => {
    const [hasAppeared, setHasAppeared] = useState(false);

    useEffect(() => {
      if (show && !hasAppeared) {
        setHasAppeared(true);
      }
    }, [show, hasAppeared]);

    if (!show || closedWindows[id]) return null;

    const isDragging = draggingWindow === id;
    const position = windowPositions[id];

    return (
      <>
        {isDragging && (
          <div
            className="dotted-outline"
            style={{
              position: 'fixed',
              left: `${dragInfoRef.current.startX}px`,
              top: `${dragInfoRef.current.startY}px`,
              width: `${windowSizes[id].width}px`,
              height: `${windowSizes[id].height}px`,
              pointerEvents: 'none',
              zIndex: 999
            }}
          />
        )}
        <div
          ref={el => windowRefs.current[id] = el}
          className={`windows-dialog ${hasAppeared ? 'appeared' : ''}`}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: isDragging ? 1002 : 1000 - id,
            pointerEvents: 'all',
            opacity: isDragging ? 0.9 : 1,
            willChange: isDragging ? 'left, top' : 'auto'
          }}
        >
          <div
            className="window-title-bar"
            onMouseDown={(e) => handleMouseDown(id, e)}
            style={{ cursor: isDragging ? 'move' : 'grab' }}
          >
            <div className="window-title">{title}</div>
            <div className="window-controls">
              <button className="window-button minimize">_</button>
              <button className="window-button maximize">□</button>
              <button
                className="window-button close"
                onClick={() => handleClose(id)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="window-content">
            {children}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <WindowDialog id={1} title="LED Keyswitches" show={showLines1}>
        <div className="feature-item">
          <p>LED powered, high profile keyswitches. Instantly trigger clips, effects, and strobes with precision. Fully mappable, fully VJ-ready.</p>
        </div>
      </WindowDialog>

      <WindowDialog id={2} title="Live Control" show={showLines2}>
        <div className="feature-item">
          <p>Control key parameters like opacity, brightness, and playback speed. Smooth, responsive, and perfect for live tweaking.</p>
        </div>
      </WindowDialog>

      <WindowDialog id={3} title="Visual Effects" show={showLines3}>
        <div className="feature-item">
          <p>Quickly adjust hue, zoom, and blur without diving into software menus. Subtle or wild, your visuals, your vibe.</p>
        </div>
      </WindowDialog>

      <WindowDialog id={4} title="3D Movement" show={showLines4}>
        <div className="feature-item">
          <p>Total control over 3D movement. Rotate, spin, shift position, and change FOV! All in real time.</p>
        </div>
      </WindowDialog>

      <WindowDialog id={5} title="Seamless Control" show={showLines5}>
        <div className="feature-item">
          <p>Navigate your laptop without lifting a hand. Stay locked into the controller and run your whole set from one spot.</p>
        </div>
      </WindowDialog>

      <style jsx>{`
        .windows-dialog {
          background-color: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          box-shadow:
            inset -1px -1px 0 #000000,
            inset 1px 1px 0 #dfdfdf,
            2px 2px 8px rgba(0,0,0,0.3);
          font-family: "MS Sans Serif", "Segoe UI", Tahoma, sans-serif;
          min-width: 400px;
          max-width: 450px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .dotted-outline {
          border: 2px dotted #000000;
          background: transparent;
          animation: dottedBlink 0.5s linear infinite;
        }

        @keyframes dottedBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }

        @keyframes windowAppear {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .windows-dialog.appeared {
          animation: windowAppear 0.3s ease-out;
        }

        .window-title-bar {
          background: linear-gradient(90deg, #000080 0%, #0000ff 100%);
          color: white;
          padding: 3px 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 22px;
          font-size: 13px;
          font-weight: bold;
          border-bottom: 1px solid #000000;
        }

        .window-title {
          padding-left: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          pointer-events: none;
        }

        .window-controls {
          display: flex;
          gap: 2px;
        }

        .window-button {
          width: 18px;
          height: 16px;
          background-color: #c0c0c0;
          border: 1px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          font-size: 10px;
          line-height: 12px;
          text-align: center;
          color: #000000;
          cursor: pointer;
          font-family: "MS Sans Serif", sans-serif;
          font-weight: bold;
          padding: 0;
        }

        .window-button:hover {
          background-color: #d0d0d0;
        }

        .window-button:active {
          border-color: #808080 #ffffff #ffffff #808080;
          box-shadow: inset 1px 1px 0 #000000;
        }

        .window-button.close:hover {
          background-color: #ff6b6b;
          color: white;
        }

        .window-content {
          padding: 16px;
          background-color: #c0c0c0;
          font-size: 14px;
          line-height: 1.5;
        }

        .feature-item { margin: 0; padding: 0; }
        .feature-item p { margin: 0; color: #000000; line-height: 1.4; }

        @media screen and (max-width: 968px) {
          .windows-dialog { min-width: 320px; max-width: 360px; }
          .window-content { padding: 12px; font-size: 12px; }
          .window-title-bar { font-size: 12px; height: 20px; }
        }

        @media screen and (max-width: 500px) {
          .windows-dialog { min-width: 280px; max-width: 320px; font-size: 11px; }
          .window-content { padding: 10px; font-size: 11px; }
          .window-title-bar { font-size: 11px; height: 18px; }
          .window-button { width: 16px; height: 14px; font-size: 8px; }
        }
      `}</style>
    </>
  );
}

export default ModelLines;
