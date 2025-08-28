import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = ({ onLogin, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.username?.trim()) {
      newErrors.username = 'Username is required';
    } else {
      // Validate PRN format (23025331844001-23025331844075) or Teacher ID (T0001-T0005)
      const prnPattern = /^23025331844(0[0-6][0-9]|07[0-5])$/;
      const teacherPattern = /^T000[1-5]$/;
      
      if (!prnPattern?.test(formData?.username) && !teacherPattern?.test(formData?.username)) {
        newErrors.username = 'Invalid format. Use PRN (23025331844001-075) or Teacher ID (T0001-T0005)';
      }
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onLogin(formData);
    } catch (error) {
      setErrors({
        submit: error?.message || 'Login failed. Please try again.'
      });
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // In a real app, this would navigate to password reset
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <div>
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Enter PRN or Teacher ID"
          value={formData?.username}
          onChange={handleInputChange}
          error={errors?.username}
          required
          className="w-full"
        />
      </div>
      {/* Password Field */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          className="w-full pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      {/* Submit Error */}
      {errors?.submit && (
        <div className="flex items-center space-x-2 text-error text-sm bg-error/10 p-3 rounded-lg">
          <Icon name="AlertCircle" size={16} />
          <span>{errors?.submit}</span>
        </div>
      )}
      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        loading={isLoading}
        fullWidth
        className="h-12 text-base font-semibold"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      {/* Forgot Password Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium"
        >
          Forgot your password?
        </button>
      </div>
      {/* Help Text */}
      <div className="text-center space-y-2 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Students:</strong> Use PRN (23025331844001-075)
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Faculty:</strong> Use Teacher ID (T0001-T0005)
        </p>
        <p className="text-xs text-muted-foreground">
          Default password: <span className="font-mono bg-muted px-1 rounded">Pass@123</span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;