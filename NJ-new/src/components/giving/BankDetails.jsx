import React from 'react'

export default function BankDetails() {
  return (
    <section className="bank-details">
      <div className="bank-container">
        <h2>Banking Details</h2>
        <p className="bank-intro">
          You may also give via direct bank transfer or mobile payment.
          Please use the correct reference when making your contribution.
        </p>

        <div className="bank-grid">
          {/* Bank Account */}
          <div className="bank-card">
            <h3>Bank Transfer</h3>
            <span className="divider"></span>

            <ul>
              <li><strong>Bank:</strong> First National Bank (FNB)</li>
              <li><strong>Account Name:</strong> New Jerusalem of All Nations</li>
              <li><strong>Account Number:</strong> 6284 123 456</li>
              <li><strong>Branch Code:</strong> 250655</li>
              <li><strong>Account Type:</strong> Cheque Account</li>
              <li><strong>Reference:</strong> Tithe / Offering</li>
            </ul>
          </div>

          {/* Mobile Payment */}
          <div className="bank-card">
            <h3>Mobile Payment</h3>
            <span className="divider"></span>

            <ul>
              <li><strong>Service:</strong> PayShap / eWallet</li>
              <li><strong>Cell Number:</strong> 071 234 5678</li>
              <li><strong>Account Name:</strong> NJOAN Giving</li>
              <li><strong>Purpose:</strong> Tithes &amp; Offerings</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
