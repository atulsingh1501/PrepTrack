import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Zap, Code2, Target, CheckCircle2 } from 'lucide-react';

const FloatingCard = ({ icon: Icon, text, delay, color }) => (
  <div 
    className={`absolute bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-float ${delay} whitespace-nowrap z-20`}
  >
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-5 h-5 text-white shrink-0" />
    </div>
    <span className="text-white font-medium text-sm">{text}</span>
  </div>
);

const AuthLeftPanel = () => (
  <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-dark-950 via-indigo-950 to-primary-900 overflow-hidden items-center justify-center p-12">
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]" />
    </div>

    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-24 left-10">
        <FloatingCard icon={Code2} text="2,340 problems solved today" delay="animation-delay-2000" color="bg-emerald-500/80" />
      </div>
      <div className="absolute top-1/3 right-10">
        <FloatingCard icon={Target} text="1,500+ offers tracked" delay="animation-delay-4000" color="bg-amber-500/80" />
      </div>
      <div className="absolute bottom-32 left-16">
        <FloatingCard icon={CheckCircle2} text="98% interview readiness" delay="" color="bg-primary-500/80" />
      </div>
    </div>

    <div className="relative z-10 text-center max-w-md">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-primary-500 rounded-2xl flex items-center justify-center mb-8 shadow-glow-indigo">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-black text-white mb-4 leading-tight">
        Track your prep.<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-primary-400">
          Own your placement.
        </span>
      </h1>
      <p className="text-indigo-200 text-lg">
        The all-in-one companion for campus placements, LeetCode tracking, and mock interviews.
      </p>
    </div>
  </div>
);

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [pwdStrength, setPwdStrength] = useState(0);

  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Password strength logic
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 1;
    if (password.length === 0) strength = 0;
    setPwdStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return;
    }
    if (!termsAccepted) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  const strengthColors = ['bg-gray-200', 'bg-rose-500', 'bg-amber-400', 'bg-emerald-500'];
  const strengthLabels = ['Too weak', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="min-h-screen flex bg-dark-950">
      <AuthLeftPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className={`w-full max-w-md animate-fade-up ${isShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          <div className="lg:hidden w-12 h-12 bg-gradient-to-br from-indigo-500 to-primary-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-8 font-medium">Join PrepTrack to boost your career</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl bg-transparent text-gray-900 placeholder-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Full Name"
              />
              <label htmlFor="name" className="absolute left-4 top-4 text-gray-400 text-xs font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text">
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl bg-transparent text-gray-900 placeholder-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Email Address"
              />
              <label htmlFor="email" className="absolute left-4 top-4 text-gray-400 text-xs font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text">
                Email Address
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl bg-transparent text-gray-900 placeholder-transparent focus:border-indigo-500 focus:outline-none transition-colors pr-12"
                placeholder="Password"
              />
              <label htmlFor="password" className="absolute left-4 top-4 text-gray-400 text-xs font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                    <div className={`h-full flex-1 ${pwdStrength >= 1 ? strengthColors[pwdStrength] : 'bg-gray-200'} transition-all`} />
                    <div className={`h-full flex-1 ${pwdStrength >= 2 ? strengthColors[pwdStrength] : 'bg-gray-200'} transition-all`} />
                    <div className={`h-full flex-1 ${pwdStrength >= 3 ? strengthColors[pwdStrength] : 'bg-gray-200'} transition-all`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${pwdStrength >= 3 ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {strengthLabels[pwdStrength]}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`peer w-full px-4 pt-6 pb-2 border-2 rounded-xl bg-transparent text-gray-900 placeholder-transparent focus:outline-none transition-colors pr-12 ${confirmPassword && confirmPassword !== password ? 'border-rose-500 focus:border-rose-500' : 'border-gray-200 focus:border-indigo-500'}`}
                placeholder="Confirm Password"
              />
              <label htmlFor="confirmPassword" className={`absolute left-4 top-4 text-xs font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs cursor-text ${confirmPassword && confirmPassword !== password ? 'text-rose-500' : 'text-gray-400 peer-focus:text-indigo-600'}`}>
                Confirm Password
              </label>
              {confirmPassword && confirmPassword !== password && (
                 <p className="text-xs text-rose-500 mt-1 font-medium">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-2">
              <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 border-2 border-gray-300 rounded focus-within:border-indigo-500 group-hover:border-indigo-500 transition-colors bg-white shrink-0">
                <input 
                  type="checkbox" 
                  className="opacity-0 absolute inset-0 cursor-pointer peer"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <CheckCircle2 className={`w-4 h-4 text-indigo-600 pointer-events-none transition-opacity ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="text-sm font-medium text-gray-600 leading-tight">
                I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !termsAccepted || (password !== confirmPassword && confirmPassword !== '')}
              className="w-full mt-2 flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-primary-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
            </button>

            <p className="text-center text-gray-600 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors">
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
