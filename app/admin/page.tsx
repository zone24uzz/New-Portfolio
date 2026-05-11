"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, Zap } from "lucide-react"

// Admin password is stored in NEXT_PUBLIC_ADMIN_PASSWORD env var.
// For production, use a proper auth solution (NextAuth, Supabase Auth, etc.)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin2024"

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise((r) => setTimeout(r, 600)) // simulate auth delay

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("__fmp_admin", "1")
      router.push("/admin/dashboard")
    } else {
      setError("ACCESS DENIED — invalid credentials")
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #04040e 0%, #080818 50%, #04080e 100%)" }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), rgba(139,92,246,0.5), rgba(34,211,238,0.3), transparent)" }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="relative w-full max-w-sm mx-4 p-8 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(12,12,28,0.97), rgba(8,8,20,0.97))",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 0 60px rgba(139,92,246,0.12), 0 0 120px rgba(59,130,246,0.06)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1))",
              border: "1px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 30px rgba(139,92,246,0.2)",
            }}
            animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.2)", "0 0 40px rgba(139,92,246,0.35)", "0 0 20px rgba(139,92,246,0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock size={28} style={{ color: "rgba(139,92,246,0.9)" }} />
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="text-xl font-bold tracking-wider mb-1"
            style={{
              background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ADMIN ACCESS
          </h1>
          <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.6)" }}>
            // memory palace · analytics
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password field */}
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              autoComplete="current-password"
              className="w-full px-4 py-3 pr-10 rounded-xl text-sm font-mono outline-none transition-all"
              style={{
                background: "rgba(8,8,20,0.8)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "rgba(220,220,240,0.9)",
                caretColor: "rgba(139,92,246,0.9)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.25)")}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(139,92,246,0.5)" }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs font-mono text-center"
                style={{ color: "rgba(239,68,68,0.8)" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-mono font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
              border: "1px solid rgba(139,92,246,0.4)",
              color: "#fff",
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139,92,246,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <motion.div
                className="w-4 h-4 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "rgba(139,92,246,0.6)", borderTopColor: "transparent" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <Zap size={14} />
                Initialize Access
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
