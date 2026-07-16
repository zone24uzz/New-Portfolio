"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/i18n-context"
import { useSound } from "@/lib/sounds"
import { Code2, Palette, Database, GitBranch, Globe, Smartphone, Zap, Terminal, MapPin, Calendar, Briefcase } from "lucide-react"

const skills = [
  {
    titleKey: "about.skill1Title",
    descKey: "about.skill1Desc",
    icon: Code2,
    gradient: "from-blue-500 via-indigo-400 to-purple-500",
  },
  {
    titleKey: "about.skill2Title",
    descKey: "about.skill2Desc",
    icon: Palette,
    gradient: "from-rose-400 via-pink-500 to-purple-500",
  },
  {
    titleKey: "about.skill3Title",
    descKey: "about.skill3Desc",
    icon: Database,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    titleKey: "about.skill4Title",
    descKey: "about.skill4Desc",
    icon: GitBranch,
    gradient: "from-orange-400 via-red-500 to-rose-600",
  },
]

const tools = [
  { name: "React", icon: Code2 },
  { name: "Next.js", icon: Globe },
  { name: "TypeScript", icon: Terminal },
  { name: "Tailwind", icon: Palette },
  { name: "Node.js", icon: Zap },
  { name: "MongoDB", icon: Database },
  { name: "Git", icon: GitBranch },
  { name: "Figma", icon: Smartphone },
]

function SkillCard({ skill, index }: { skill: (typeof skills)[0]; index: number }) {
  const { t } = useI18n()
  const Icon = skill.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative group"
    >
      <div className={`glass-strong p-6 h-full border border-primary/10 relative overflow-hidden transition-all duration-300 hover:border-primary/30 ${
        index === 0 ? "rounded-2xl" : index === 1 ? "rounded-[18px]" : index === 2 ? "rounded-xl" : "rounded-[16px]"
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
        <div className="relative z-10">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.gradient} mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={18} className="text-white" />
          </div>
          <h3 className="text-base font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300">
            {t(skill.titleKey)}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(skill.descKey)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function ExperimentRoom() {
  const { t } = useI18n()
  return (
    <section id="experiments" className="relative min-h-screen py-28 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-accent/5 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-primary/5 blur-[60px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-5 px-3 py-1.5 rounded-full glass border border-accent/20">
            <span className="text-xs font-mono text-accent">{t("about.badge")}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">{t("about.title")}</span>{" "}
            <span className="text-accent">{t("about.titleHighlight")}</span>
          </h2>

          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("about.description")}
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="glass-strong rounded-2xl p-8 md:p-10 border border-primary/10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-primary/20">
                  <Image
                    src="/placeholder-user.jpg"
                    alt={t("profile.name")}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-2 rounded-2xl border border-primary/10 -z-10" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {t("profile.name")}
                </h3>
                <p className="text-sm font-medium text-accent mb-4">
                  {t("profile.role")}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground font-mono">
                    <MapPin size={12} className="text-primary/60" />
                    {t("about.location")}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground font-mono">
                    <Briefcase size={12} className="text-primary/60" />
                    {t("about.experience")}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground font-mono">
                    <Calendar size={12} className="text-primary/60" />
                    {t("about.startYear")}
                  </div>
                </div>

                <p className="text-foreground/70 leading-relaxed text-sm">
                  {t("about.bio")}
                </p>

                {/* Available badge */}
                <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400">{t("profile.available")}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {skills.map((skill, i) => (
            <SkillCard key={i} skill={skill} index={i} />
          ))}
        </div>

        {/* Tool stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-center text-sm font-mono text-muted-foreground/60 mb-6 uppercase tracking-widest">
            {t("about.toolstack")}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool, i) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-primary/10 bg-secondary/30 text-foreground/70 text-xs font-mono"
                >
                  <Icon size={14} className="text-primary/60" />
                  {tool.name}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
