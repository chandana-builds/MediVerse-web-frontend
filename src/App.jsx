import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { authService } from './services/api';
import Home from './pages/Home';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'patient' });
  const [registerData, setRegisterData] = useState({
    name: '', email: '', age: '', phone: '',
    address: '', username: '', password: '', role: 'patient'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mediverse_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setView('dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For MVP, we use the same login endpoint, but real apps might differ by role
      const res = await authService.loginPatient(credentials);
      if (res.success) {
        setUser({ ...res.user, role: credentials.role }); // Store role in user object
        localStorage.setItem('mediverse_user', JSON.stringify({ ...res.user, role: credentials.role }));
        setView('dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.registerPatient(registerData);
      if (res.success) {
        alert('Registration Successful! Please login.');
        setView('login');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediverse_user');
    setView('login');
  };

  if (view === 'dashboard' && user) {
    return <Home user={user} setUser={setUser} logout={logout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white font-sans text-[#333333]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 w-full max-w-2xl shadow-xl rounded-[16px] border border-slate-200"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#1e88e5]/10 p-4 rounded-full">
            <Heart className="text-[#1e88e5] w-12 h-12" fill="currentColor" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-[#333333]">MediVerse</h2>
        <p className="text-slate-500 text-center mb-8">Professional Healthcare Ecosystem</p>

        <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-6">

          {/* Role Selection Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 p-1 rounded-[12px] flex">
              {['patient', 'doctor'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => view === 'login'
                    ? setCredentials({ ...credentials, role })
                    : setRegisterData({ ...registerData, role })
                  }
                  className={`px-6 py-2 rounded-[10px] text-sm font-bold capitalize transition-all ${(view === 'login' ? credentials.role : registerData.role) === role
                      ? 'bg-white text-[#1e88e5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {view === 'register' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strict 2-Column Grid */}
              <input
                className="input-field"
                placeholder="Full Name"
                required
                onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              />
              <input
                className="input-field"
                type="email"
                placeholder="Email Address"
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              />

              <input
                className="input-field"
                placeholder="Age"
                type="number"
                required
                onChange={e => setRegisterData({ ...registerData, age: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Phone Number"
                required
                onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
              />

              <input
                className="input-field"
                placeholder="Address"
                required
                onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Username"
                required
                onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
              />

              <input
                className="input-field md:col-span-2"
                type="password"
                placeholder="Create Password"
                required
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
          )}

          {view === 'login' && (
            <div className="space-y-4">
              <input
                className="input-field w-full"
                placeholder="Username"
                required
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
              />
              <input
                className="input-field w-full"
                type="password"
                placeholder="Password"
                required
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          )}

          <button className="w-full py-4 bg-[#1e88e5] hover:bg-blue-600 text-white rounded-[16px] font-bold text-lg shadow-md transition-all active:scale-95" disabled={loading}>
            {loading ? 'Processing...' : (view === 'login' ? 'Authenticate' : 'Join MediVerse')}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500">
          {view === 'login' ? "New to MediVerse? " : "Already registered? "}
          <span
            className="text-[#1e88e5] cursor-pointer font-semibold hover:underline"
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
          >
            {view === 'login' ? "Create Account" : "Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default App;
