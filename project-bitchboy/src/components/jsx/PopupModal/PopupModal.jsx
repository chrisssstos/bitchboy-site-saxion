import React, { useState } from "react";

function PopupModal({ className, setShowModal }) {
  const [email, setEmail] = useState("");
  const closeModal = () => setShowModal(false);
  
  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Simulated submission since we can't use Firebase in artifacts
      console.log("Email submitted:", email);
      alert("Thank you for subscribing!");
      setEmail("");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving email:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
          cursor: 'pointer',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)'
        }}
      />
      
      {/* Modal Container - Centers the modal */}
      <div 
        className={className}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
        }}
      >
        <div 
          style={{
            position: 'relative',
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf, 4px 4px 10px rgba(0, 0, 0, 0.5)',
            minWidth: '200px',
            fontFamily: '"MS Sans Serif", "Segoe UI", Tahoma, sans-serif',
            borderRadius: '0px'
          }}
        >
          {/* Title Bar */}
          <div 
            style={{
              position: 'relative',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 2px',
              background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)'
            }}
          >
            <span style={{
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '0 8px',
              userSelect: 'none'
            }}>
              SYSTEM.EXE - Subscribe to Newsletter
            </span>
            
            {/* Window Controls */}
            <div style={{ display: 'flex' }}>
              {/* Minimize */}
              <button 
                style={{
                  width: '20px',
                  height: '20px',
                  margin: '0 2px',
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  padding: 0,
                  lineHeight: 1
                }}
                onClick={(e) => e.preventDefault()}
              >
                _
              </button>
              
              {/* Maximize */}
              <button 
                style={{
                  width: '20px',
                  height: '20px',
                  margin: '0 2px',
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  padding: 0,
                  lineHeight: 1
                }}
                onClick={(e) => e.preventDefault()}
              >
                □
              </button>
              
              {/* Close */}
              <button 
                style={{
                  width: '20px',
                  height: '20px',
                  margin: '0 2px',
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  padding: 0,
                  lineHeight: 1
                }}
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div style={{ padding: '24px' }}>
            {/* Icon and Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  marginRight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  background: '#000',
                  color: '#00ff00',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  boxShadow: 'inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #000000',
                  borderRadius: '0px'
                }}
              >
                @
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  color: '#000000',
                  textAlign: 'left'
                }}>
                  JOIN US
                </h2>
                <p style={{ 
                  fontSize: '14px',
                  color: '#000000',
                  textAlign: 'left'
                }}>
                  Subscribe to our newsletter for the latest updates.
                </p>
              </div>
            </div>
            
            {/* Input Group */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                marginBottom: '8px',
                color: '#000000',
                textAlign: 'left'
              }}>
                Email Address:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    backgroundColor: 'white',
                    border: '2px solid',
                    borderColor: '#808080 #ffffff #ffffff #808080',
                    boxShadow: 'inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #000000',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    borderRadius: '0px',
                    outline: 'none',
                    color: '#000000'
                  }}
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                {/* Cyberpunk accent */}
                <div 
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                    color: '#00ff00',
                    textShadow: '0 0 5px #00ff00'
                  }}
                >
                  ►
                </div>
              </div>
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                style={{
                  padding: '4px 24px',
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  color: '#000000'
                }}
                onClick={handleSubmit}
                onMouseDown={(e) => {
                  e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
                  e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #000000';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf';
                }}
              >
                OK
              </button>
              
              <button
                style={{
                  padding: '4px 24px',
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  color: '#000000'
                }}
                onClick={closeModal}
                onMouseDown={(e) => {
                  e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
                  e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #dfdfdf, inset 1px 1px 0 #000000';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
                  e.currentTarget.style.boxShadow = 'inset -1px -1px 0 #000000, inset 1px 1px 0 #dfdfdf';
                }}
              >
                Cancel
              </button>
            </div>
            
            {/* Status Bar */}
            <div 
              style={{
                margin: '16px -24px -24px -24px',
                padding: '4px 8px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                background: '#c0c0c0',
                borderTop: '1px solid #ffffff',
                color: '#000000'
              }}
            >
              <div 
                style={{
                  flex: 1,
                  marginRight: '8px',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  padding: '2px 4px'
                }}
              >
                Ready
              </div>
              <div 
                style={{
                  fontSize: '12px',
                  color: 'rgb(0, 221, 0)',
                  textShadow: '0 0 3pxrgb(0, 177, 0)'
                }}
              >
                SECURE CONNECTION
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PopupModal;