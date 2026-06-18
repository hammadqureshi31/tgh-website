import * as React from 'react'

interface CareerApplicationConfirmationEmailProps {
  fullName: string
  positionApplied: string
  preferredLocation: string
}

export default function CareerApplicationConfirmationEmail({
  fullName,
  positionApplied,
  preferredLocation,
}: CareerApplicationConfirmationEmailProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Application Received</h1>
      </div>

      <div style={styles.content}>
        <p style={styles.paragraph}>Hi {fullName.split(' ')[0]},</p>
        <p style={styles.paragraph}>
          Thank you for applying for the <strong>{positionApplied}</strong> role at our{' '}
          <strong>{preferredLocation}</strong> location. Our hiring team has received your
          application and will review it shortly.
        </p>
        <p style={styles.paragraph}>
          If your experience is a fit, we&apos;ll reach out to schedule a conversation. We
          appreciate your interest in joining The Gentry House team.
        </p>
        <p style={styles.paragraph}>— The Gentry House Hiring Team</p>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>The Gentry's House • Premium Grooming Experience</p>
        <p style={styles.footerText}>
          <a href="https://thegentryhouse.com" style={styles.link}>
            Visit our website
          </a>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: '32px 24px',
    textAlign: 'center' as const,
  },
  title: {
    margin: '0',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: '"Playfair Display", serif',
  },
  content: {
    padding: '32px 24px',
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#1a1a1a',
    margin: '0 0 16px 0',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#f9f9f9',
    padding: '24px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e0e0e0',
  },
  footerText: {
    margin: '8px 0',
    fontSize: '13px',
    color: '#666666',
  },
}
