import React, { useEffect, useState } from 'react'

interface MatchEvent {
  id: string
  minute: number
  eventType: string
  title: string
  description?: string
  team?: 'home' | 'away'
  isHighlight: boolean
  scoreAfter?: {
    home: number
    away: number
  }
  player?: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

interface LiveMatchTimelineProps {
  matchId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

const EVENT_ICONS: Record<string, string> = {
  goal: '⚽',
  assist: '🅰️',
  penalty: '🟨',
  save: '🧤',
  shot_on_goal: '🎯',
  shot_off_goal: '↗️',
  substitution: '🔄',
  period_start: '▶️',
  period_end: '⏸️',
  timeout: '⏱️',
  commentary: '💬',
}

const EVENT_COLORS: Record<string, string> = {
  goal: '#10b981', // green
  assist: '#3b82f6', // blue
  penalty: '#eab308', // yellow
  save: '#8b5cf6', // purple
  shot_on_goal: '#06b6d4', // cyan
  shot_off_goal: '#6b7280', // gray
  substitution: '#f59e0b', // amber
  period_start: '#22c55e', // lime
  period_end: '#ef4444', // red
  timeout: '#f97316', // orange
  commentary: '#64748b', // slate
}

export const LiveMatchTimeline: React.FC<LiveMatchTimelineProps> = ({
  matchId,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `/api/match-events?where[match][equals]=${matchId}&sort=-minute&limit=100`
      )
      if (response.ok) {
        const data = await response.json()
        setEvents(data.docs)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch match events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()

    if (autoRefresh) {
      const interval = setInterval(fetchEvents, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [matchId, autoRefresh, refreshInterval])

  if (loading) {
    return (
      <div className="live-match-timeline" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>⏳</div>
        <p>Chargement des événements...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="live-match-timeline" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>📋</div>
        <p>Aucun événement pour ce match</p>
      </div>
    )
  }

  return (
    <div className="live-match-timeline" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header with live indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#1e293b',
          color: 'white',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
          🔴 Match en direct
        </h2>
        <div style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
          Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid #1e293b',
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          borderRadius: '0 0 8px 8px',
        }}
      >
        {events.map((event, index) => {
          const icon = EVENT_ICONS[event.eventType] || '📌'
          const color = EVENT_COLORS[event.eventType] || '#64748b'
          const isGoal = event.eventType === 'goal'

          return (
            <div
              key={event.id}
              style={{
                position: 'relative',
                padding: '1.5rem',
                borderBottom: index < events.length - 1 ? '1px solid #e2e8f0' : 'none',
                backgroundColor: event.isHighlight ? '#fefce8' : 'white',
                transition: 'background-color 0.2s',
              }}
            >
              {/* Minute badge */}
              <div
                style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '1.5rem',
                  width: '3.5rem',
                  height: '3.5rem',
                  backgroundColor: color,
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <span style={{ fontSize: '1.125rem' }}>{event.minute}'</span>
              </div>

              {/* Event icon */}
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                }}
              >
                {icon}
              </div>

              {/* Event title */}
              <h3
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: isGoal ? '1.5rem' : '1.125rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {event.title}
                {event.isHighlight && ' ⭐'}
              </h3>

              {/* Score after goal */}
              {isGoal && event.scoreAfter && (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  {event.scoreAfter.home} - {event.scoreAfter.away}
                </div>
              )}

              {/* Player info */}
              {event.player && (
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: '0.5rem',
                  }}
                >
                  👤 {event.player.firstName} {event.player.lastName}
                </div>
              )}

              {/* Description */}
              {event.description && (
                <p
                  style={{
                    margin: '0',
                    color: '#475569',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {event.description}
                </p>
              )}

              {/* Team indicator */}
              {event.team && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: event.team === 'home' ? '#3b82f6' : '#ef4444',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {event.team === 'home' ? 'JOKERS' : 'ADVERSAIRE'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Auto-refresh indicator */}
      {autoRefresh && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            borderRadius: '6px',
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          🔄 Actualisation automatique toutes les {refreshInterval / 1000} secondes
        </div>
      )}
    </div>
  )
}
