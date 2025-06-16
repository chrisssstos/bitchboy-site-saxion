import { useState, useEffect } from 'react';

function ScrollText() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);

      // Show text during sectionIntro (0.20-0.35)
      if (scrollProgress >= 0.1 && scrollProgress <= 0.20) {
        setShowText(true);
      } else {
        setShowText(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="scroll-text-section" style={{ 
      opacity: showText ? 1 : 0,
      transform: `translate(-50%, -50%) ${showText ? 'translateX(0) scale(1)' : 'translateX(300px) scale(1)'}`,
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      zIndex: 1,
      margin: '150px auto 0',
      backdropFilter: 'blur(5px)',
      borderRadius: '10px',
      padding: '20px',
    }}>
      <h2 className="scroll-text-title">What's a BitchBoy?</h2>
      <p className="scroll-text-content">
        BitchBoy is a MIDI controller designed for VJs by VJs. Unlike other MIDI controllers 
        the BitchBoy is designed with VJing in mind, making it the ideal device for software 
        like Resolume Arena/Avenue and Touchdesigner. Whether you're a beginner or an 
        intermediate VJ, BitchBoy gives you what you need to make your shows ballin'.
      </p>

      <img
        src="/images/softwarelogos.png"
        alt="softwarelogos"
        className="softwarelogos-img"
        style={{
          display: 'block',
          margin: '100px auto 0',
          width: '250px',
          height: 'auto',
          opacity: showText ? 1 : 0,
          transition: 'opacity 0.4s ease',
          transform: 'none',
        }}
      />
    </div>
  );
}

export default ScrollText;