import React from 'react';
import { cn } from "@/lib/utils";

interface StardustButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function StardustButton({ 
  children = "Get Started", 
  onClick, 
  className = "",
  ...props 
}: StardustButtonProps) {
  // Navbar için özel olarak küçültülmüş boyutlar
  const buttonStyle = {
    '--white': '#e6f3ff',
    '--bg': '#0a1929',
    '--radius': '100px',
    outline: 'none',
    cursor: 'pointer',
    border: 0,
    position: 'relative',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bg)',
    transition: 'all 0.2s ease',
    boxShadow: `
      inset 0 0.15rem 0.4rem rgba(255, 255, 255, 0.3),
      inset 0 -0.05rem 0.15rem rgba(0, 0, 0, 0.7),
      inset 0 -0.2rem 0.4rem rgba(255, 255, 255, 0.5),
      0 1.5rem 1.5rem rgba(0, 0, 0, 0.3),
      0 0.5rem 0.5rem -0.3rem rgba(0, 0, 0, 0.8)
    `,
  } as React.CSSProperties;

  const wrapStyle = {
    fontSize: '14px', // 25px'den Navbar uyumlu boyuta çekildi
    fontWeight: 600,
    color: 'rgba(129, 216, 255, 0.9)',
    padding: '10px 24px', // 32x45'ten zarif boyuta çekildi
    borderRadius: 'inherit',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties;

  const pStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    transition: 'all 0.2s ease',
    transform: 'translateY(2%)',
    maskImage: 'linear-gradient(to bottom, rgba(129, 216, 255, 1) 40%, transparent)',
  } as React.CSSProperties;

  const beforeAfterStyles = `
    .pearl-button .wrap::before,
    .pearl-button .wrap::after {
      content: "";
      position: absolute;
      transition: all 0.3s ease;
    }
    
    .pearl-button .wrap::before {
      left: -15%;
      right: -15%;
      bottom: 25%;
      top: -100%;
      border-radius: 50%;
      background-color: rgba(64, 180, 255, 0.15);
    }
    
    .pearl-button .wrap::after {
      left: 6%;
      right: 6%;
      top: 12%;
      bottom: 40%;
      border-radius: 22px 22px 0 0;
      box-shadow: inset 0 10px 8px -10px rgba(129, 216, 255, 0.6);
      background: linear-gradient(
        180deg,
        rgba(64, 180, 255, 0.25) 0%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0) 100%
      );
    }
    
    .pearl-button .wrap p span:nth-child(2) {
      display: none;
    }
    
    .pearl-button:hover .wrap p span:nth-child(1) {
      display: none;
    }
    
    .pearl-button:hover .wrap p span:nth-child(2) {
      display: inline-block;
    }
    
    .pearl-button:hover {
      box-shadow:
        inset 0 0.15rem 0.25rem rgba(129, 216, 255, 0.4),
        inset 0 -0.05rem 0.15rem rgba(0, 0, 0, 0.7),
        inset 0 -0.2rem 0.4rem rgba(64, 180, 255, 0.6),
        0 1.5rem 1.5rem rgba(0, 0, 0, 0.3),
        0 0.5rem 0.5rem -0.3rem rgba(0, 0, 0, 0.8);
    }
    
    .pearl-button:hover .wrap::before {
      transform: translateY(-5%);
    }
    
    .pearl-button:hover .wrap::after {
      opacity: 0.4;
      transform: translateY(5%);
    }
    
    .pearl-button:hover .wrap p {
      transform: translateY(-4%);
    }
    
    .pearl-button:active {
      transform: translateY(2px);
      box-shadow:
        inset 0 0.15rem 0.25rem rgba(129, 216, 255, 0.5),
        inset 0 -0.05rem 0.15rem rgba(0, 0, 0, 0.8),
        inset 0 -0.2rem 0.4rem rgba(64, 180, 255, 0.4),
        0 1.5rem 1.5rem rgba(0, 0, 0, 0.3),
        0 0.5rem 0.5rem -0.3rem rgba(0, 0, 0, 0.8);
    }
  `;

  return (
    <>
      <style>{beforeAfterStyles}</style>
      <button
        className={cn("pearl-button", className)}
        style={buttonStyle}
        onClick={onClick}
        {...props}
      >
        <div className="wrap" style={wrapStyle}>
          <p style={pStyle}>
            <span>✧</span>
            <span>✦</span>
            {children}
          </p>
        </div>
      </button>
    </>
  );
};