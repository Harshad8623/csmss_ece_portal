import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-500" />
      
      {/* Circuit Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-primary"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="2" />
          <circle cx="150" cy="50" r="2" />
          <circle cx="50" cy="150" r="2" />
          <circle cx="150" cy="150" r="2" />
          <path d="M50 50 L150 50 M50 150 L150 150 M50 50 L50 150 M150 50 L150 150" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" />
          <rect x="90" y="40" width="20" height="20" rx="2" />
          <rect x="90" y="140" width="20" height="20" rx="2" />
          <rect x="40" y="90" width="20" height="20" rx="2" />
          <rect x="140" y="90" width="20" height="20" rx="2" />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundPattern;