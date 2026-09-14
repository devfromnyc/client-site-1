import { useState, useMemo, useRef } from 'react'
import content from '../data/site-content.json'

const PLACEHOLDER_EMAIL = 'Reforginglightsobriety@gmail.com'
const PLACEHOLDER_WHATSAPP = '15551234567'

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
]

function getNextSevenDays() {
  const days = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date)
  }
  return days
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatDateForEmail(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function EmailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ContactSection() {
  const { title, subtitle, formLabels } = content.contact
  const formRef = useRef(null)

  const availableDays = useMemo(() => getNextSevenDays(), [])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedDate: null,
    selectedTime: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedVia, setSubmittedVia] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, selectedDate: date }))
  }

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, selectedTime: time }))
  }

  const buildMessageBody = () => {
    const appointmentInfo = formData.selectedDate && formData.selectedTime
      ? `\n\nRequested Appointment:\n${formatDateForEmail(formData.selectedDate)} at ${formData.selectedTime}`
      : ''

    return `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
${appointmentInfo}

Message:
${formData.message}
    `.trim()
  }

  const validateForm = () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return false
    }
    return true
  }

  const handleEmailSubmit = () => {
    if (!validateForm()) return

    const subject = encodeURIComponent(`New Booking Request from ${formData.name}`)
    const body = encodeURIComponent(buildMessageBody())
    
    window.open(`mailto:${PLACEHOLDER_EMAIL}?subject=${subject}&body=${body}`, '_blank')
    
    setSubmittedVia('email')
    setIsSubmitted(true)
  }

  const handleWhatsAppSubmit = () => {
    if (!validateForm()) return

    const message = encodeURIComponent(`*New Booking Request*\n\n${buildMessageBody()}`)
    
    window.open(`https://wa.me/${PLACEHOLDER_WHATSAPP}?text=${message}`, '_blank')
    
    setSubmittedVia('whatsapp')
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-beige py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl font-medium text-ink md:text-4xl">Almost there!</h2>
          <p className="mt-4 text-ink/70">
            {submittedVia === 'email' 
              ? 'Your email app should have opened with your booking details. Just hit send!'
              : 'WhatsApp should have opened with your booking details. Just hit send!'
            }
          </p>
          <p className="mt-2 text-sm text-ink/50">
            We'll get back to you within 24-48 hours to confirm your appointment.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false)
              setSubmittedVia('')
              setFormData({ name: '', email: '', phone: '', message: '', selectedDate: null, selectedTime: '' })
            }}
            className="mt-8 rounded-md bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink/80"
          >
            Start over
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-beige py-20 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-ink/60">{subtitle}</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-ink md:text-5xl">{title}</h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="mb-6 font-serif text-xl font-medium text-ink">Select a Date & Time</h3>
            
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-2">
                {availableDays.map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`flex flex-col items-center rounded-lg border p-2 text-center transition ${
                      formData.selectedDate?.toDateString() === date.toDateString()
                        ? 'border-ink bg-ink text-white'
                        : 'border-ink/20 bg-white hover:border-ink/40'
                    }`}
                  >
                    <span className="text-[10px] font-medium uppercase">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-semibold">{date.getDate()}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.selectedDate && (
              <div className="animate-fadeIn">
                <p className="mb-3 text-sm text-ink/70">
                  Available times for {formatDate(formData.selectedDate)}:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`rounded-md border px-3 py-2 text-sm transition ${
                        formData.selectedTime === time
                          ? 'border-ink bg-ink text-white'
                          : 'border-ink/20 bg-white hover:border-ink/40'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.selectedDate && formData.selectedTime && (
              <div className="mt-6 rounded-lg bg-ink/5 p-4">
                <p className="text-sm font-medium text-ink">Your selected appointment:</p>
                <p className="mt-1 text-ink/70">
                  {formatDateForEmail(formData.selectedDate)} at {formData.selectedTime}
                </p>
              </div>
            )}
          </div>

          <form ref={formRef} className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <h3 className="font-serif text-xl font-medium text-ink">Your Information</h3>
            
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                {formLabels.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                {formLabels.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
                {formLabels.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
                {formLabels.message} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full resize-none rounded-md border border-ink/20 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                placeholder="Tell us about your goals and any questions you have..."
              />
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleEmailSubmit}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-ink px-6 py-4 text-sm font-medium text-white transition hover:bg-ink/80"
              >
                <EmailIcon />
                Book via Email
              </button>
              <button
                type="button"
                onClick={handleWhatsAppSubmit}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#22c55e]"
              >
                <WhatsAppIcon />
                Book via WhatsApp
              </button>
            </div>

            <p className="text-center text-xs text-ink/50">
              Choose your preferred method. We typically respond within 24-48 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
