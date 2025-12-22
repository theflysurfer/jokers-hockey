import React, { useCallback } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

interface PhotoReplacementFieldProps {
  path: string
  label?: string
  required?: boolean
}

export const PhotoReplacementField: React.FC<PhotoReplacementFieldProps> = ({
  path,
  label = 'Photo',
  required = false,
}) => {
  const { value, setValue } = useField<string>({ path })
  const firstName = useFormFields(([fields]) => fields.firstName?.value as string)
  const lastName = useFormFields(([fields]) => fields.lastName?.value as string)

  // Generate UI Avatars API URL for current player
  const aiAvatarUrl = React.useMemo(() => {
    if (!firstName || !lastName) return null
    const name = `${firstName}+${lastName}`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=random&color=fff&bold=true`
  }, [firstName, lastName])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // In Payload, we need to upload the file to the media collection
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', `Photo de ${firstName} ${lastName}`)

      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        if (response.ok) {
          const uploadedMedia = await response.json()
          setValue(uploadedMedia.doc.id)
        } else {
          console.error('Failed to upload photo')
          alert('Erreur lors de l\'upload de la photo')
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Erreur lors de l\'upload de la photo')
      }
    },
    [firstName, lastName, setValue]
  )

  // Get current photo URL from media collection
  const [currentPhotoUrl, setCurrentPhotoUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (value) {
      fetch(`/api/media/${value}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            setCurrentPhotoUrl(data.url)
          }
        })
        .catch(err => console.error('Failed to load current photo:', err))
    } else {
      setCurrentPhotoUrl(null)
    }
  }, [value])

  return (
    <div className="field-type photo-replacement-field" style={{ marginBottom: '2rem' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </label>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#f8fafc'
      }}>
        {/* Left: Current AI Avatar or Uploaded Photo */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#64748b' }}>
            {currentPhotoUrl ? 'Photo actuelle' : 'Avatar IA généré'}
          </h3>
          <div style={{
            border: '2px solid #cbd5e1',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentPhotoUrl ? (
              <img
                src={currentPhotoUrl}
                alt={`Photo de ${firstName} ${lastName}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : aiAvatarUrl ? (
              <img
                src={aiAvatarUrl}
                alt={`Avatar IA de ${firstName} ${lastName}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Aucune photo
              </div>
            )}
          </div>
          {currentPhotoUrl && (
            <button
              type="button"
              onClick={() => setValue(null)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                color: '#ef4444',
                backgroundColor: '#fff',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Supprimer la photo
            </button>
          )}
        </div>

        {/* Right: Upload Interface */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#64748b' }}>
            Remplacer par une photo réelle
          </h3>
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id={`photo-upload-${path}`}
            />
            <label
              htmlFor={`photo-upload-${path}`}
              style={{
                cursor: 'pointer',
                display: 'block'
              }}
            >
              <svg
                style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#94a3b8' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p style={{ marginBottom: '0.5rem', color: '#334155', fontWeight: 500 }}>
                Cliquez pour uploader une photo
              </p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                PNG, JPG, WEBP jusqu'à 10MB
              </p>
            </label>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
              💡 <strong>Astuce:</strong> Cette interface simplifie le remplacement des avatars IA par de vraies photos des joueurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
