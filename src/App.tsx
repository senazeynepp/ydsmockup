/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

import welcomeScreenImg from "./assets/welcome_screen.png";
import logoWelcomeImg from "./assets/logo_welcome.png";
import logoOnboardingImg from "./assets/logo_onboarding.png";
import logoImg from "./assets/logo.png";
import avatar1 from "./assets/avatar_1.png";
import avatar2 from "./assets/avatar_2.png";
import avatar3 from "./assets/avatar_3.png";
import avatar4 from "./assets/avatar_4.png";
import avatar5 from "./assets/avatar_5.png";
import avatar6 from "./assets/avatar_6.png";
import avatar7 from "./assets/avatar_7.png";

const AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "signup" | "login" | "onboarding_goal" | "onboarding_info" | "onboarding_avatar" | "onboarding_diagnostic" | "onboarding_test" | "onboarding_result" | "onboarding_academic_goals" | "dashboard" | "profile" | "lessons" | "active_test" | "test_result" | "ai_yds">("welcome");
  const [profileTab, setProfileTab] = useState("Profil");
  const [testResult, setTestResult] = useState<{ score: number; level: string } | null>(null);
  const [userGoal, setUserGoal] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Mobile Device Mockup Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto border-[8px] border-zinc-900 rounded-[3rem] h-[720px] w-[340px] shadow-2xl overflow-hidden bg-white"
      >
        <AnimatePresence mode="wait">
          {currentScreen === "welcome" && (
            <WelcomeScreen 
              onGetStarted={() => setCurrentScreen("dashboard")} 
              onSignIn={() => setCurrentScreen("login")} 
            />
          )}
          {currentScreen === "signup" && (
            <SignUpScreen 
              onBack={() => setCurrentScreen("welcome")} 
              onLogin={() => setCurrentScreen("login")}
            />
          )}
          {currentScreen === "login" && (
            <LoginScreen 
              onBack={() => setCurrentScreen("welcome")} 
              onSignUp={() => setCurrentScreen("signup")}
              onLoginSuccess={() => setCurrentScreen("onboarding_goal")}
            />
          )}
          {currentScreen === "onboarding_goal" && (
            <GoalSelectionScreen 
              onNext={(goal) => {
                setUserGoal(goal);
                setCurrentScreen("onboarding_info");
              }} 
            />
          )}
          {currentScreen === "onboarding_info" && (
            <PersonalInfoScreen 
              onNext={() => setCurrentScreen("onboarding_avatar")} 
            />
          )}
          {currentScreen === "onboarding_avatar" && (
            <AvatarSelectionScreen 
              onNext={(avatar) => {
                setSelectedAvatar(avatar);
                setCurrentScreen("onboarding_diagnostic");
              }} 
            />
          )}
          {currentScreen === "onboarding_diagnostic" && (
            <DiagnosticChoiceScreen 
              onStartTest={() => setCurrentScreen("onboarding_test")}
              onSkipWithScore={(score) => {
                setTestResult({ score: parseInt(score), level: getLevelFromScore(parseInt(score)) });
                setCurrentScreen("onboarding_result");
              }}
            />
          )}
          {currentScreen === "onboarding_test" && (
            <DiagnosticTestScreen 
              onComplete={(score) => {
                setTestResult({ score, level: getLevelFromScore(score) });
                setCurrentScreen("onboarding_result");
              }}
            />
          )}
          {currentScreen === "onboarding_result" && (
            <DiagnosticResultScreen 
              score={testResult?.score || 0}
              level={testResult?.level || "B1"}
              onNext={() => setCurrentScreen("dashboard")} 
            />
          )}
          {currentScreen === "dashboard" && (
            <DashboardScreen 
              onLogout={() => setCurrentScreen("welcome")}
              onSeeResults={() => {
                setProfileTab("Puanlar");
                setCurrentScreen("profile");
              }}
              onProfileClick={() => {
                setProfileTab("Profil");
                setCurrentScreen("profile");
              }}
              onLessonsClick={() => setCurrentScreen("lessons")}
              onAIYDSClick={() => setCurrentScreen("ai_yds")}
            />
          )}
          {currentScreen === "profile" && (
            <ProfileScreen 
              score={testResult?.score || 86}
              goal={userGoal || "65"}
              avatar={selectedAvatar}
              initialTab={profileTab}
              onBack={() => setCurrentScreen("dashboard")}
              onHomeClick={() => setCurrentScreen("dashboard")}
              onLessonsClick={() => setCurrentScreen("lessons")}
              onAIYDSClick={() => setCurrentScreen("ai_yds")}
            />
          )}
          {currentScreen === "lessons" && (
            <LessonsScreen 
              onHomeClick={() => setCurrentScreen("dashboard")}
              onProfileClick={() => {
                setProfileTab("Profil");
                setCurrentScreen("profile");
              }}
              onStartTest={() => setCurrentScreen("active_test")}
              onSeeResults={() => {
                setCurrentScreen("test_result");
              }}
              onAIYDSClick={() => setCurrentScreen("ai_yds")}
            />
          )}
          {currentScreen === "active_test" && (
            <ActiveTestScreen 
              onBack={() => setCurrentScreen("lessons")}
              onComplete={() => setCurrentScreen("test_result")}
              onHomeClick={() => setCurrentScreen("dashboard")}
              onProfileClick={() => setCurrentScreen("profile")}
              onAIYDSClick={() => setCurrentScreen("ai_yds")}
            />
          )}
          {currentScreen === "test_result" && (
            <TestResultScreen 
              onBack={() => setCurrentScreen("lessons")}
              onHomeClick={() => setCurrentScreen("dashboard")}
              onLessonsClick={() => setCurrentScreen("lessons")}
              onProfileClick={() => setCurrentScreen("profile")}
              onAIYDSClick={() => setCurrentScreen("ai_yds")}
            />
          )}
          {currentScreen === "ai_yds" && (
            <AIYDSScreen 
              onHomeClick={() => setCurrentScreen("dashboard")}
              onLessonsClick={() => setCurrentScreen("lessons")}
              onProfileClick={() => {
                setProfileTab("Profile");
                setCurrentScreen("profile");
              }}
            />
          )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center z-30">
          <div className={`${currentScreen === "welcome" ? "bg-white/40" : "bg-zinc-200"} h-1.5 w-32 rounded-full`}></div>
        </div>
      </motion.div>
    </div>
  );
}

function WelcomeScreen({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-[#b00000] overflow-hidden"
    >
      {/* Background Image - The image provided by the user */}
      <img 
        src={welcomeScreenImg} 
        alt="Welcome" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if image is not found
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Fallback Gradient and Logo if image is missing */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#b00000] to-[#7a0000] -z-10 flex flex-col items-center justify-center">
        <img src={logoWelcomeImg} alt="Logo" className="w-64 h-auto mb-4" referrerPolicy="no-referrer" />
        <h2 className="text-white text-5xl font-serif">YDSKazan</h2>
      </div>

      {/* Buttons Container - Positioned at the bottom */}
      <div className="absolute bottom-24 w-full px-10 space-y-4 z-20">
        <motion.button
          onClick={onGetStarted}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-white text-[#b00000] font-black rounded-2xl shadow-2xl text-lg uppercase tracking-widest"
        >
          Başla
        </motion.button>

        <motion.button
          onClick={onSignIn}
          whileHover={{ opacity: 0.8 }}
          className="w-full text-white font-bold text-lg drop-shadow-lg"
        >
          Giriş Yap
        </motion.button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center z-30">
        <div className="bg-white/40 h-1.5 w-32 rounded-full"></div>
      </div>
    </motion.div>
  );
}

function SignUpScreen({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-12 pb-8 overflow-y-auto"
    >
      {/* Status Bar (Dark) */}
      <div className="absolute top-0 inset-x-0 pt-4 px-8 flex justify-between items-center text-[12px] font-medium text-zinc-900 z-20">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22h20V2z" opacity="0.3" /><path d="M2 22h16V6z" /></svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7H7c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" /></svg>
        </div>
      </div>

      {/* Back Button */}
      <button onClick={onBack} className="self-start mb-4 text-zinc-400 hover:text-zinc-600 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-[#101828] leading-tight mb-2">
          Tüm derslerimizi görmek için kaydolun!
        </h1>
        <p className="text-zinc-500 text-[15px]">
          3 günlük ücretsiz denemenizi başlatın.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-6">
        <input 
          type="text" 
          placeholder="Ad Soyad" 
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
        />
        <input 
          type="email" 
          placeholder="E-postanızı giriniz" 
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
        />
      </div>

      {/* Remember Me */}
      <div className="flex items-start gap-3 mb-6">
        <input type="checkbox" id="remember" className="mt-1 w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
        <label htmlFor="remember" className="flex flex-col">
          <span className="text-sm font-semibold text-[#344054]">Beni hatırla</span>
          <span className="text-xs text-zinc-500">Giriş bilgilerimi bir sonraki sefer için kaydet.</span>
        </label>
      </div>

      {/* Submit Button */}
      <button className="w-full py-3.5 bg-[#0a0a0a] text-white font-bold rounded-xl shadow-sm hover:bg-zinc-800 transition-colors mb-6">
        E-posta ile devam et
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-x-0 h-px bg-zinc-100"></div>
        <span className="relative px-4 bg-white text-[12px] font-medium text-zinc-400 uppercase tracking-wider">VEYA</span>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3 mb-8">
        <SocialButton icon="google" label="Google ile kaydol" />
        <SocialButton icon="facebook" label="Facebook ile kaydol" />
        <SocialButton icon="apple" label="Apple ile kaydol" />
      </div>

      {/* Footer */}
      <div className="text-center mt-auto">
        <p className="text-sm text-zinc-500">
          Zaten bir hesabınız var mı? <button onClick={onLogin} className="font-bold text-[#101828] hover:underline">Giriş Yap</button>
        </p>
      </div>
    </motion.div>
  );
}

function LoginScreen({ onBack, onSignUp, onLoginSuccess }: { onBack: () => void; onSignUp: () => void; onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "test123@gmail.com" && password === "123") {
      onLoginSuccess();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-12 pb-8 overflow-y-auto"
    >
      {/* Status Bar (Dark) */}
      <div className="absolute top-0 inset-x-0 pt-4 px-8 flex justify-between items-center text-[12px] font-medium text-zinc-900 z-20">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22h20V2z" opacity="0.3" /><path d="M2 22h16V6z" /></svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7H7c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" /></svg>
        </div>
      </div>

      {/* Back Button */}
      <button onClick={onBack} className="self-start mb-4 text-zinc-400 hover:text-zinc-600 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-[#101828] leading-tight mb-2">
          Tekrar Hoş Geldiniz!
        </h1>
        <p className="text-zinc-500 text-[15px]">
          Lütfen bilgilerinizi giriniz.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#344054]">E-posta</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-postanızı giriniz" 
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#344054]">Şifre</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

      {/* Options */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember-login" className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
          <label htmlFor="remember-login" className="text-sm font-medium text-[#344054]">30 gün boyunca hatırla</label>
        </div>
        <button className="text-sm font-bold text-[#101828] hover:underline">Şifremi unuttum</button>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleLogin}
        className="w-full py-3.5 bg-[#0a0a0a] text-white font-bold rounded-xl shadow-sm hover:bg-zinc-800 transition-colors mb-6"
      >
        Giriş Yap
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-x-0 h-px bg-zinc-100"></div>
        <span className="relative px-4 bg-white text-[12px] font-medium text-zinc-400 uppercase tracking-wider">VEYA</span>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3 mb-8">
        <SocialButton icon="google" label="Google ile giriş yap" />
        <SocialButton icon="facebook" label="Facebook ile giriş yap" />
        <SocialButton icon="apple" label="Apple ile giriş yap" />
      </div>

      {/* Footer */}
      <div className="text-center mt-auto">
        <p className="text-sm text-zinc-500">
          Hesabınız yok mu? <button onClick={onSignUp} className="font-bold text-[#101828] hover:underline">Kaydol</button>
        </p>
      </div>
    </motion.div>
  );
}

function GoalSelectionScreen({ onNext }: { onNext: (goal: string) => void }) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    { id: "50", label: "YDS'den 50 Al", min: 50 },
    { id: "65", label: "YDS'den 65 Al (akademik minimum)", min: 65 },
    { id: "70", label: "YDS'den 70 Al", min: 70 },
    { id: "80", label: "YDS'den 80+ Al", min: 80 },
    { id: "docent", label: "Doçentliğe Hazırlanıyorum", min: 65 },
    { id: "abroad", label: "Yurt dışı eğitimi için hazırlanıyorum", min: 75 },
    { id: "custom", label: "Kendi hedefimi belirlemek istiyorum", min: 55 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-16 pb-8 overflow-y-auto"
    >
      <h1 className="text-[32px] font-bold text-[#101828] text-center mb-10 leading-tight">
        Hedefiniz nedir?
      </h1>

      <div className="space-y-3 mb-10">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              selectedGoal === goal.id 
                ? "border-[#7a0000] bg-[#7a0000]/5 text-[#101828]" 
                : "border-zinc-100 text-zinc-600"
            }`}
          >
            <span className="text-[15px] font-medium leading-snug pr-4">{goal.label}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedGoal === goal.id ? "border-[#7a0000] bg-[#7a0000]" : "border-zinc-200"
            }`}>
              {selectedGoal === goal.id && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <button 
        onClick={() => selectedGoal && onNext(selectedGoal)}
        disabled={!selectedGoal}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all mt-auto ${
          selectedGoal ? "bg-[#0a0a0a] text-white" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
        }`}
      >
        Sonraki
      </button>
    </motion.div>
  );
}

function PersonalInfoScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-12 pb-8 overflow-y-auto"
    >
      <div className="flex justify-center mb-8">
        <img 
          src={logoOnboardingImg} 
          alt="Logo" 
          className="w-32 h-auto"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = logoImg;
          }}
        />
      </div>

      <h1 className="text-[32px] font-bold text-[#101828] text-center mb-10">
        Sizi tanıyalım mı?
      </h1>

      <div className="space-y-6 mb-10">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">Doğum Tarihi</label>
          <div className="relative">
            <select className="w-full p-4 border border-zinc-200 rounded-xl appearance-none bg-white text-zinc-700 font-medium">
              <option>Yıl Seçin</option>
              {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                <option key={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">Cinsiyet</label>
          <div className="relative">
            <select className="w-full p-4 border border-zinc-200 rounded-xl appearance-none bg-white text-zinc-700 font-medium">
              <option>Kadın</option>
              <option>Erkek</option>
              <option>Diğer</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">Sınıf/Derece</label>
          <div className="relative">
            <select className="w-full p-4 border border-zinc-200 rounded-xl appearance-none bg-white text-zinc-700 font-medium">
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
              <option>Üniversite</option>
              <option>Mezun</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">Bölge</label>
          <div className="relative">
            <select className="w-full p-4 border border-zinc-200 rounded-xl appearance-none bg-white text-zinc-700 font-medium">
              <option>Türkiye</option>
              <option>Avrupa</option>
              <option>ABD</option>
              <option>Diğer</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-4 bg-[#0a0a0a] text-white rounded-xl font-bold text-lg mt-auto"
      >
        Sonraki
      </button>
    </motion.div>
  );
}

function AvatarSelectionScreen({ onNext }: { onNext: (avatar: string) => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const avatars = AVATARS;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-16 pb-8 overflow-y-auto"
    >
      <h1 className="text-[32px] font-bold text-[#101828] text-center mb-10 leading-tight">
        Avatarınızı seçin!
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {avatars.map((avatar, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all ${
              selectedIndex === index ? "border-[#7a0000] scale-105 z-10 shadow-lg" : "border-transparent"
            }`}
          >
            <img 
              src={avatar} 
              alt={`Avatar ${index + 1}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = avatars[index];
              }}
            />
            {selectedIndex === index && (
              <div className="absolute inset-0 bg-[#7a0000]/10 flex items-center justify-center">
                <div className="bg-white rounded-full p-1 shadow-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <button 
        onClick={() => selectedIndex !== null && onNext(avatars[selectedIndex])}
        disabled={selectedIndex === null}
        className={`w-full py-4 rounded-xl font-bold text-lg mt-auto transition-all ${
          selectedIndex !== null ? "bg-[#0a0a0a] text-white" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
        }`}
      >
        Sonraki
      </button>
    </motion.div>
  );
}

function DiagnosticChoiceScreen({ onStartTest, onSkipWithScore }: { onStartTest: () => void; onSkipWithScore: (score: string) => void }) {
  const [choice, setChoice] = useState<"test" | "score" | null>(null);
  const [score, setScore] = useState("");

  const handleNext = () => {
    if (choice === "test") {
      onStartTest();
    } else if (choice === "score" && score) {
      onSkipWithScore(score);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-16 pb-8 overflow-y-auto"
    >
      <h1 className="text-[32px] font-bold text-[#101828] text-center mb-4 leading-tight">
        Seviye Belirleme Testi
      </h1>
      <p className="text-zinc-500 text-center mb-10 px-4">
        Başlangıç seviyenizi belirlemek için bir yöntem seçin.
      </p>

      <div className="space-y-4 mb-10">
        <button
          onClick={() => setChoice("test")}
          className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
            choice === "test" ? "border-[#7a0000] bg-[#7a0000]/5" : "border-zinc-100"
          }`}
        >
          <span className="text-lg font-bold text-[#101828]">Seviye Belirleme Testini Çöz</span>
          <span className="text-sm text-zinc-500 leading-relaxed">
            Kısa bir testle seviyenizi hızlıca belirleyelim.
          </span>
        </button>

        <div className={`w-full p-6 rounded-2xl border-2 transition-all flex flex-col gap-4 ${
          choice === "score" ? "border-[#7a0000] bg-[#7a0000]/5" : "border-zinc-100"
        }`}>
          <button
            onClick={() => setChoice("score")}
            className="text-left flex flex-col gap-2"
          >
            <span className="text-lg font-bold text-[#101828]">Mevcut Puanımı Gireceğim</span>
            <span className="text-sm text-zinc-500 leading-relaxed">
              En son aldığınız YDS puanını girerek devam edin.
            </span>
          </button>
          
          {choice === "score" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-2"
            >
              <input 
                type="number" 
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Puanınızı girin (0-100)"
                className="w-full p-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a0000]/20"
              />
            </motion.div>
          )}
        </div>
      </div>

      <button 
        onClick={handleNext}
        disabled={!choice || (choice === "score" && !score)}
        className={`w-full py-4 rounded-xl font-bold text-lg mt-auto transition-all ${
          (choice === "test" || (choice === "score" && score)) 
            ? "bg-[#0a0a0a] text-white" 
            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
        }`}
      >
        {choice === "test" ? "Testi Başlat" : "Devam Et"}
      </button>
    </motion.div>
  );
}

function DiagnosticTestScreen({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const questions = [
    {
      question: "I ___ to the cinema yesterday.",
      options: ["go", "went", "gone", "going"],
      correct: 1
    },
    {
      question: "What is the opposite of 'generous'?",
      options: ["kind", "mean", "happy", "tall"],
      correct: 1
    },
    {
      question: "She is interested ___ learning new languages.",
      options: ["in", "on", "at", "for"],
      correct: 0
    },
    {
      question: "If it rains tomorrow, we ___ the picnic.",
      options: ["cancel", "will cancel", "cancelled", "would cancel"],
      correct: 1
    },
    {
      question: "Choose the best response: 'How long have you been living here?'",
      options: ["Since 2010", "For 2010", "In 2010", "At 2010"],
      correct: 0
    }
  ];

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score (0-100)
      const correctCount = newAnswers.reduce((acc, curr, idx) => {
        return acc + (curr === questions[idx].correct ? 1 : 0);
      }, 0);
      const finalScore = Math.round((correctCount / questions.length) * 100);
      onComplete(finalScore);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-16 pb-8"
    >
      <div className="w-full h-1.5 bg-zinc-100 rounded-full mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-[#7a0000]"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-[#7a0000]">Soru {currentQuestion + 1}</span>
        <span className="text-sm text-zinc-400">{currentQuestion + 1} / {questions.length}</span>
      </div>

      <h2 className="text-2xl font-bold text-[#101828] mb-8 leading-tight">
        {questions[currentQuestion].question}
      </h2>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedOption === index 
                ? "border-[#7a0000] bg-[#7a0000]/5 text-[#101828] font-bold" 
                : "border-zinc-100 text-zinc-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button 
        onClick={handleNext}
        disabled={selectedOption === null}
        className={`w-full py-4 rounded-xl font-bold text-lg mt-auto transition-all ${
          selectedOption !== null ? "bg-[#0a0a0a] text-white" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
        }`}
      >
        {currentQuestion === questions.length - 1 ? "Testi Bitir" : "Sonraki Soru"}
      </button>
    </motion.div>
  );
}

function DiagnosticResultScreen({ score, level, onNext }: { score: number; level: string; onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col px-6 pt-20 pb-8 items-center text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-32 h-32 bg-[#7a0000]/10 rounded-full flex items-center justify-center mb-8"
      >
        <div className="w-24 h-24 bg-[#7a0000] rounded-full flex flex-col items-center justify-center text-white">
          <span className="text-3xl font-bold">{level}</span>
          <span className="text-[10px] uppercase tracking-widest opacity-80">Seviye</span>
        </div>
      </motion.div>

      <h1 className="text-3xl font-bold text-[#101828] mb-4">Seviyeniz Belirlendi!</h1>
      <p className="text-zinc-500 mb-8 leading-relaxed">
        Test sonucuna göre tahmini YDS puanınız: <span className="font-bold text-[#7a0000]">{score}</span>. 
        Sizin için özel olarak hazırladığımız çalışma planı ile hedefinize çok yakınsınız!
      </p>

      <div className="w-full bg-zinc-50 rounded-2xl p-6 mb-10 text-left space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#101828]">Güçlü Alanlar</p>
            <p className="text-xs text-zinc-500">Temel dilbilgisi ve zamanlar.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#101828]">Geliştirilmesi Gereken Alanlar</p>
            <p className="text-xs text-zinc-500">Akademik kelime bilgisi ve bağlaçlar.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-4 bg-[#0a0a0a] text-white rounded-xl font-bold text-lg mt-auto"
      >
        Sonraki
      </button>
    </motion.div>
  );
}

function getLevelFromScore(score: number): string {
  if (score < 30) return "A1";
  if (score < 50) return "A2";
  if (score < 70) return "B1";
  if (score < 85) return "B2";
  return "C1";
}

function MountainScreen({ userScore, onSelectLevel }: { userScore: number; onSelectLevel: () => void }) {
  const levels = [
    { id: "C2", range: "95-100", min: 95, x: 50, y: 15 },
    { id: "C1", range: "80-94", min: 80, x: 20, y: 28 },
    { id: "B2", range: "70-79", min: 70, x: 80, y: 42 },
    { id: "B1", range: "55-69", min: 55, x: 25, y: 58 },
    { id: "A2", range: "49-54", min: 49, x: 75, y: 72 },
    { id: "A1", range: "0-48", min: 0, x: 30, y: 85 },
  ];

  const userLevelIndex = levels.findIndex(l => userScore >= l.min);
  const userLevel = levels[userLevelIndex] || levels[levels.length - 1];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#1a302a] overflow-hidden flex flex-col"
    >
      {/* Mountain Background Illustration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Far Mountains */}
        <svg className="absolute bottom-0 w-full h-[60%] opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 100 L20 40 L40 80 L60 30 L80 70 L100 20 L100 100 Z" fill="#2d5a4e" />
        </svg>
        {/* Mid Mountains */}
        <svg className="absolute bottom-0 w-full h-[45%] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 100 L15 50 L35 85 L55 40 L75 90 L100 30 L100 100 Z" fill="#1e3d35" />
        </svg>
        {/* Near Mountains */}
        <svg className="absolute bottom-0 w-full h-[30%] opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 100 L25 60 L50 95 L75 55 L100 100 Z" fill="#142d27" />
        </svg>
        
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a302a] via-transparent to-transparent opacity-60" />
      </div>

      {/* Back Button */}
      <div className="relative z-20 pt-12 px-6">
        <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Path and Nodes */}
      <div className="relative flex-1 z-10">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <motion.path
            d={`M ${levels[levels.length-1].x}% ${levels[levels.length-1].y}% ${levels.slice(0, -1).reverse().map(l => `L ${l.x}% ${l.y}%`).join(' ')}`}
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeOpacity="0.1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {levels.map((level, index) => {
          const isUserLevel = level.id === userLevel.id;
          const isCompleted = userScore > level.min && !isUserLevel;
          const isFuture = userScore < level.min;
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (levels.length - index) * 0.05 }}
              style={{ left: `${level.x}%`, top: `${level.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            >
              {/* Avatar Bubble */}
              {isUserLevel && (
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-14 z-20"
                >
                  <div className="relative w-12 h-12 rounded-full border-2 border-blue-400 overflow-hidden shadow-lg">
                    <img 
                      src={avatar1} 
                      alt="User" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rotate-45" />
                </motion.div>
              )}

              {/* Level Node */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isUserLevel 
                    ? "bg-[#3b82f6] border-[4px] border-white scale-110" 
                    : isCompleted 
                      ? "bg-[#22c55e] border-[4px] border-white/20" 
                      : "bg-[#fef9c3] border-[4px] border-white/10"
                }`}
              >
                {isCompleted && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                )}
              </div>

              {/* Label Card */}
              <div className={`mt-3 px-4 py-1.5 rounded-full whitespace-nowrap bg-white/20 backdrop-blur-sm ${
                isFuture ? "opacity-40" : "opacity-100"
              }`}>
                <span className={`text-[11px] font-bold ${isFuture ? "text-zinc-400" : "text-white"}`}>
                  {level.id} {level.range}
                </span>
              </div>

              {/* Tooltips (Only for specific nodes to match image) */}
              {isUserLevel && (
                <div className="absolute top-20 -left-4 bg-white p-4 rounded-2xl shadow-2xl w-52 text-left z-30">
                  <p className="text-[#00a3ff] text-[10px] font-extrabold uppercase mb-1 tracking-wider">DEVAM ET!</p>
                  <p className="text-[#101828] text-base font-black">{level.id} {level.range}</p>
                  <p className="text-zinc-400 text-[10px] font-bold">%5 Tamamlandı</p>
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-2 left-10 w-4 h-4 bg-white rotate-45" />
                </div>
              )}

              {isCompleted && level.id === "A2" && (
                <div className="absolute top-20 -right-4 bg-white p-4 rounded-2xl shadow-2xl w-52 text-left z-30">
                  <p className="text-[#22c55e] text-[10px] font-extrabold uppercase mb-1 tracking-wider">TAMAMLANDI!</p>
                  <p className="text-[#101828] text-base font-black">{level.id} {level.range}</p>
                  <p className="text-zinc-400 text-[10px] font-bold leading-tight">760 kişi arasında 34. sıradasınız.</p>
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-2 right-10 w-4 h-4 bg-white rotate-45" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div className="relative z-20 p-8">
        <button 
          onClick={onSelectLevel}
          className="w-full py-4 bg-white text-[#1a302a] rounded-2xl font-black text-lg shadow-2xl hover:bg-zinc-100 transition-colors"
        >
          Panele Giriş Yap
        </button>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ onLogout, onSeeResults, onProfileClick, onLessonsClick, onAIYDSClick }: { onLogout: () => void; onSeeResults: () => void; onProfileClick: () => void; onLessonsClick: () => void; onAIYDSClick: () => void }) {
  const [selectedDay, setSelectedDay] = useState(13);
  const days = [9, 10, 13, 11, 12, 14];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#f9fafb] flex flex-col font-sans overflow-hidden"
    >
      {/* Red Header */}
      <div className="bg-[#b00000] pt-14 pb-6 px-6 flex items-center gap-4">
        <button onClick={onLogout} className="text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight">B1 69-55</h1>
      </div>

      {/* Calendar Section */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6 px-10">
          <button className="text-zinc-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="text-[17px] font-semibold text-zinc-600">Mart 2026</h2>
          <button className="text-zinc-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
        
        <div className="bg-[#fee4e2]/30 rounded-full p-1.5 flex justify-between items-center">
          {days.map((day) => (
            <button 
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-11 h-11 flex items-center justify-center rounded-full text-[17px] font-medium transition-all ${
                selectedDay === day 
                  ? "bg-[#b00000] text-white shadow-md" 
                  : "text-[#b00000]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Session 1 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center">
          <h3 className="text-[32px] font-bold text-[#101828] mb-1">YDS Oturum 1</h3>
          <p className="text-zinc-400 text-[16px] mb-6">Başarıya ulaşmak için testleri çözün.</p>
          
          <div className="flex justify-center gap-12 mb-8">
            <div className="flex items-center gap-3 text-zinc-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[16px] font-medium">25 Dakika</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
              <span className="text-[16px] font-medium">32 Soru</span>
            </div>
          </div>

          <button 
            onClick={onSeeResults}
            className="w-full py-4.5 bg-[#b00000] text-white font-bold rounded-2xl shadow-lg shadow-red-100 text-lg"
          >
            Sonuçları Gör
          </button>
        </div>

        {/* Session 2 */}
        <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center">
          <h3 className="text-[32px] font-bold text-[#101828] mb-1">YDS Oturum 2</h3>
          <p className="text-zinc-400 text-[16px] mb-6">Başarıya ulaşmak için testleri çözün.</p>
          
          <div className="flex justify-center gap-12 mb-8">
            <div className="flex items-center gap-3 text-zinc-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[16px] font-medium">25 Dakika</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"/></svg>
              <span className="text-[16px] font-medium">32 Soru</span>
            </div>
          </div>

          <button className="w-full py-4.5 bg-[#1c1c1c] text-white font-bold rounded-2xl shadow-lg text-lg">
            Testi Başlat
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 pb-8">
        <div className="bg-black p-2 flex justify-around items-center rounded-[3rem] shadow-2xl">
          <button className="flex flex-col items-center">
            <div className="bg-[#fee4e2] px-5 py-2 rounded-full flex flex-col items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#b00000"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <span className="text-[10px] text-[#b00000] font-bold mt-0.5">Ana Sayfa</span>
            </div>
          </button>
          <button onClick={onLessonsClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Dersler</span>
          </button>
          <button onClick={onProfileClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Profil</span>
          </button>
          <button onClick={onAIYDSClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">AI YDS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileScreen({ score, avatar, onBack, onHomeClick, onLessonsClick, onAIYDSClick, initialTab = "Profil" }: { score: number; goal: string; avatar: string | null; onBack: () => void; onHomeClick: () => void; onLessonsClick: () => void; onAIYDSClick: () => void; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const conversionTable = [
    { yds: '90-100', toefl: '114-120', cefr: 'C2', desc: 'Ustalık', academic: 'Doçentlik / Profesörlük' },
    { yds: '80-89', toefl: '95-113', cefr: 'C1', desc: 'İleri', academic: 'Doktora / Öğr. Üyesi' },
    { yds: '70-79', toefl: '72-94', cefr: 'B2', desc: 'Üst-Orta', academic: 'Yüksek Lisans' },
    { yds: '60-69', toefl: '42-71', cefr: 'B1', desc: 'Orta', academic: 'Lisans Mezunu' },
    { yds: '50-59', toefl: '32-41', cefr: 'A2', desc: 'Temel Üstü', academic: 'Giriş Seviyesi' },
    { yds: '0-49', toefl: '0-31', cefr: 'A1', desc: 'Başlangıç', academic: 'Başlangıç' },
  ];

  const currentLevel = conversionTable.find(row => {
    const [min, max] = row.yds.split('-').map(Number);
    return score >= min && score <= max;
  }) || conversionTable[conversionTable.length - 1];

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#f9fafb] flex flex-col font-sans overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-start">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#fee4e2] flex items-center justify-center border-4 border-white shadow-sm">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#101828] leading-tight">İclal Peker</h1>
              <p className="text-sm text-[#667085] mb-2">iclal@gmail.com</p>
              <button className="bg-[#1a1a1a] text-white px-8 py-2 rounded-xl text-sm font-bold shadow-sm">
                Çıkış Yap
              </button>
            </div>
          </div>
          
          <button onClick={onBack} className="text-zinc-400 p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#f2f4f7] p-1 rounded-full flex gap-1 w-fit overflow-x-auto scrollbar-hide">
          {["Profil", "Puanlar", "Tüm Sonuçlar"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                activeTab === tab ? "bg-white text-[#101828] shadow-sm" : "text-[#667085]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 scrollbar-hide">
        {activeTab === "Puanlar" && (
          <div className="flex flex-col items-center w-full">
            {/* Score Header */}
            <div className="flex items-center gap-2 self-start mb-4">
              <div className="w-5 h-5 rounded-full border-2 border-[#b00000] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#b00000] rounded-full" />
              </div>
              <span className="text-sm font-black text-[#101828]">Puan</span>
            </div>
            
            <h2 className="text-[80px] font-black text-[#101828] leading-none mb-8 tracking-tighter">{score}</h2>

            {/* Main Result Card */}
            <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-zinc-50 flex flex-col items-center mb-8">
              {/* Semi-circular Gauge */}
              <div className="relative w-64 h-36 mb-6 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="#f2f4f7" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                  />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.8 }} // %80 from image
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="#b00000" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                  />
                  <circle cx="90" cy="50" r="4" fill="#b00000" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                  <span className="text-4xl font-black text-[#101828] leading-none">80%</span>
                  <span className="text-sm text-[#667085] font-medium mt-1">Başarı oranı!</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#667085] mb-8">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-sm font-bold">60 Soru</span>
              </div>

              {/* Stats Bars */}
              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#667085]">Doğru</span>
                    <span className="text-[#b00000]">70</span>
                  </div>
                  <div className="h-2 bg-zinc-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#b00000] w-[87.5%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#667085]">Yanlış</span>
                    <span className="text-[#101828]">10</span>
                  </div>
                  <div className="h-2 bg-zinc-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#b00000] opacity-40 w-[12.5%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#667085]">Boş</span>
                    <span className="text-[#101828]">0</span>
                  </div>
                  <div className="h-2 bg-zinc-50 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-200 w-0" />
                  </div>
                </div>
              </div>

              <p className="mt-8 text-[11px] text-[#667085] font-medium text-center leading-relaxed">
                <svg className="inline-block mr-1" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Orta zorluktaki sorularda hızınızı artırmanız gerekiyor.
              </p>

              {/* Category Breakdown */}
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <div className="bg-[#f2f4f7] p-4 rounded-3xl">
                  <p className="text-[#667085] text-[11px] font-bold mb-3">Dilbilgisi</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-black text-[#101828]">20</span>
                    <span className="text-[#667085] text-xs font-bold">/40</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-[#b00000] w-1/2" />
                  </div>
                </div>
                <div className="bg-[#f2f4f7] p-4 rounded-3xl">
                  <p className="text-[#667085] text-[11px] font-bold mb-3">Kelime Bilgisi</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-black text-[#101828]">20</span>
                    <span className="text-[#667085] text-xs font-bold">/120</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-[#b00000] w-[16%]" />
                  </div>
                </div>
              </div>
              
              <div className="w-full mt-4">
                <div className="bg-[#f2f4f7] p-4 rounded-3xl w-[60%] mx-auto">
                  <p className="text-[#667085] text-[11px] font-bold mb-3">Okuma</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-black text-[#101828]">20</span>
                    <span className="text-[#667085] text-xs font-bold">/20</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-[#b00000] w-full" />
                  </div>
                </div>
              </div>

              {/* Conversion Table Section */}
              <div className="mt-10 w-full border-t border-[#eaecf0] pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                  <h3 className="text-sm font-bold text-[#101828]">TOEFL iBT & CEFR Karşılıkları</h3>
                </div>
                
                <div className="bg-[#f9fafb] rounded-2xl overflow-hidden border border-[#eaecf0]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f2f4f7]">
                        <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">YDS</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">TOEFL</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">CEFR</th>
                        <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">Seviye</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionTable.map((row, idx) => {
                        const [min, max] = row.yds.split('-').map(Number);
                        const isCurrent = score >= min && score <= max;
                        return (
                          <tr key={idx} className={`border-t border-[#eaecf0] ${isCurrent ? 'bg-[#fee4e2]' : ''}`}>
                            <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.yds}</td>
                            <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.toefl}</td>
                            <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.cefr}</td>
                            <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.desc}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 bg-[#b00000]/5 rounded-xl border border-[#b00000]/10">
                  <p className="text-[11px] text-[#b00000] font-medium leading-relaxed">
                    <span className="font-bold">Akademik Durum:</span> Mevcut puanınızla <span className="font-bold underline">{currentLevel.academic}</span> başvuruları için yeterli seviyedesiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* Ranking Section */}
            <div className="w-full mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#b00000"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                <span className="text-sm font-black text-[#101828]">Sıralamanız</span>
              </div>
              <div className="bg-white rounded-[2rem] p-6 border border-[#eaecf0] shadow-sm">
                <p className="text-[#667085] text-xs font-bold mb-2">Lisansüstü ve Erasmus Programları Bölümü</p>
                <p className="text-[#667085] text-[10px] font-medium mb-4">Sıralamanız A, ilk %11'lik dilimdesiniz.</p>
                <div className="flex items-center gap-4">
                  <span className="text-[32px] font-black text-[#101828]">#B</span>
                  <div className="text-[32px]">🏆</div>
                </div>
              </div>
            </div>

            {/* Repeat and Improve Section */}
            <div className="w-full mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-[#b00000] rounded flex items-center justify-center text-white text-[10px] font-bold">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3 21 7 17 11"/><path d="M3 21 7 17 3 13"/><path d="M21 7H3"/><path d="M3 17h18"/></svg>
                </div>
                <span className="text-sm font-black text-[#101828]">Tekrar Et ve Geliştir</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-2xl p-4 border border-[#eaecf0] shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3f2] flex items-center justify-center text-[#f04438] font-black text-lg">!</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#101828]">Dilbilgisi</p>
                    <p className="text-[11px] text-[#667085] leading-tight">Eksik olduğunuz konular (%40). Daha fazla soru çözmeniz gerekiyor.</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
                
                <div className="bg-white rounded-2xl p-4 border border-[#eaecf0] shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fff9f5] flex items-center justify-center text-[#f79009] font-black text-lg">Σ</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#101828]">Okuma</p>
                    <p className="text-[11px] text-[#667085] leading-tight">Konunun gözden geçirilmesi gerekiyor, özellikle konuyu tekrar incelemelisiniz.</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>

              {/* Video Lesson Card */}
              <div className="relative rounded-[2rem] overflow-hidden aspect-video mb-8">
                <img 
                  src={welcomeScreenImg} 
                  alt="Lesson" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                  <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full mb-2">
                    <span className="text-[10px] text-white font-bold">BÖLÜM 1</span>
                  </div>
                  <h4 className="text-white text-xl font-black">Nasıl başlanır</h4>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="w-full mb-8">
              <div className="bg-[#b00000] rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-white text-xl font-black mb-6">AI Asistanımla Konuşun!</h3>
                  <button className="bg-white text-[#b00000] px-8 py-3 rounded-full font-black text-sm flex items-center gap-2 shadow-lg">
                    AI Arı
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
                {/* Animal Illustration Placeholder */}
                <div className="mt-6 flex justify-center opacity-40">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
              </div>
            </div>

            {/* Recent Mistakes */}
            <div className="w-full mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-[#101828]">Son Hatalar</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div className="min-w-[280px] bg-white rounded-3xl p-6 border border-[#eaecf0] shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#fee4e2] flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f04438" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </div>
                      <span className="text-xs font-black text-[#101828]">Soru 14</span>
                      <span className="text-[10px] text-[#667085] font-bold">Zor</span>
                    </div>
                    <span className="text-[10px] text-[#667085] font-bold">Dilbilgisi</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#fef3f2] p-3 rounded-xl">
                      <p className="text-[10px] text-[#667085] font-bold mb-1">Cevabınız</p>
                      <p className="text-sm font-black text-[#f04438]">A (12.5%)</p>
                    </div>
                    <div className="bg-[#f6fef9] p-3 rounded-xl">
                      <p className="text-[10px] text-[#667085] font-bold mb-1">Doğru Cevap</p>
                      <p className="text-sm font-black text-[#12b76a]">C (35.0%)</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-[#667085] flex items-center gap-1">
                    Çözümü Görüntüle
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Preview */}
            <div className="w-full mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-[#101828]">Analiz Önizlemesi</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Dilbilgisi', value: 85, color: '#444ce7', icon: 'book' },
                  { label: 'Kelime Bilgisi', value: 45, color: '#f79009', icon: 'languages' },
                  { label: 'Okuma', value: 62, color: '#12b76a', icon: 'book-open' }
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-4 border border-[#eaecf0] shadow-sm flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.label === 'Dilbilgisi' ? 'bg-[#eff8ff]' : 
                      item.label === 'Kelime Bilgisi' ? 'bg-[#fef6ee]' : 'bg-[#f6fef9]'
                    }`}>
                      <div className="w-5 h-5 opacity-40 bg-current" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-[#344054]">{item.label}</span>
                        <span className="text-xs font-black" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-[#f2f4f7] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Tüm Sonuçlar" && (
          <div className="space-y-4">
            {[
              { title: "YDS Kelime Sınavı 1", date: "12 Mart 2026", score: 86, correct: 70, incorrect: 10 },
              { title: "YDS Dil Bilgisi Oturumu 2", date: "10 Mart 2026", score: 72, correct: 58, incorrect: 14 },
              { title: "Okuduğunu Anlama 1", date: "08 Mart 2026", score: 65, correct: 52, incorrect: 18 }
            ].map((result, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-[#eaecf0] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fee4e2] flex items-center justify-center text-[#b00000]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#101828]">{result.title}</h4>
                    <p className="text-[10px] text-[#667085] font-medium">{result.date} • {result.correct} Doğru, {result.incorrect} Yanlış</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-[#b00000]">{result.score}</span>
                  <button className="text-[10px] font-bold text-[#667085] hover:text-[#b00000] transition-colors">Detaylar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Profil" && (
          <div className="bg-white rounded-[2rem] border border-[#eaecf0] shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#344054]">Ad</label>
                <input 
                  type="text" 
                  defaultValue="İclal"
                  className="w-full px-4 py-3 rounded-xl border border-[#d0d5dd] text-[#101828] font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#344054]">Soyad</label>
                <input 
                  type="text" 
                  defaultValue="Peker"
                  className="w-full px-4 py-3 rounded-xl border border-[#d0d5dd] text-[#101828] font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#344054]">Şifre</label>
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full px-4 py-3 rounded-xl border border-[#d0d5dd] text-[#101828] font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#344054]">E-posta</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </div>
                  <input 
                    type="email" 
                    defaultValue="iclal@gmail.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#d0d5dd] text-[#101828] font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-[#eaecf0] flex gap-3">
              <button className="flex-1 py-3 px-4 border border-[#d0d5dd] rounded-xl font-bold text-[#344054] hover:bg-zinc-50 transition-colors">
                İptal
              </button>
              <button className="flex-1 py-3 px-4 bg-[#1a1a1a] text-white rounded-xl font-bold hover:bg-black transition-colors">
                Değişiklikleri kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === "Missing Exams" && (
          <div className="space-y-4">
            {[
              { title: "Practice Exam 4", date: "Due in 2 days", category: "Grammar" },
              { title: "Vocabulary Quiz 2", date: "Due in 5 days", category: "Vocabulary" },
              { title: "Reading Assessment", date: "Due in 1 week", category: "Reading" }
            ].map((exam, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-[#eaecf0] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f2f4f7] flex items-center justify-center text-[#667085]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#101828]">{exam.title}</h4>
                    <p className="text-[10px] text-[#667085] font-medium">{exam.category} • {exam.date}</p>
                  </div>
                </div>
                <button className="text-[#444ce7] font-bold text-xs">Start</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-4 right-4 z-50">
        <div className="bg-black p-2 flex justify-around items-center rounded-[3rem] shadow-2xl">
          <button onClick={onHomeClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Ana Sayfa</span>
          </button>
          <button onClick={onLessonsClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Dersler</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="bg-[#fee4e2] px-5 py-2 rounded-full flex flex-col items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="text-[10px] text-[#b00000] font-bold mt-0.5">Profil</span>
            </div>
          </button>
          <button onClick={onAIYDSClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">AI YDS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}




function LessonsScreen({ onHomeClick, onProfileClick, onStartTest, onSeeResults, onAIYDSClick }: { onHomeClick: () => void; onProfileClick: () => void; onStartTest: () => void; onSeeResults: () => void; onAIYDSClick: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "practice">("practice");

  const categories = [
    { id: 'vocab', title: 'Kelime Bilgisi', description: 'YDS\'de sık çıkan kelimeleri öğrenin, eş ve zıt anlamlılarda ustalaşın ve cümle içinde doğru kullanımı pekiştirin.' },
    { id: 'grammar', title: 'Dil Bilgisi', description: 'YDS\'de sıkça test edilen zamanlar, cümle yapıları, bağlaçlar ve temel dil bilgisi konularını çalışın.' },
    { id: 'reading', title: 'Okuma Anlama', description: 'Paragraf sorularını yanıtlama, ana fikirleri belirleme, çıkarım yapma ve bağlamdan anlam çıkarma yeteneğinizi geliştirin.' },
    { id: 'translation', title: 'Çeviri', description: 'YDS çeviri sorularına hazırlanmak için Türkçe\'den İngilizce\'ye ve İngilizce\'den Türkçe\'ye çeviri pratiği yapın.' }
  ];

  const subjectsData: Record<string, any[]> = {
    vocab: [
      { id: 'v1', title: 'Doğrusal Denklemler ve Eşitsizlikler', expanded: true, videos: '160 Video', tests: '320 Test' },
      { id: 'v2', title: 'Yaygın YDS Kelimeleri' },
      { id: 'v3', title: 'Eş ve Zıt Anlamlılar' },
      { id: 'v4', title: 'Kalıplaşmış İfadeler ve Phrasal Verbs' },
      { id: 'v5', title: 'Akademik ve Resmi Kelime Bilgisi' },
      { id: 'v6', title: 'Bağlam İpuçları ve Kelime Anlamı' },
      { id: 'v7', title: 'Deyimler ve İfadeler' },
    ],
    grammar: [
      { id: 'g1', title: 'İkinci Dereceden Denklemler', expanded: true, videos: '160 Video', tests: '320 Test' },
      { id: 'g2', title: 'Zamanlar ve Kullanımları' },
      { id: 'g3', title: 'Modal Fiiller' },
      { id: 'g4', title: 'Koşul Cümleleri' },
      { id: 'g5', title: 'Edilgen Yapı' },
      { id: 'g6', title: 'İlgi Cümlecikleri' },
      { id: 'g7', title: 'Bağlaçlar ve Bağlantı Kelimeleri' },
    ],
    reading: [
      { id: 'r1', title: 'Gelişim', expanded: true, videos: '160 Video', tests: '320 Test' },
      { id: 'r2', title: 'Ana Fikir Soruları' },
      { id: 'r3', title: 'Detay ve Spesifik Bilgi' },
      { id: 'r4', title: 'Çıkarım Soruları' },
      { id: 'r5', title: 'Kelimelerin Bağlamsal Anlamı' },
      { id: 'r6', title: 'Yazarın Tonu ve Amacı' },
      { id: 'r7', title: 'Paragraf Tamamlama' },
    ],
    translation: [
      { id: 't1', title: 'Sosyal ve Etik Sorunlar', expanded: true, videos: '160 Video', tests: '320 Test' },
      { id: 't2', title: 'Türkçe\'den İngilizce\'ye Cümle Çevirisi' },
      { id: 't3', title: 'İngilizce\'den Türkçe\'ye Cümle Çevirisi' },
      { id: 't4', title: 'Paragraf Çeviri Pratiği' },
      { id: 't5', title: 'Deyim ve İfadelerin Çevirisi' },
      { id: 't6', title: 'Çeviride Dil Bilgisi Yapıları' },
      { id: 't7', title: 'Çeviride Sık Yapılan Hatalar' },
    ]
  };

  const exams = [
    { id: 1, title: "Deneme Sınavı 1", status: "solved" },
    { id: 2, title: "Deneme Sınavı 2", status: "start" },
    { id: 3, title: "Deneme Sınavı 3", status: "start" },
  ];

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const subjects = selectedCategory ? subjectsData[selectedCategory] : [];
  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#f9fafb] flex flex-col font-sans overflow-hidden h-full"
    >
      {!selectedCategory ? (
        <>
          {/* Category Selection Header */}
          <div className="bg-[#b00000] px-6 pt-12 pb-6 mb-6">
            <h1 className="text-[32px] font-bold text-white mb-1">Dersler</h1>
            <p className="text-white/70 text-sm leading-relaxed">
              Öğrenmeye başlamak için bir kategori seçin.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-4">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="w-full bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between group hover:border-[#42a5f5] transition-all"
              >
                <div className="text-left">
                  <h3 className="text-xl font-bold text-[#101828] mb-1">{cat.title}</h3>
                  <p className="text-zinc-400 text-xs line-clamp-1">{cat.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#42a5f5]/10 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-[#42a5f5]"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : !selectedSubject ? (
        <>
          {/* Subject List Header */}
          <div className="bg-[#b00000] px-6 pt-12 pb-6 mb-6">
            <button onClick={() => setSelectedCategory(null)} className="mb-3 text-white/80 flex items-center gap-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="text-xs font-medium">Geri</span>
            </button>
            <h1 className="text-[28px] font-bold text-white mb-1">{currentCategory?.title}</h1>
            <p className="text-white/80 text-xs leading-relaxed mb-3">Öğrenmeye başlamak için bir konu seçin</p>
            <p className="text-white/60 text-[10px] leading-relaxed">
              {currentCategory?.description}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-3">
            {subjects.map((subject) => (
              <div key={subject.id}>
                {subject.expanded ? (
                  <div className="bg-[#b00000] rounded-[2rem] p-0.5 shadow-lg shadow-red-100">
                    <div className="bg-[#b00000] p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      </div>
                      <span className="text-white font-bold text-sm">{subject.title}</span>
                    </div>
                    <div className="bg-white rounded-[1.8rem] p-4 flex gap-3">
                      <button 
                        onClick={() => {
                          setSelectedSubject(subject.id);
                          setActiveTab("video");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-zinc-100 hover:bg-zinc-50 transition-all"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                        <div className="text-left">
                          <p className="text-[11px] font-bold leading-none">Video Dersler</p>
                          <p className="text-[10px] opacity-60">{subject.videos}</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedSubject(subject.id);
                          setActiveTab("practice");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-zinc-100 hover:bg-zinc-50 transition-all"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div className="text-left">
                          <p className="text-[11px] font-bold leading-none">Pratik Testler</p>
                          <p className="text-[10px] opacity-60">{subject.tests}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedSubject(subject.id)}
                    className="w-full bg-white p-5 rounded-2xl border border-zinc-100 flex items-center gap-4 hover:border-[#b00000]/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-[#b00000]/10 transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-[#b00000]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <span className="text-sm font-bold text-[#101828] text-left">{subject.title}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Exam List View (Detail View) */}
          <div className="bg-[#b00000] px-6 pt-12 pb-6 mb-6">
            <button onClick={() => setSelectedSubject(null)} className="mb-3 text-white/80 flex items-center gap-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="text-xs font-medium">Geri</span>
            </button>
            <h1 className="text-[28px] font-bold text-white mb-1">{currentCategory?.title}</h1>
            <p className="text-white/70 text-xs leading-relaxed mb-6">
              {currentCategory?.description}
            </p>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setActiveTab("video")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  activeTab === "video" ? "border-white bg-white/10 text-white" : "border-white/20 text-white/40"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                <div className="text-left">
                  <p className="text-[11px] font-bold leading-none">Video Dersler</p>
                  <p className="text-[10px] opacity-60">160 Video</p>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab("practice")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  activeTab === "practice" ? "border-white bg-white text-[#b00000]" : "border-white/20 text-white/40"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div className="text-left">
                  <p className="text-[11px] font-bold leading-none">Pratik Testler</p>
                  <p className="text-[10px] opacity-60">46 Test</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-4">
            {activeTab === "practice" ? (
              exams.map((exam) => (
                <div key={exam.id} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-[#101828] mb-1">{exam.title}</h3>
                  <p className="text-zinc-400 text-xs mb-6">Sınav detaylarını ve süresini aşağıda görebilirsiniz.</p>
                  
                  <div className="flex justify-center gap-8 mb-8">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span className="text-xs font-bold">25 Dak</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      <span className="text-xs font-bold">32 Soru</span>
                    </div>
                  </div>

                  {exam.status === "solved" ? (
                    <button 
                      onClick={onSeeResults}
                      className="w-full py-4 bg-[#b00000] text-white font-bold rounded-2xl shadow-lg shadow-red-100 text-sm"
                    >
                      Çözüldü Sonuçları Gör
                    </button>
                  ) : (
                    <button 
                      onClick={onStartTest}
                      className="w-full py-4 bg-zinc-900 text-white font-bold rounded-2xl shadow-lg text-sm"
                    >
                      Teste Başla
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                <p className="text-sm font-medium">Video lessons coming soon</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-4 right-4 z-50">
        <div className="bg-black p-2 flex justify-around items-center rounded-[3rem] shadow-2xl">
          <button onClick={onHomeClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Ana Sayfa</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="bg-[#fee4e2] px-5 py-2 rounded-full flex flex-col items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span className="text-[10px] text-[#b00000] font-bold mt-0.5">Dersler</span>
            </div>
          </button>
          <button onClick={onProfileClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Profil</span>
          </button>
          <button onClick={onAIYDSClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">AI YDS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}


function ActiveTestScreen({ onBack, onComplete, onHomeClick, onProfileClick, onAIYDSClick }: { onBack: () => void; onComplete: () => void; onHomeClick: () => void; onProfileClick: () => void; onAIYDSClick: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>("A");

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-white flex flex-col font-sans overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-2 text-zinc-900 font-bold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className="text-sm">25 Dak</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        <h2 className="text-2xl font-bold text-[#101828] mb-10 leading-tight">
          Bölüm 1: Yaygın YDS Kelimeleri
        </h2>

        <p className="text-zinc-400 text-sm font-bold text-center mb-8">Soru 1 / 25</p>

        <div className="bg-zinc-50/50 rounded-3xl p-8 mb-8">
          <h3 className="text-lg font-bold text-[#101828] leading-relaxed">
            Hangi kelime 'rapid' kelimesinin eş anlamlısıdır?
          </h3>
        </div>

        <div className="space-y-3 mb-12">
          {[
            { id: "A", label: "Hızlı" },
            { id: "B", label: "Yavaş" },
            { id: "C", label: "Zayıf" },
            { id: "D", label: "Küçük" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-5 rounded-xl border-2 text-left flex items-center gap-6 transition-all ${
                selectedOption === option.id 
                  ? "border-[#42a5f5] bg-[#f0f7ff] text-[#101828]" 
                  : "border-zinc-100 text-zinc-600"
              }`}
            >
              <span className="text-sm font-bold opacity-60">{option.id}</span>
              <span className="text-sm font-bold">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Question Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button className="w-12 h-12 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span className="text-sm font-bold text-zinc-400">1 / 25</span>
          <button onClick={onComplete} className="w-12 h-12 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 pb-8">
        <div className="bg-black p-2 flex justify-around items-center rounded-[3rem] shadow-2xl">
          <button onClick={onHomeClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Ana Sayfa</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="bg-[#fee4e2] px-5 py-2 rounded-full flex flex-col items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span className="text-[10px] text-[#b00000] font-bold mt-0.5">Dersler</span>
            </div>
          </button>
          <button onClick={onProfileClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Profil</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">AI YDS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TestResultScreen({ 
  onBack,
  onHomeClick, 
  onLessonsClick, 
  onProfileClick,
  onAIYDSClick,
  correct = 70,
  total = 86,
  incorrect = 10,
  score = 86
}: { 
  onBack: () => void;
  onHomeClick: () => void; 
  onLessonsClick: () => void; 
  onProfileClick: () => void;
  onAIYDSClick: () => void;
  correct?: number;
  total?: number;
  incorrect?: number;
  score?: number;
}) {
  const successRate = Math.round((correct / total) * 100);

  const conversionTable = [
    { yds: '90-100', toefl: '114-120', cefr: 'C2', desc: 'Ustalık', academic: 'Doçentlik / Profesörlük' },
    { yds: '80-89', toefl: '95-113', cefr: 'C1', desc: 'İleri', academic: 'Doktora / Öğr. Üyesi' },
    { yds: '70-79', toefl: '72-94', cefr: 'B2', desc: 'Üst-Orta', academic: 'Yüksek Lisans' },
    { yds: '60-69', toefl: '42-71', cefr: 'B1', desc: 'Orta', academic: 'Lisans Mezunu' },
    { yds: '50-59', toefl: '32-41', cefr: 'A2', desc: 'Temel Üstü', academic: 'Giriş Seviyesi' },
    { yds: '0-49', toefl: '0-31', cefr: 'A1', desc: 'Başlangıç', academic: 'Başlangıç' },
  ];

  const currentLevel = conversionTable.find(row => {
    const [min, max] = row.yds.split('-').map(Number);
    return score >= min && score <= max;
  }) || conversionTable[conversionTable.length - 1];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-[#f9fafb] flex flex-col relative overflow-hidden font-sans"
    >
      {/* Header Section */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 border-b border-[#eaecf0] shrink-0">
        <button onClick={onBack} className="text-[#101828] p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-base font-bold text-[#101828] flex-1 truncate">Cilt 1: Yaygın YDS Kelimeleri</h1>
      </div>

      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-40 scrollbar-hide">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#eaecf0] flex flex-col">
          <h2 className="text-lg font-black text-[#101828] mb-8 text-center px-4 leading-tight">YDS Kelime Bilgisi Sınavı 1 Sonucu</h2>
          
          {/* Semi-circular Gauge */}
          <div className="relative w-full max-w-[260px] aspect-[2/1] mx-auto mb-12 flex items-end justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
              <path 
                d="M 10 45 A 40 40 0 0 1 90 45" 
                fill="none" 
                stroke="#f2f4f7" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: successRate / 100 }}
                transition={{ duration: 1.5, ease: "circOut" }}
                d="M 10 45 A 40 40 0 0 1 90 45" 
                fill="none" 
                stroke="#b00000" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="flex flex-col items-center pb-0">
              <span className="text-6xl font-black text-[#101828] leading-none tracking-tighter">%{successRate}</span>
              <span className="text-[14px] text-[#667085] font-bold mt-1">Başarı oranı!</span>
            </div>
          </div>

          {/* Stats Bars */}
          <div className="w-full space-y-5 px-2">
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold text-[#667085]">Toplam</span>
                <span className="text-sm font-black text-[#b00000]">{total}</span>
              </div>
              <div className="h-2.5 bg-[#f2f4f7] rounded-full overflow-hidden">
                <div className="h-full bg-[#b00000] w-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold text-[#667085]">Doğru</span>
                <span className="text-sm font-black text-[#12b76a]">{correct}</span>
              </div>
              <div className="h-2.5 bg-[#f2f4f7] rounded-full overflow-hidden">
                <div className="h-full bg-[#12b76a] rounded-full" style={{ width: `${(correct/total)*100}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold text-[#667085]">Yanlış</span>
                <span className="text-sm font-black text-[#f04438]">{incorrect}</span>
              </div>
              <div className="h-2.5 bg-[#f2f4f7] rounded-full overflow-hidden">
                <div className="h-full bg-[#f04438] rounded-full" style={{ width: `${(incorrect/total)*100}%` }} />
              </div>
            </div>
          </div>

          {/* Conversion Table Section */}
          <div className="mt-10 border-t border-[#eaecf0] pt-8">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              <h3 className="text-sm font-bold text-[#101828]">TOEFL iBT & CEFR Karşılıkları</h3>
            </div>
            
            <div className="bg-[#f9fafb] rounded-2xl overflow-hidden border border-[#eaecf0]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f7]">
                    <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">YDS</th>
                    <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">TOEFL</th>
                    <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">CEFR</th>
                    <th className="px-3 py-2 text-[10px] font-bold text-[#667085] uppercase">Seviye</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionTable.map((row, idx) => {
                    const [min, max] = row.yds.split('-').map(Number);
                    const isCurrent = score >= min && score <= max;
                    return (
                      <tr key={idx} className={`border-t border-[#eaecf0] ${isCurrent ? 'bg-[#fee4e2]' : ''}`}>
                        <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.yds}</td>
                        <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.toefl}</td>
                        <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.cefr}</td>
                        <td className={`px-3 py-2.5 text-[11px] font-bold ${isCurrent ? 'text-[#b00000]' : 'text-[#344054]'}`}>{row.desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-[#b00000]/5 rounded-xl border border-[#b00000]/10">
              <p className="text-[11px] text-[#b00000] font-medium leading-relaxed">
                <span className="font-bold">Akademik Durum:</span> Mevcut puanınızla <span className="font-bold underline">{currentLevel.academic}</span> başvuruları için yeterli seviyedesiniz.
              </p>
            </div>
          </div>

          <button className="w-full bg-[#101828] text-white py-4 rounded-2xl font-bold mt-10 shadow-lg active:scale-95 transition-transform">
            Çözümü Görüntüle
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-4 right-4 z-50">
        <div className="bg-black p-2 flex justify-around items-center rounded-[3rem] shadow-2xl">
          <button onClick={onHomeClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Ana Sayfa</span>
          </button>
          <button onClick={onLessonsClick} className="flex flex-col items-center">
            <div className="bg-[#fee4e2] px-5 py-2 rounded-full flex flex-col items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span className="text-[10px] text-[#b00000] font-bold mt-0.5">Dersler</span>
            </div>
          </button>
          <button onClick={onProfileClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Profil</span>
          </button>
          <button onClick={onAIYDSClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">AI YDS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
function AIYDSScreen({ onHomeClick, onLessonsClick, onProfileClick }: { onHomeClick: () => void; onLessonsClick: () => void; onProfileClick: () => void }) {
  const [activeTab, setActiveTab] = useState<"Chat" | "Chat History">("Chat");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#f9fafb] flex flex-col font-sans overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-6 flex flex-col items-center border-b border-zinc-100">
        <div className="bg-[#f2f4f7] p-1 rounded-full flex gap-1 w-fit mb-2">
          {[
            { id: "Chat", label: "Sohbet" },
            { id: "Chat History", label: "Sohbet Geçmişi" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-1.5 text-xs font-bold rounded-full transition-all ${
                activeTab === tab.id ? "bg-white text-[#101828] shadow-sm" : "text-[#667085]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 scrollbar-hide">
        {activeTab === "Chat" ? (
          <div className="space-y-6">
            {/* User Message */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-[#101828]">İclal Peker</span>
                <span className="text-[10px] text-[#667085] font-medium">2:50 PM</span>
              </div>
              <p className="text-sm text-[#667085] leading-relaxed max-w-[90%]">
                Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet
              </p>
            </div>

            {/* AI Message */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-[#667085] font-medium">2:46 PM</span>
              </div>
              <p className="text-sm text-[#667085] leading-relaxed mb-6">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat conser dolor amer conserlormer
              </p>
              <div className="flex items-center gap-4 text-[#667085]">
                <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg></button>
                <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
                <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></button>
                <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
              </div>
            </div>

            {/* User Message 2 */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-[#101828]">İclal Peker</span>
                <span className="text-[10px] text-[#667085] font-medium">2:50 PM</span>
              </div>
              <p className="text-sm text-[#667085] leading-relaxed max-w-[90%]">
                Lorem ipsum dolor sit amet consectetur tincidunt bibendum gravida phasellus sed dignissim id tempus ridiculus consectetur dolor sit amet
              </p>
            </div>

            {/* Chat Input */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-50">
              <p className="text-sm text-[#667085] mb-8">Size nasıl yardımcı olabilirim?</p>
              <div className="w-full h-[1px] bg-zinc-100 mb-6" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[#667085]">
                  <button><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                  <button><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></button>
                  <button><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></button>
                  <button><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg></button>
                </div>
                <button className="text-[#42a5f5]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-[10px] font-bold text-[#667085] uppercase tracking-widest">SOHBET GEÇMİŞİ</p>
            <div className="space-y-6">
              {[
                "Quis ipsum suspendisse",
                "Ut tristique et egestas quis ipsum sus",
                "Sed viverra tellus inhac",
                "Eros in cursus turpis massa",
                "Dictum at tempor commodo ullamcorper",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et",
                "Morbi tristique senectus et"
              ].map((item, idx) => (
                <div key={idx} className="text-sm text-[#667085] font-medium opacity-80 hover:opacity-100 cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-4 right-4 z-50">
        <div className="bg-black p-2 flex justify-around items-center rounded-[3rem] shadow-2xl">
          <button onClick={onHomeClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Ana Sayfa</span>
          </button>
          <button onClick={onLessonsClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Dersler</span>
          </button>
          <button onClick={onProfileClick} className="flex flex-col items-center gap-1 p-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] text-white/60 font-medium">Profil</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="bg-[#fee4e2] px-5 py-2 rounded-full flex flex-col items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
              <span className="text-[10px] text-[#b00000] font-bold mt-0.5">AI YDS</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full py-3 px-4 border border-zinc-200 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-50 transition-colors">
      {icon === "google" && (
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      )}
      {icon === "facebook" && (
        <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      )}
      {icon === "apple" && (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.066 11.34c.023 2.69 2.343 3.585 2.368 3.597-.02.067-.37 1.268-1.21 2.502-.725 1.064-1.477 2.123-2.665 2.145-1.17.02-1.548-.695-2.888-.695-1.34 0-1.76.673-2.867.716-1.15.043-2.022-1.15-2.752-2.214-1.49-2.175-2.63-6.144-1.102-8.794.76-1.314 2.112-2.148 3.575-2.17 1.112-.02 2.162.753 2.846.753.683 0 1.956-.945 3.28-.81 0.553.023 2.106.223 3.105 1.685-0.08.05-1.855 1.08-1.835 3.21l.023 0.07zM14.88 4.878c.6-0.73 1.005-1.743 0.895-2.753-0.868.035-1.92.58-2.543 1.31-0.558.646-1.045 1.675-0.915 2.665.968.075 1.963-0.493 2.563-1.222l0 0z"/></svg>
      )}
      <span className="text-sm font-semibold text-[#344054]">{label}</span>
    </button>
  );
}
