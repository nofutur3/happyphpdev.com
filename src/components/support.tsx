import * as React from "react"
import { QRCodeSVG } from "qrcode.react"

const REVOLUT_HANDLE = "jakub9sv"
const BTC_ADDRESS =
  "bc1qg66l3n9pqfrzgld4eyt7djtfnepk8lhcnsr74v6ptar3fgwktleq4chy28"

// TODO: add a Lightning option once a static Lightning Address
// (name@walletprovider.com, e.g. from Wallet of Satoshi or Alby) is
// available -- a BOLT11 invoice can't be embedded here, it expires.
// TODO: add a coffee-tip link (Ko-fi or Buy Me a Coffee) once decided.

const Support = () => (
  <aside className="support" aria-label="Support the author">
    <p className="support-heading">// support</p>
    <div className="support-options">
      <div className="support-option">
        <a
          href={`https://revolut.me/${REVOLUT_HANDLE}`}
          className="support-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          revolut.me/{REVOLUT_HANDLE}
        </a>
      </div>
      <div className="support-option">
        <QRCodeSVG value={`bitcoin:${BTC_ADDRESS}`} size={112} />
        <code className="support-address">{BTC_ADDRESS}</code>
      </div>
    </div>
  </aside>
)

export default Support
