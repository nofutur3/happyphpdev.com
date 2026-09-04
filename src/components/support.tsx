import * as React from "react"
import { QRCodeSVG } from "qrcode.react"

const REVOLUT_HANDLE = "jakub9sv"
const BTC_ADDRESS =
  "bc1qg66l3n9pqfrzgld4eyt7djtfnepk8lhcnsr74v6ptar3fgwktleq4chy28"

// TODO: add a Lightning banner once a static Lightning Address
// (name@walletprovider.com, e.g. from Wallet of Satoshi or Alby) is
// available -- a BOLT11 invoice can't be embedded here, it expires.
// TODO: add a coffee-tip banner (Ko-fi or Buy Me a Coffee) once decided.

const copyToClipboard = (value: string, onDone: () => void) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(value).then(onDone, () => {})
  }
}

const Support = () => {
  const [showBtcModal, setShowBtcModal] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!showBtcModal) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowBtcModal(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [showBtcModal])

  const handleCopy = () => {
    copyToClipboard(BTC_ADDRESS, () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <aside className="support" aria-label="Support the author">
      <p className="support-heading">// support</p>
      <p className="support-prompt">Enjoyed the post? A tip's always welcome.</p>
      <div className="support-banners">
        <a
          href={`https://revolut.me/${REVOLUT_HANDLE}`}
          className="support-banner"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="support-banner-glyph">R</span>
          <span className="support-banner-label">revolut</span>
        </a>
        <button
          type="button"
          className="support-banner"
          onClick={() => setShowBtcModal(true)}
        >
          <span className="support-banner-glyph">&#8383;</span>
          <span className="support-banner-label">bitcoin</span>
        </button>
      </div>

      {showBtcModal && (
        <div
          className="support-modal-backdrop"
          onClick={() => setShowBtcModal(false)}
        >
          <div
            className="support-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Bitcoin donation address"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              className="support-modal-close"
              onClick={() => setShowBtcModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <button
              type="button"
              className="support-modal-qr"
              onClick={handleCopy}
              aria-label="Copy Bitcoin address"
            >
              <QRCodeSVG value={`bitcoin:${BTC_ADDRESS}`} size={160} />
            </button>
            <button type="button" className="support-address" onClick={handleCopy}>
              {BTC_ADDRESS}
            </button>
            <p className="support-copy-status" aria-live="polite">
              {copied ? "copied to clipboard" : "click qr or address to copy"}
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Support
