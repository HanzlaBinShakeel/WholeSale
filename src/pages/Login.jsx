import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { DEMO_CREDENTIALS } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  
  // Registration form
  const [regData, setRegData] = useState({
    shopName: '',
    buyerName: '',
    mobile: '',
    city: '',
    businessType: '',
    gst: ''
  })

  const { login, register, sendOTP } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (mobile.length !== 10) {
      showNotification('Please enter a valid 10-digit mobile number', 'error')
      return
    }
    
    const result = await sendOTP(mobile)
    if (result.success) {
      setOtpSent(true)
      showNotification('OTP sent successfully! Use demo OTP: ' + 
        (mobile === DEMO_CREDENTIALS.buyer.mobile ? DEMO_CREDENTIALS.buyer.otp : 
         mobile === DEMO_CREDENTIALS.admin.mobile ? DEMO_CREDENTIALS.admin.otp : '123456'), 
        'info', 5000)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!mobile || mobile.length !== 10) {
      showNotification('Please enter a valid mobile number', 'error')
      return
    }
    if (!otp || otp.length !== 6) {
      showNotification('Please enter 6-digit OTP', 'error')
      return
    }

    const result = login(mobile, otp)
    if (result.success) {
      showNotification('Login successful!', 'success')
      const redirectTo = location.state?.from || (result.user.role === 'admin' ? '/admin' : '/')
      navigate(redirectTo)
    } else {
      showNotification(result.error || 'Invalid credentials', 'error')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { shopName, buyerName, mobile, city, businessType } = regData
    
    if (!shopName || !buyerName || !mobile || !city || !businessType) {
      showNotification('Please fill all required fields', 'error')
      return
    }
    
    if (mobile.length !== 10) {
      showNotification('Please enter a valid 10-digit mobile number', 'error')
      return
    }

    const result = register(regData)
    if (result.success) {
      showNotification('Registration successful! You are auto-approved in demo mode.', 'success')
      navigate('/')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-large">MKT</div>
          <h1>Welcome Back</h1>
          <p>Login to place wholesale orders</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={otpSent ? handleLogin : handleSendOTP} className="login-form">
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, ''))
                  setOtpSent(false)
                }}
                required
              />
            </div>
            
            {!otpSent ? (
              <button type="submit" className="btn-primary full-width">
                Send OTP
              </button>
            ) : (
              <>
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                  <small>
                    Demo: Use {mobile === DEMO_CREDENTIALS.buyer.mobile ? DEMO_CREDENTIALS.buyer.otp : 
                              mobile === DEMO_CREDENTIALS.admin.mobile ? DEMO_CREDENTIALS.admin.otp : '123456'}
                  </small>
                </div>
                <button type="submit" className="btn-primary full-width">
                  Verify & Login
                </button>
                <button
                  type="button"
                  className="btn-secondary full-width"
                  onClick={() => {
                    setOtpSent(false)
                    setOtp('')
                  }}
                >
                  Change Mobile Number
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label>Shop Name *</label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={regData.shopName}
                onChange={(e) => setRegData({...regData, shopName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Buyer Name *</label>
              <input
                type="text"
                placeholder="Enter buyer name"
                value={regData.buyerName}
                onChange={(e) => setRegData({...regData, buyerName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                value={regData.mobile}
                onChange={(e) => setRegData({...regData, mobile: e.target.value.replace(/\D/g, '')})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                placeholder="Enter city"
                value={regData.city}
                onChange={(e) => setRegData({...regData, city: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Business Type *</label>
              <select
                value={regData.businessType}
                onChange={(e) => setRegData({...regData, businessType: e.target.value})}
                required
              >
                <option value="">Select business type</option>
                <option value="shop">Shop</option>
                <option value="tent">Tent</option>
                <option value="dealer">Dealer</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>GST Number (Optional)</label>
              <input
                type="text"
                placeholder="Enter GST number"
                value={regData.gst}
                onChange={(e) => setRegData({...regData, gst: e.target.value})}
              />
              <small>Can be added later</small>
            </div>
            
            <button type="submit" className="btn-primary full-width">
              Register & Send OTP
            </button>
            
            <p className="form-note">
              Your registration will be reviewed by admin. You'll be notified once approved.
              <br />
              <strong>Demo Mode:</strong> Registrations are auto-approved.
            </p>
          </form>
        )}

        <div className="demo-credentials">
          <h4>Demo Credentials</h4>
          <div className="demo-item">
            <strong>Admin:</strong> {DEMO_CREDENTIALS.admin.mobile} / OTP: 999999
          </div>
          <div className="demo-item">
            <strong>Buyers:</strong> 9876543210, 9876543211, 9876543213 / OTP: 123456
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
