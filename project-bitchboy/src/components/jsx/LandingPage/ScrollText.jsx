import { useState, useEffect } from 'react';

function ScrollText() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      
      // Show text during sectionIntro (0.20-0.35)
      if (scrollProgress >= 0.05 && scrollProgress <= 0.20) {
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
      transform: `translate(-50%, -50%) ${showText ? 'scale(1)' : 'scale(0.95)'}`,
      transition: 'opacity 0.4s ease, transform 0.4s ease'
    }}>
      <h2 className="scroll-text-title">What's a BitchBoy?</h2>
      <p className="scroll-text-content">
        BitchBoy is a MIDI controller designed for VJs by VJs. Unlike other MIDI controllers 
        the BitchBoy is designed with VJing in mind, making it the ideal device for software 
        like Resolume Arena/Avenue and Touchdesigner. Whether you're a beginner or an 
        intermediate VJ, BitchBoy gives you what you need to make your shows ballin'.
      </p>
    </div>
  );
}

export default ScrollText;