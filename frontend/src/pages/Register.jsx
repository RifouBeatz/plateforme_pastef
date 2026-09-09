import { useEffect, useState } from 'react'
import logoPastef from '../assets/pastef-logo-section.png'
import rallyPhoto from '../assets/rally.jpg'
import rallyPhotoTwo from '../assets/rally-2.jpg'
import rallyPhotoThree from '../assets/rally-3.jpg'

const STATUTS = ['Sympathisant', 'Militant']
const PAYS = ['Pologne', 'République Tchèque', 'Slovaquie', 'Roumanie', 'Ukraine', 'Estonie', 'Lettonie', 'Lituanie']
const HERO_IMAGES = [rallyPhoto, rallyPhotoTwo, rallyPhotoThree]

const initialForm = {
  nom: '',
  prenoms: '',
  pays: '',
  ville: '',
  telephone: '',
  email: '',
  statut: '',
  consentement: false,
}

function Register() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue.')
        return
      }

      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setMessage('Impossible de contacter le serveur. Vérifie ta connexion.')
    }
  }

  return (
    <div className="public-page min-h-screen overflow-hidden bg-[#f6f4ef] text-[#10261b]">
      <header className="site-header sticky top-0 z-20 border-b border-white/20 bg-[#071d13]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-5 sm:px-8 sm:py-3">
          <a href="#accueil" className="shrink-0" aria-label="Retour à l'accueil">
            <img src={logoPastef} alt="PASTEF Les Patriotes - Section Pologne" className="h-10 w-auto max-w-[175px] object-contain sm:h-14 sm:max-w-[250px]" />
          </a>
          <a href="#adhesion" className="rounded-full bg-[#d8eeae] px-3.5 py-2 text-xs font-extrabold text-[#10261b] md:hidden">Adhérer</a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/75 md:flex" aria-label="Navigation principale">
            <a className="transition hover:text-white" href="#section">Notre section</a>
            <a className="transition hover:text-white" href="#adhesion">Adhérer</a>
            <a href="https://pastef.org/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#b7d88b]/40 bg-[#b7d88b]/10 px-4 py-2 text-xs text-[#e8f6d2] transition hover:bg-[#b7d88b]/20">Plateforme officielle ↗</a>
          </nav>
        </div>
      </header>

      <main id="accueil">
        <section className="hero-panel relative isolate flex min-h-[560px] items-end overflow-hidden bg-[#092016] text-white sm:min-h-[620px] lg:min-h-[680px]">
          {HERO_IMAGES.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Rassemblement des Patriotes"
              className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,24,15,.94)_0%,rgba(4,24,15,.68)_42%,rgba(4,24,15,.18)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(4,24,15,.9)_0%,transparent_55%)]" />
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-16 sm:gap-12 sm:px-8 sm:pb-16 sm:pt-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:pb-24">
            <div className="hero-copy max-w-3xl">
              <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#d8eeae] sm:mb-6 sm:text-xs sm:tracking-[.28em]"><span className="h-px w-8 bg-[#d8eeae] sm:w-10" />Section Pologne &amp; pays de juridiction</div>
              <h1 className="max-w-3xl text-4xl font-black leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">Une énergie patriotique qui traverse les frontières.</h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:mt-7 sm:text-lg sm:leading-7">Rejoignez les Sénégalaises et Sénégalais engagés en Pologne et pays de juridiction. Ensemble, faisons vivre une communauté utile, solidaire et tournée vers l’avenir.</p>
              <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4"><a href="#adhesion" className="inline-flex items-center gap-3 rounded-full bg-[#d8eeae] px-5 py-3 text-sm font-extrabold text-[#10261b] shadow-[0_10px_30px_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-white sm:px-6 sm:py-3.5">Rejoindre le mouvement <span aria-hidden="true">↓</span></a><a href="#section" className="text-sm font-semibold text-white/80 underline decoration-white/35 underline-offset-4 transition hover:text-white">Découvrir</a></div>
            </div>
            <div className="hidden justify-self-end lg:block"><div className="hero-note max-w-xs border-l border-white/40 pl-5 text-sm leading-6 text-white/75"><div className="mb-2 flex items-baseline gap-2 text-white"><span className="text-3xl font-black">08</span><span className="text-3xl font-black">pays</span></div>réunis autour d’une même vision, depuis l’Europe.</div></div>
          </div>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-7" aria-label="Images du hero">
            {HERO_IMAGES.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Afficher l'image ${index + 1}`}
                aria-current={index === heroIndex}
                onClick={() => setHeroIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === heroIndex ? 'w-9 bg-[#d8eeae]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </section>

        <section className="border-b border-[#d9dfd4] bg-white px-5 py-5 sm:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-[#476052]"><span className="text-xs font-bold uppercase tracking-[.18em] text-[#ce1126]">Notre section</span>{PAYS.map((pays) => <span key={pays} className="whitespace-nowrap">{pays}</span>)}</div></section>

        <section id="section" className="px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:gap-20"><div className="relative"><div className="absolute -left-4 -top-4 h-24 w-24 border-l-2 border-t-2 border-[#ce1126]" /><img src={rallyPhoto} alt="Les Patriotes réunis" className="relative aspect-[4/5] w-full max-w-md object-cover shadow-[18px_18px_0_#dce9d4] sm:aspect-[5/6]" /><div className="absolute -bottom-5 -right-3 bg-[#ce1126] px-5 py-4 text-white shadow-lg sm:-right-8"><span className="block text-2xl font-black">Patrie</span><span className="text-xs uppercase tracking-[.18em] text-white/80">Engagement · Fraternité</span></div></div><div><p className="section-kicker">Notre section</p><h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-[#123622] sm:text-5xl">Une communauté qui s’organise, s’entraide et agit.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#5c6e62]">PASTEF - Les Patriotes, Section Pologne rassemble et accompagne les militantes, militants et sympathisants sénégalais établis dans sa juridiction. Fidèle à la démocratie, au don de soi pour la Patrie, au panafricanisme, au travail, à l’éthique et à la fraternité, elle constitue un espace d’engagement, d’information et de solidarité.</p><div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3"><Value label="Mobiliser" /><Value label="Informer" /><Value label="Soutenir" /></div></div></div></section>

        <section id="adhesion" className="relative overflow-hidden bg-[#e8eee5] px-5 py-20 sm:px-8 sm:py-28"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-[#d8e5d1]" /><div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:gap-20"><div className="pt-2"><p className="section-kicker">Le prochain chapitre commence ici</p><h2 className="mt-4 text-4xl font-black leading-tight text-[#123622] sm:text-5xl">Faites entendre votre engagement.</h2><p className="mt-6 max-w-md text-base leading-7 text-[#5c6e62]">Quelques informations suffisent pour rejoindre notre mouvement et être tenu au courant des actions de la Section Pologne.</p><div className="mt-9 border-l-2 border-[#ce1126] pl-5 text-sm leading-6 text-[#476052]">L’email est facultatif. Vous pouvez vous inscrire avec un numéro de téléphone.</div></div><div className="form-shell bg-white p-6 shadow-[0_24px_70px_rgba(21,52,35,.13)] sm:p-9"><div className="mb-7 flex items-start justify-between gap-4 border-b border-[#e4e9e2] pb-6"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ce1126]">Inscription</p><h3 className="mt-2 text-2xl font-black text-[#123622]">Rejoindre la section</h3></div><span className="rounded-full bg-[#edf5e9] px-3 py-1.5 text-xs font-bold text-[#26854f]">Étape 01</span></div>{status === 'success' ? <div className="py-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f4df] text-3xl">✓</div><p className="mt-5 text-xl font-black text-[#168449]">Inscription réussie</p><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#5c6e62]">Merci de rejoindre le mouvement. La Section Pologne reviendra bientôt vers vous.</p><button onClick={() => setStatus('idle')} className="mt-7 text-sm font-bold text-[#168449] underline underline-offset-4">Inscrire une autre personne</button></div> : <form onSubmit={handleSubmit} className="space-y-5"><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Nom" name="nom" value={form.nom} onChange={handleChange} /><Field label="Prénom(s)" name="prenoms" value={form.prenoms} onChange={handleChange} /></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Ville" name="ville" value={form.ville} onChange={handleChange} /><SelectField label="Pays" name="pays" value={form.pays} onChange={handleChange} options={PAYS} /></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Email (optionnel)" name="email" type="email" value={form.email} onChange={handleChange} required={false} /><Field label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} /></div><SelectField label="Statut" name="statut" value={form.statut} onChange={handleChange} options={STATUTS} /><label className="flex items-start gap-3 text-xs leading-5 text-[#68786d]"><input type="checkbox" name="consentement" checked={form.consentement} onChange={handleChange} required className="mt-1 h-4 w-4 shrink-0 accent-[#168449]" /><span>J’accepte d’être contacté par un membre de la section.</span></label>{status === 'error' && <p className="rounded-lg bg-[#fff0ed] px-4 py-3 text-sm font-semibold text-[#b7281f]">{message}</p>}<button type="submit" disabled={status === 'submitting'} className="w-full rounded-full bg-[#168449] px-6 py-4 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(22,132,73,.22)] transition hover:-translate-y-0.5 hover:bg-[#0f6e3c] disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? 'Enregistrement en cours...' : 'Confirmer mon adhésion →'}</button></form>}</div></div></section>
      </main>

      <footer className="bg-[#071d13] px-5 py-10 text-white sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-lg font-black">PASTEF · Section Pologne</p><p className="mt-2 text-sm text-white/55">Au service de la Patrie, depuis l’Europe.</p></div><p className="text-xs text-white/40">© 2026 PASTEF Patriotes Sénégal</p></div></footer>
    </div>
  )
}

function Value({ label }) {
  return <div className="border border-[#dce5d9] bg-[#f7faf5] px-4 py-3 text-center text-sm font-bold text-[#286642]">{label}</div>
}

function Field({ label, name, value, onChange, type = 'text', required = true }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">{label} {required && <span className="text-[#ce1126]">*</span>}</span><input type={type} name={name} value={value} onChange={onChange} required={required} className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3.5 text-sm text-[#173723] outline-none transition placeholder:text-[#98a69b] focus:border-[#168449] focus:bg-white focus:ring-4 focus:ring-[#168449]/10" /></label>
}

function SelectField({ label, name, value, onChange, options }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.08em] text-[#52665a]">{label} <span className="text-[#ce1126]">*</span></span><select name={name} value={value} onChange={onChange} required className="form-control w-full border border-[#d6dfd6] bg-[#fbfcfa] px-4 py-3.5 text-sm text-[#173723] outline-none transition focus:border-[#168449] focus:bg-white focus:ring-4 focus:ring-[#168449]/10"><option value="">-- Sélectionner --</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}

export default Register
