'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#F7F5F0', color: '#111110', fontFamily: 'monospace' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FCFBF8', border: '1px solid #DCD7CC', padding: '36px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '11px', color: '#B82328', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              CRITICAL SYSTEM EXCEPTION
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', margin: '12px 0 8px 0', letterSpacing: '-0.02em' }}>
              OUTSIDE APPAREL STUDIO
            </h1>
            <p style={{ fontSize: '12px', color: '#52504B', lineHeight: '1.6', margin: '0 0 20px 0', fontFamily: 'sans-serif' }}>
              A core runtime exception occurred. The studio integrity watchdog has quarantined the process.
            </p>
            {error.digest && (
              <p style={{ fontSize: '10px', color: '#888', margin: '0 0 16px 0' }}>
                Incident ID: {error.digest}
              </p>
            )}
            <button
              onClick={() => reset()}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                backgroundColor: '#111110',
                color: '#FCFBF8',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              RESTART SESSION
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
