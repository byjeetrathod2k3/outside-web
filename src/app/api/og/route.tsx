import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const drop = searchParams.get('drop') || '001';
    const title = searchParams.get('title') || 'BETTER DAYS AHEAD';
    const price = searchParams.get('price') || '₹ 2,400';
    const status = searchParams.get('status') || 'LIVE NOW';
    const gsm = searchParams.get('gsm') || '280 GSM COMBED ORGANIC COTTON';
    const edition = searchParams.get('edition') || '250 SERIALIZED PIECES';

    const isLive = status.toUpperCase().includes('LIVE');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#F7F5F0',
            padding: '60px',
            fontFamily: 'sans-serif',
            border: '12px solid #EDEAE2',
          }}
        >
          {/* Top Architectural Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #DCD7CC',
              paddingBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '4px solid #111110',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FCFBF8',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#B82328',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    letterSpacing: '0.25em',
                    color: '#111110',
                  }}
                >
                  OUTSIDE
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: '#52504B',
                  }}
                >
                  WEAR YOUR STORY // GUJARAT, INDIA (24)
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: isLive ? '#3F4E44' : '#B82328',
                color: '#FCFBF8',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.2em',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FCFBF8',
                }}
              />
              <span>{status.toUpperCase()}</span>
            </div>
          </div>

          {/* Center Main Presentation */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#B82328',
              }}
            >
              {`DROP ${drop} // SINGLE-DESIGN LIMITED EDITION`}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '64px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#111110',
                lineHeight: 1.05,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                color: '#52504B',
                letterSpacing: '0.05em',
              }}
            >
              {`${gsm} · ${edition} · WOMEN-FIRST BOXI TAILORING`}
            </div>
          </div>

          {/* Bottom Bar: Price, Origin & GST */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '2px solid #DCD7CC',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#111110',
                  letterSpacing: '0.05em',
                }}
              >
                {price}
              </span>
              <span
                style={{
                  display: 'flex',
                  fontSize: '13px',
                  color: '#52504B',
                  letterSpacing: '0.1em',
                }}
              >
                (INCL. 5% INDIAN APPAREL GST · HSN 61091000)
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#52504B',
              }}
            >
              AHMEDABAD ATELIER · WWW.OUTSIDE.IN
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, { status: 500 });
  }
}
