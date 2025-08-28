import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginCard = ({ children }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Login Card */}
      <div className="bg-card border border-border rounded-2xl shadow-elevated p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-2xl font-bold text-primary-foreground">C</span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to CSMSS ECE Portal
          </p>
        </div>

        {/* Form Content */}
        {children}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            CSMSS Chh. Shahu College of Engineering
          </p>
          <p className="text-xs text-muted-foreground">
            Electronics & Communication Engineering
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>24/7 Access</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>Multi-Role Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;