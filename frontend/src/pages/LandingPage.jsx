import { Link } from 'react-router-dom';
import { Globe, MapPin, Users, Star, ArrowRight, Compass, Shield, Zap } from 'lucide-react';

const BG_VIDEO = 'https://videos.pexels.com/video-files/1851190/1851190-uhd_2560_1440_25fps.mp4';

const stats = [
  { icon: MapPin, label: 'Destinations', value: '500+' },
  { icon: Users, label: 'Travelers', value: '10K+' },
  { icon: Star, label: 'Reviews', value: '50K+' },
];

const features = [
  { icon: Compass, title: 'Smart Itineraries', desc: 'AI-powered day-wise trip planning' },
  { icon: Shield, title: 'Verified Guides', desc: 'Trusted local experts at your service' },
  { icon: Zap, title: 'Offline Access', desc: 'Your plans, even without internet' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Live video background */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={BG_VIDEO} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Traveloop</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"
            className="px-5 py-2 text-white font-semibold border border-white/40 rounded-xl hover:bg-white/10 transition-all text-sm">
            Sign In
          </Link>
          <Link to="/register"
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/30">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Smart Travel Planning Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Travel Smarter<br />
          <span className="text-emerald-400">with Traveloop</span>
        </h1>

        <p className="text-white/75 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Plan multi-city itineraries, discover hidden gems, collaborate with friends,
          and explore the world — all in one intelligent platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/register"
            className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-emerald-500/40 text-base hover:-translate-y-0.5">
            Start Planning Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login"
            className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl transition-all text-base hover:-translate-y-0.5">
            Sign In to Continue
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-white text-2xl font-bold">{value}</span>
              <span className="text-white/60 text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left hover:bg-white/15 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-white/60 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="relative z-10 text-center pb-6">
        <p className="text-white/40 text-xs">© 2025 Traveloop · Built for explorers</p>
      </div>
    </div>
  );
}
