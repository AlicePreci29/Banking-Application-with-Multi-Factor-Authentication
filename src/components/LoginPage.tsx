import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Shield, Lock, User, Hash, Phone } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

interface LoginPageProps {
  onLogin: (success: boolean) => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pin: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP handling
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Setup reCAPTCHA for Firebase Phone Auth
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-login', {
        size: 'invisible',
      });
    }
  };

  // Send OTP
  const sendOTP = async () => {
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      setOtpSent(true);
      alert('OTP sent to ' + formData.phone);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      const confirmationResult = (window as any).confirmationResult;
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      alert('Phone number verified');
    } catch (error: any) {
      console.error(error);
      alert('Invalid OTP');
    }
  };

  // Handle Login Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pin.length !== 6) {
      alert('PIN must be exactly 6 digits');
      return;
    }
    if (!otpVerified) {
      alert('Please verify your phone number with OTP');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setIsLoading(false);

      // TODO: validate PIN with backend DB
      onLogin(true);
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle>SecureBank Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Phone for OTP */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10"
                  placeholder="Enter Ph.No"
                  required
                />
              </div>
              <Button type="button" variant="outline" className="mt-2 w-full" onClick={sendOTP} disabled={otpSent}>
                {otpSent ? 'OTP Sent' : 'Send OTP'}
              </Button>

              {otpSent && (
                <div className="flex space-x-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={verifyOTP} disabled={!otp}>
                    Verify OTP
                  </Button>
                </div>
              )}
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin">6-Digit PIN</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="pin"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.pin}
                  onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  className="pl-10 tracking-widest text-center"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              {formData.pin && formData.pin.length < 6 && (
                <p className="text-sm text-red-600">PIN must be exactly 6 digits</p>
              )}
              {formData.pin.length === 6 && (
                <p className="text-sm text-green-600">✓ Valid PIN format</p>
              )}
            </div>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container-login"></div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading || !otpVerified}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center">Don't have an account? 
              <Button type="button" variant="link" onClick={onSwitchToSignup} className="text-sm">
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
