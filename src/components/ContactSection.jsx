import { useState, useMemo } from 'react'
import content from '../data/site-content.json'

const PLACEHOLDER_EMAIL = 'bookings@breathworkguru.com'

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

export default function ContactSection() {
  const { title, subtitle, formLabels } = content.contact

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const appointmentInfo = formData.selectedDate && formData.selectedTime
      ? `\n\nRequested Appointment:\n${formatDateForEmail(formData.selectedDate)} at ${formData.selectedTime}`
      : ''

    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
${appointmentInfo}

Message:
${formData.message}
    `.trim()

    console.log('Form submission:', {
      to: PLACEHOLDER_EMAIL,
      subject: `New Booking Request from ${formData.name}`,
      body: emailBody,
      formData
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
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
          <h2 className="font-serif text-3xl font-medium text-ink md:text-4xl">Thank you!</h2>
          <p className="mt-4 text-ink/70">
            Your message has been sent. We'll get back to you within 24-48 hours to confirm your appointment.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', phone: '', message: '', selectedDate: null, selectedTime: '' })
            }}
            className="mt-8 rounded-md bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink/80"
          >
            Send another message
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-md bg-ink px-8 py-4 text-sm font-medium text-white transition hover:bg-ink/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message & Book Appointment'}
            </button>

            <p className="text-xs text-ink/50">
              Your information will be sent to {PLACEHOLDER_EMAIL}. We typically respond within 24-48 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
