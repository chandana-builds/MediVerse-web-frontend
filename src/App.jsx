import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { authService } from './services/api';
import Home from './pages/Home';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', age: '', phone: '', address: '', username: '', password: '' });
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
      const res = await authService.loginPatient(credentials);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('mediverse_user', JSON.stringify(res.user));
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 w-full max-w-md shadow-xl rounded-2xl border border-slate-100"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600/10 p-4 rounded-3xl">
            <Heart className="text-[#1e88e5] w-12 h-12" fill="currentColor" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">MediVerse</h2>
        <p className="text-slate-500 text-center mb-8">Professional Healthcare Ecosystem</p>

        <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {view === 'register' && (
            <>
              <input
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
                placeholder="Full Name"
                required
                onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              />
              <div className="grid grid-cols-5 gap-4">
                <input
                  className="col-span-2 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
                  placeholder="Age"
                  type="number"
                  required
                  onChange={e => setRegisterData({ ...registerData, age: e.target.value })}
                />
                <input
                  className="col-span-3 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
                  placeholder="Phone"
                  required
                  onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                />
              </div>
              <input
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
                placeholder="Address"
                required
                onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
              />
            </>
          )}
          <input
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
            placeholder="Username"
            required
            onChange={e => view === 'login'
              ? setCredentials({ ...credentials, username: e.target.value })
              : setRegisterData({ ...registerData, username: e.target.value })
            }
          />
          <input
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
            type="password"
            placeholder="Password"
            required
            onChange={e => view === 'login'
              ? setCredentials({ ...credentials, password: e.target.value })
              : setRegisterData({ ...registerData, password: e.target.value })
            }
          />
          <button className="w-full py-4 bg-[#1e88e5] hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95" disabled={loading}>
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
