import React, { useState } from 'react';
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
    {/* Abstract Background Elements */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]" />
    </div>

    {/* Floating Cards */}
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

    {/* Main Content */}
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isShake, setIsShake] = useState(false);

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Optional: Handle rememberMe logic here if saving email locally
      navigate('/');
    } catch (error) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950">
      <AuthLeftPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className={`w-full max-w-md animate-fade-up ${isShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          <div className="lg:hidden w-12 h-12 bg-gradient-to-br from-indigo-500 to-primary-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8 font-medium">Log in to continue your preparation</p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label 
                htmlFor="email" 
                className="absolute left-4 top-4 text-gray-400 text-xs font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text"
              >
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
              <label 
                htmlFor="password" 
                className="absolute left-4 top-4 text-gray-400 text-xs font-semibold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-600 cursor-text"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded focus-within:border-indigo-500 group-hover:border-indigo-500 transition-colors bg-white">
                  <input 
                    type="checkbox" 
                    className="opacity-0 absolute inset-0 cursor-pointer peer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <CheckCircle2 className={`w-4 h-4 text-indigo-600 pointer-events-none transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className="text-sm font-medium text-gray-600 select-none">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-primary-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In'}
            </button>

            <p className="text-center text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
