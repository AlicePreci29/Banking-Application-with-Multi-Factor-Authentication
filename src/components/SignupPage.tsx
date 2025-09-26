import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Shield, Lock, User, CheckCircle, XCircle, Hash, Phone } from 'lucide-react';
import { Captcha } from './Captcha';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

interface SignupPageProps {
  onSignup: (success: boolean) => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    pin: '',
    confirmPin: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [letterCaptchaVerified, setLetterCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const pinsMatch = formData.pin === formData.confirmPin && formData.pin.length === 6;
  const isPasswordStrong = formData.password.length >= 8;

  // Setup reCAPTCHA verifier
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  // Send OTP to phone
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

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!letterCaptchaVerified) return alert('Please complete the human verification');
    if (!passwordsMatch) return alert('Passwords do not match');
    if (!pinsMatch) return alert('PIN codes do not match');
    if (!isPasswordStrong) return alert('Password must be at least 8 characters long');
    if (formData.pin.length !== 6) return alert('PIN must be exactly 6 digits');
    if (!otpVerified) return alert('Please verify your phone number with OTP');

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setIsLoading(false);

      // TODO: Save PIN + phone to your backend DB here via API call
      onSignup(true);
      alert('Account created successfully');
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle>Create SecureBank Account</CardTitle>
          <CardDescription>
            Sign up with Email, Password, Phone & PIN
          </CardDescription>
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
                  placeholder="Create a strong password (min 8 chars)"
                  required
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && (
                <div className="flex items-center space-x-1 text-sm">
                  {isPasswordStrong ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className={isPasswordStrong ? 'text-green-600' : 'text-red-600'}>
                    {isPasswordStrong ? 'Strong password' : 'Password too short'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center space-x-1 text-sm">
                  {passwordsMatch ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className={passwordsMatch ? 'text-green-600' : 'text-red-600'}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Phone Number */}
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
                  placeholder="+91 9876543210"
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
              <Label htmlFor="pin">Set 6-Digit PIN</Label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.pin}
                onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className="tracking-widest text-center"
                placeholder="000000"
                required
              />
              <Label htmlFor="confirmPin">Confirm 6-Digit PIN</Label>
              <Input
                id="confirmPin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.confirmPin}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className="tracking-widest text-center"
                placeholder="000000"
                required
              />
            </div>

            {/* Captcha */}
            <Captcha type="letters" onVerify={setLetterCaptchaVerified} />

            {/* reCAPTCHA container (Firebase needs this) */}
            <div id="recaptcha-container"></div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading || !otpVerified}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center">Already have an account? 
              <Button type="button" variant="link" onClick={onSwitchToLogin} className="text-sm">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
