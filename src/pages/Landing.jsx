import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Accessibility, Zap, Users, Globe } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Users size={32} />,
      title: 'Photorealistic Avatar',
      description: '100+ articulated bones for authentic hand shapes, body movement, and facial expressions.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Smooth Animations',
      description: 'Quaternion-based SLERP interpolation for natural, fluid motion without jank.'
    },
    {
      icon: <Accessibility size={32} />,
      title: 'Accessibility First',
      description: 'WCAG 2.1 AA compliant. Built for deaf and hard-of-hearing users.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Sign Language Ready',
      description: '30+ ISL gestures with expandable database. Designed for global localization.'
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-bg-base via-bg-base to-surface">

      {/* Navigation */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between backdrop-blur-md">
        <div className="text-xl font-bold text-text-primary">SignBridge</div>
        <a href="https://github.com/Amaresh-Saravanan/SignBridge" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-accent transition-colors">
          GitHub
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 max-w-6xl mx-auto">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-accent/30 bg-accent/5"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-accent">3D Avatar System</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-text-primary">
            Break Communication
            <br />
            <span className="bg-linear-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              Barriers with Sign Language
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            SignBridge is a photorealistic 3D avatar system that brings Indian Sign Language (ISL) to life. Smooth animations, realistic gestures, accessibility-first design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/hub')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-linear-to-r from-accent to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Enter Avatar Studio
              <ArrowRight size={20} />
            </motion.button>
            <a
              href="https://github.com/Amaresh-Saravanan/SignBridge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border bg-surface hover:bg-surface-elevated transition-colors text-text-primary font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why SignBridge?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built with accessibility at the core. Designed for the deaf and hard-of-hearing community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-border bg-bg-base hover:border-accent/50 transition-colors group"
              >
                <div className="text-accent mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">100+</div>
              <p className="text-text-secondary">Articulated Bones</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">30+</div>
              <p className="text-text-secondary">ISL Gestures</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">60 FPS</div>
              <p className="text-text-secondary">Desktop Performance</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Ready to Build?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Start developing realistic 3D avatars for sign language. The workspace is simple, powerful, and accessible.
          </p>
          <motion.button
            onClick={() => navigate('/hub')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-linear-to-r from-accent to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Enter Avatar Studio
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-text-primary mb-4">SignBridge</h4>
              <p className="text-sm text-text-secondary">
                Making sign language accessible to everyone through cutting-edge 3D technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="https://github.com/Amaresh-Saravanan/SignBridge" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a></li>
                <li><a href="https://github.com/Amaresh-Saravanan/SignBridge#readme" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Contact</h4>
              <p className="text-sm text-text-secondary">
                <a href="mailto:amareshsaravanan2617@gmail.com" className="hover:text-accent transition-colors">
                  amareshsaravanan2617@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-text-secondary">© 2026 SignBridge. Built for accessibility.</p>
            <p className="text-sm text-text-secondary">Made with ❤️ for the deaf community</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
