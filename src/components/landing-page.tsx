'use client'

import Link from 'next/link'
import { Search, Star, ArrowRight, Target, Upload, FileText } from 'lucide-react'
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiFirebase, SiOpenai, SiVercel } from 'react-icons/si'
import { TbVectorTriangle } from "react-icons/tb";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-display {
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: -0.04em;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-medium tracking-tight">
              Sift
            </Link>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
                <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How it works</a>
                <a href="#testimonials" className="hover:text-neutral-900 transition-colors">Testimonials</a>
              </div>
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F8] via-[#FAF9F6] to-[#FAF9F6] -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="font-display font-semibold text-5xl md:text-7xl leading-[1.1] tracking-tight text-neutral-900">
              Find the right talent,
              <br />
              <span className="text-orange-500">with the right words.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-xl leading-relaxed">
              Search candidates using natural language instead of rigid filters.
              Describe who you need, and let AI find the perfect match.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all hover:gap-3"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-neutral-300 rounded-full hover:bg-white transition-colors"
              >
                Explore the platform
              </a>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-16 md:mt-24 relative">
            <div className="absolute -inset-4 bg-gradient-to-b from-white/50 to-transparent rounded-3xl -z-10" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-neutral-200/50 border border-neutral-200/80 overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-200" />
                  <div className="w-3 h-3 rounded-full bg-neutral-200" />
                  <div className="w-3 h-3 rounded-full bg-neutral-200" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto bg-neutral-100 rounded-md px-3 py-1.5 text-xs text-neutral-400">
                    app.sift.ai/search
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-neutral-500">Good morning, Sarah</p>
                    <p className="text-neutral-900 font-medium">Your candidate search is ready.</p>
                  </div>

                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                  <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4">
                    <Search className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-600 text-sm md:text-base">Senior React developer with 5+ years experience in fintech...</span>
                    <div className="ml-auto hidden md:block">
                      <span className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg">Search</span>
                    </div>
                  </div>
                </div>

                {/* Results Preview */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Alex Chen', role: 'Senior Frontend Engineer', match: 94, skills: ['React', 'TypeScript', 'Node.js'], img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                    { name: 'Maria Santos', role: 'Full Stack Developer', match: 91, skills: ['React', 'Python', 'AWS'], img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                    { name: 'James Wilson', role: 'Lead Engineer', match: 87, skills: ['React', 'Go', 'Kubernetes'], img: 'https://randomuser.me/api/portraits/men/52.jpg' },
                  ].map((candidate, i) => (
                    <div key={i} className="p-4 bg-neutral-50/80 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <img src={candidate.img} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                        <span className="text-xs font-medium text-[#C4D600] bg-[#C4D600]/10 px-2 py-1 rounded-full">
                          {candidate.match}% match
                        </span>
                      </div>
                      <p className="font-medium text-sm text-neutral-900">{candidate.name}</p>
                      <p className="text-xs text-neutral-500 mb-3">{candidate.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map(skill => (
                          <span key={skill} className="text-[10px] px-2 py-0.5 bg-white border border-neutral-200 rounded text-neutral-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Slider */}
      <section className="py-6 bg-[#FAF9F6] overflow-hidden max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="flex animate-scroll">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex shrink-0">
                {[
                  { name: 'Next.js', Icon: SiNextdotjs },
                  { name: 'React', Icon: SiReact },
                  { name: 'TypeScript', Icon: SiTypescript },
                  { name: 'Tailwind', Icon: SiTailwindcss },
                  { name: 'Firebase', Icon: SiFirebase },
                  { name: 'OpenAI', Icon: SiOpenai },
                  { name: 'Pinecone', Icon: TbVectorTriangle},
                  { name: 'Vercel', Icon: SiVercel },
                ].map((tech, i) => (
                  <div
                    key={`${setIndex}-${i}`}
                    className="flex items-center gap-3 px-8 py-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <tech.Icon className="w-5 h-5" />
                    <span className="text-sm font-medium whitespace-nowrap">{tech.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight text-neutral-900">
              Everything you need to find,
              <br />evaluate, and hire.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card - Upload */}
            <div className="group bg-gradient-to-br from-[#D4F5E9] to-[#C4E8DC] rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-start justify-between mb-16">
                <div>
                  <span className="text-xs font-medium text-neutral-400 tracking-wider">01</span>
                  <h3 className="font-display font-semibold text-2xl mt-1">Upload</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-neutral-700" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="bg-white/80 backdrop-blur rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">resume_john_doe.pdf</p>
                    <p className="text-[10px] text-neutral-500">2.4 MB</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Done</span>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">sarah_miller_cv.pdf</p>
                    <div className="mt-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full w-2/3" />
                    </div>
                  </div>
                  <span className="text-xs text-orange-500 font-medium">67%</span>
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Drag and drop resumes. We parse and index them automatically.
              </p>
            </div>

            {/* Feature Card - Search */}
            <div className="group bg-gradient-to-br from-[#E8F4F8] to-[#D4E8F0] rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-start justify-between mb-16">
                <div>
                  <span className="text-xs font-medium text-neutral-400 tracking-wider">02</span>
                  <h3 className="font-display font-semibold text-2xl mt-1">Search</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <Search className="w-5 h-5 text-neutral-700" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="bg-white/80 backdrop-blur rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-600">Senior React developer with fintech exp...</span>
                </div>
                <div className="bg-white/60 rounded-lg px-4 py-2 text-xs text-neutral-500 ml-4">
                  + 5 years experience, remote friendly
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Use natural language to describe your ideal candidate. No more rigid keyword filters.
              </p>
            </div>

            {/* Feature Card - Evaluate */}
            <div className="group bg-gradient-to-br from-[#FDF6E3] to-[#F5ECD7] rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-start justify-between mb-16">
                <div>
                  <span className="text-xs font-medium text-neutral-400 tracking-wider">03</span>
                  <h3 className="font-display font-semibold text-2xl mt-1">Evaluate</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <Target className="w-5 h-5 text-neutral-700" />
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                {[94, 87, 82].map((score, i) => (
                  <div key={i} className="flex-1 bg-white/80 backdrop-blur rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-semibold text-neutral-800">{score}%</div>
                    <div className="text-[10px] text-neutral-500 mt-1">Match score</div>
                    <div className="mt-2 h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                AI-powered matching scores candidates based on semantic understanding.
              </p>
            </div>

            {/* Feature Card - Shortlist */}
            <div className="group bg-gradient-to-br from-[#F0E8F8] to-[#E4D8F0] rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-start justify-between mb-16">
                <div>
                  <span className="text-xs font-medium text-neutral-400 tracking-wider">04</span>
                  <h3 className="font-display font-semibold text-2xl mt-1">Shortlist</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <Star className="w-5 h-5 text-neutral-700" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {[
                    { name: 'Sarah M.', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
                    { name: 'Alex C.', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
                    { name: 'James W.', img: 'https://randomuser.me/api/portraits/men/22.jpg' },
                  ].map((person, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-sm">
                    <img src={person.img} alt={person.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm text-neutral-700 flex-1">{person.name}</span>
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Save and organize your top candidates. Build talent pools for any role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Speed Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-gradient-to-b from-[#FAF9F6] to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-neutral-500 text-sm tracking-wider uppercase mb-4">How it works</p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight text-neutral-900">
              Built for clarity.
              <br />
              <span className="text-orange-500">Designed for action.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8F4F8] mb-6">
                <Search className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-medium text-lg mb-2">Natural language search</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Forget Boolean queries and rigid filters. Just describe who you're looking for like you would to a colleague.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FDF6E3] mb-6">
                <FileText className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-medium text-lg mb-2">Instant resume parsing</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Drop a PDF and we extract skills, experience, and context automatically. No manual data entry required.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4F5E9] mb-6">
                <Target className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="font-medium text-lg mb-2">Semantic matching</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Our AI understands context, not just keywords. "React expert" matches "Senior Frontend Engineer" automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#E8F4F8] to-[#D4E8F0] rounded-3xl overflow-hidden">
                <img
                  src="/NVIDIA-Jensen-Huang.webp"
                  alt="Jensen Huang"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
            </div>
            <div>
              <div className="text-6xl text-neutral-200 font-display font-semibold mb-6">"</div>
              <blockquote className="font-display font-semibold text-2xl md:text-3xl leading-relaxed text-neutral-900 mb-8">
                We used to spend hours filtering resumes with rigid keyword searches. Now we just describe who we need and the right candidates surface instantly.
              </blockquote>
              <div>
                <p className="font-medium text-neutral-900">Jensen Huang</p>
                <p className="text-neutral-500 text-sm">CEO, NVIDIA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight text-neutral-900 mb-8">
            Ready to transform your hiring?
          </h2>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all hover:gap-3"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-lg font-medium">Sift</Link>
              <div className="hidden md:flex items-center gap-6 text-sm text-neutral-500">
                <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How it works</a>
                <Link href="/terms" className="hover:text-neutral-900 transition-colors">Terms</Link>
              </div>
            </div>
            <p className="text-sm text-neutral-400">© 2025 Sift. All rights reserved.</p>
          </div>

          {/* Large Brand Name */}
          <div className="mt-16 overflow-hidden">
            <p className="font-display font-semibold text-[12vw] md:text-[10vw] leading-none text-neutral-100 text-center select-none">
              Sift
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
