import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface CharPeopleProps {
  titulo: string
  subtitulo: string
  imagem?: string
  popupImages?: string[]
}

const fallbackImage = '/people/generic.jpg'

function CharPeople({ titulo, subtitulo, imagem, popupImages }: CharPeopleProps) {
  const [imageSrc, setImageSrc] = useState(imagem || fallbackImage)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)

  function handleImageError() {
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage)
    }
  }

  const hasPopups = popupImages && popupImages.length > 0

  return (
    <motion.article
      className="char-people-card"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false)
        setIsImageHovered(false)
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
      }}
    >
      <AnimatePresence>
        {isCardHovered && hasPopups && !isImageHovered && (
          <motion.div
            className="char-people-popups"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            {popupImages.map((popupImage, index) => (
              <motion.img
                key={popupImage}
                src={popupImage}
                alt={`Imagem especial ${index + 1} de ${titulo}`}
                className={`char-people-popup-image popup-${index + 1}`}
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.92 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.08,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="char-people-image-wrapper"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        animate={
          isImageHovered
            ? {
                inset: 0,
                width: '100%',
                height: '100%',
                borderRadius: 32,
              }
            : {
                inset: '18px auto auto 18px',
                width: 'calc(100% - 36px)',
                height: 'auto',
                borderRadius: 26,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 24,
        }}
      >
        <img
          src={imageSrc}
          alt={titulo}
          className="char-people-image"
          onError={handleImageError}
        />
      </motion.div>

      <motion.div
        className="char-people-content"
        animate={{
          opacity: isImageHovered ? 0 : 1,
          y: isImageHovered ? 18 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <h3>{titulo}</h3>
        <p>{subtitulo}</p>
      </motion.div>
    </motion.article>
  )
}

export default CharPeople