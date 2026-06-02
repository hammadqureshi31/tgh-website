import * as React from 'react'

interface LeadNotificationEmailProps {
  name: string
  email: string
  phone?: string | null
  serviceInterest?: string | null
  message?: string | null
  submittedAt: string
}

export default function LeadNotificationEmail({
  name,
  email,
  phone,
  serviceInterest,
  message,
  submittedAt,
}: LeadNotificationEmailProps) {
  const formattedDate = new Date(submittedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>New Lead Submission</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Lead Information</h2>

          <div style={styles.field}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{name}</span>
          </div>

          <div style={styles.field}>
            <span style={styles.label}>Email:</span>
            <a href={`mailto:${email}`} style={styles.link}>
              {email}
            </a>
          </div>

          {phone && (
            <div style={styles.field}>
              <span style={styles.label}>Phone:</span>
              <a href={`tel:${phone}`} style={styles.link}>
                {phone}
              </a>
            </div>
          )}

          {serviceInterest && (
            <div style={styles.field}>
              <span style={styles.label}>Service Interest:</span>
              <span style={styles.value}>{serviceInterest}</span>
            </div>
          )}

          <div style={styles.field}>
            <span style={styles.label}>Submitted:</span>
            <span style={styles.value}>{formattedDate}</span>
          </div>
        </div>

        {message && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Message</h2>
            <div style={styles.messageBox}>{message}</div>
          </div>
        )}

        <div style={styles.section}>
          <a href={`mailto:${email}`} style={styles.button}>
            Reply to Lead
          </a>
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          The Gentry's House • Premium Grooming Experience
        </p>
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
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '8px',
  },
  field: {
    display: 'flex' as const,
    marginBottom: '12px',
    alignItems: 'flex-start' as const,
  },
  label: {
    fontWeight: '600',
    color: '#666666',
    marginRight: '8px',
    minWidth: '120px',
  },
  value: {
    color: '#1a1a1a',
    flex: '1',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  messageBox: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderLeft: '4px solid #1a1a1a',
    color: '#1a1a1a',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
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
