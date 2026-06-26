function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-ink"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function ImageTextSection({
  id,
  imagePosition = 'left',
  imageSrc,
  imageAlt,
  title,
  body,
  listLabel,
  listItems,
}) {
  const imageBlock = (
    <div className="relative h-64 w-full overflow-hidden md:h-full md:min-h-[50vh]">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )

  const textBlock = (
    <div className="flex flex-col justify-center px-8 py-16 md:px-12 lg:px-16 lg:py-24">
      <h2 className="font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
        {title}
      </h2>
      <p className="mt-6 text-base leading-relaxed text-ink/70 md:text-lg">{body}</p>
      <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-ink/50">
        {listLabel}
      </p>
      <ul className="mt-4 space-y-3">
        {listItems.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <CheckIcon />
            <span className="text-ink/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section id={id} className="min-h-screen bg-beige">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {imagePosition === 'left' ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  )
}
