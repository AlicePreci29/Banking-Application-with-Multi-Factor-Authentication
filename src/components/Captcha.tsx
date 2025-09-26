import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  type?: 'letters' | 'recaptcha';
}

export function Captcha({ onVerify, type = 'letters' }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);

  const generateLetterCaptcha = () => {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const allLetters = upperCaseLetters + lowerCaseLetters;
    
    const length = Math.floor(Math.random() * 2) + 5; // Random length between 5-6
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += allLetters.charAt(Math.floor(Math.random() * allLetters.length));
    }
    
    setCaptchaText(result);
    setUserAnswer('');
    setIsVerified(false);
    setHasAttemptedVerification(false);
    onVerify(false);
  };

  useEffect(() => {
    if (type === 'letters') {
      generateLetterCaptcha();
    }
  }, [type]);

  const handleLetterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, ''); // Remove non-letters
    setUserAnswer(value);
    
    // Reset verification state when user starts typing again
    if (hasAttemptedVerification) {
      setIsVerified(false);
      setHasAttemptedVerification(false);
      onVerify(false);
    }
  };

  const handleLetterVerify = () => {
    setHasAttemptedVerification(true);
    const verified = userAnswer.trim() === captchaText;
    setIsVerified(verified);
    onVerify(verified);
  };

  const handleRecaptchaChange = (checked: boolean) => {
    setRecaptchaChecked(checked);
    setIsVerified(checked);
    onVerify(checked);
  };

  // Allow Enter key to trigger verification
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLetterVerify();
    }
  };

  if (type === 'recaptcha') {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="recaptcha"
            checked={recaptchaChecked}
            onCheckedChange={handleRecaptchaChange}
          />
          <Label htmlFor="recaptcha">I'm not a robot</Label>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          reCAPTCHA (Demo UI Only)
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>Human Verification</Label>
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 p-3 rounded border font-mono text-lg tracking-wider select-none">
          {captchaText}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateLetterCaptcha}
          title="Generate new captcha"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={userAnswer}
          onChange={handleLetterInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter letters exactly"
          className="w-32 font-mono tracking-wider"
          maxLength={6}
        />
        <Button 
          type="button" 
          onClick={handleLetterVerify} 
          size="sm"
          disabled={!userAnswer.trim()}
        >
          Verify
        </Button>
      </div>
      <div className="text-xs text-gray-500">
        Enter the letters exactly as shown (case sensitive)
      </div>
      
      {/* Success message */}
      {isVerified && (
        <div className="text-green-600 text-sm flex items-center">
          <span className="mr-1">✓</span>
          Verification successful
        </div>
      )}
      
      {/* Error message - only show after verification attempt */}
      {hasAttemptedVerification && !isVerified && userAnswer.trim() && (
        <div className="text-red-600 text-sm flex items-center">
          <span className="mr-1">✗</span>
          Incorrect, please try again. Expected: "{captchaText}"
        </div>
      )}
      
      {/* Hint when user hasn't entered anything */}
      {hasAttemptedVerification && !userAnswer.trim() && (
        <div className="text-amber-600 text-sm flex items-center">
          <span className="mr-1">⚠</span>
          Please enter the letters shown above
        </div>
      )}
    </div>
  );
}