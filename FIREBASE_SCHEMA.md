# Firebase Configuration for Payment Flow

## 📊 Firestore Collections & Schema

### 1. **users** Collection
Stores user profile and account information.

```
/users/{uid}
├── uid: string (user ID from Firebase Auth)
├── name: string
├── email: string
├── createdAt: timestamp
├── points: number (default: 0)
├── totalSpent: number (default: 0)
├── purchaseCount: number (default: 0)
└── updatedAt: timestamp
```

**Example Document:**
```json
{
  "uid": "user123abc",
  "name": "Wahid Khan",
  "email": "wahid@example.com",
  "createdAt": "2026-08-18T10:30:00Z",
  "points": 80,
  "totalSpent": 1590,
  "purchaseCount": 8,
  "updatedAt": "2026-08-18T14:45:00Z"
}
```

---

### 2. **orders** Collection
Stores all purchase orders created by users.

```
/orders/{orderId}
├── orderId: string (unique order ID)
├── userId: string (reference to users/{uid})
├── email: string (user's email)
├── amount: number (price in INR)
├── product: string (e.g., "Paneer Salad")
├── status: string ("pending" | "completed" | "failed" | "cancelled")
├── paymentMethod: string ("upi" | "card" | "netbanking" | "wallet" | "pending")
├── createdAt: timestamp
├── updatedAt: timestamp
└── metadata: object (any additional data)
    └── qrCode: string (order ID for QR display)
    └── description: string
```

**Example Document:**
```json
{
  "orderId": "order_1723994400000",
  "userId": "user123abc",
  "email": "wahid@example.com",
  "amount": 199,
  "product": "Paneer Salad",
  "status": "pending",
  "paymentMethod": "upi",
  "createdAt": "2026-08-18T15:00:00Z",
  "updatedAt": "2026-08-18T15:00:00Z",
  "metadata": {
    "qrCode": "order_1723994400000",
    "description": "Fresh vegetables, grilled paneer and a light dressing"
  }
}
```

---

### 3. **payments** Collection
Stores payment transaction records from Razorpay.

```
/payments/{paymentId}
├── paymentId: string (Razorpay payment ID)
├── orderId: string (reference to orders/{orderId})
├── userId: string (reference to users/{uid})
├── email: string
├── amount: number (in paise from Razorpay)
├── amountInRupees: number (converted to INR)
├── method: string (payment method used)
├── status: string ("captured" | "authorized" | "failed" | "refunded")
├── razorpayOrderId: string (Razorpay order ID)
├── razorpaySignature: string (for verification)
├── createdAt: timestamp
├── updatedAt: timestamp
└── metadata: object
    └── description: string
    └── notes: object (Razorpay notes)
```

**Example Document:**
```json
{
  "paymentId": "pay_1Ia8JVGg8VeeTF",
  "orderId": "order_1723994400000",
  "userId": "user123abc",
  "email": "wahid@example.com",
  "amount": 19900,
  "amountInRupees": 199,
  "method": "upi",
  "status": "captured",
  "razorpayOrderId": "order_1Ia8JVFg8VeeTF",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
  "createdAt": "2026-08-18T15:00:30Z",
  "updatedAt": "2026-08-18T15:00:30Z",
  "metadata": {
    "description": "Payment for Paneer Salad",
    "notes": { "product": "Paneer Salad" }
  }
}
```

---

### 4. **rewardLogs** Collection (Optional)
Tracks reward points history for auditing.

```
/rewardLogs/{logId}
├── logId: string (unique log ID)
├── userId: string (reference to users/{uid})
├── orderId: string (reference to orders/{orderId})
├── pointsEarned: number
├── previousBalance: number
├── newBalance: number
├── reason: string ("purchase" | "refund" | "bonus" | "adjustment")
├── createdAt: timestamp
```

**Example Document:**
```json
{
  "logId": "log_1723994430000",
  "userId": "user123abc",
  "orderId": "order_1723994400000",
  "pointsEarned": 10,
  "previousBalance": 70,
  "newBalance": 80,
  "reason": "purchase",
  "createdAt": "2026-08-18T15:00:30Z"
}
```

---

## 🔄 Complete Payment Flow

### Step-by-Step Sequence:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER LOGS IN                                             │
│    ├─ Email + Password                                      │
│    ├─ Firebase Auth validates credentials                   │
│    ├─ User stored in /users/{uid} collection               │
│    └─ User redirected to Dashboard                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. USER CLICKS "BUY SALAD"                                  │
│    ├─ Check if user is logged in                            │
│    ├─ If not logged in → Redirect to /login                 │
│    ├─ If logged in → Show PaymentModal                      │
│    └─ Modal displays payment methods                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. USER SELECTS PAYMENT METHOD                              │
│    ├─ Frontend generates unique orderId                     │
│    ├─ Frontend creates order in /orders/{orderId}           │
│    │  └─ Status: "pending"                                  │
│    │  └─ paymentMethod: "selected_method"                   │
│    ├─ Display QR code with orderId                          │
│    └─ Prepare Razorpay checkout                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. RAZORPAY CHECKOUT OPENS                                  │
│    ├─ Send order details to Razorpay:                       │
│    │  ├─ amount: 199 (in rupees)                            │
│    │  ├─ orderId: "order_1723994400000"                     │
│    │  ├─ email: "wahid@example.com"                         │
│    │  ├─ name: "Wahid Khan"                                 │
│    │  ├─ paymentMethod: "upi|card|netbanking|wallet"        │
│    │  └─ description: "Paneer Salad"                        │
│    └─ Razorpay SDK loads checkout form                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. USER COMPLETES PAYMENT                                   │
│    ├─ User scans QR code (UPI) OR                           │
│    ├─ User enters card details OR                           │
│    ├─ User selects NetBanking OR                            │
│    ├─ User uses Wallet                                      │
│    └─ Razorpay processes payment                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. RAZORPAY CALLBACK (Frontend)                             │
│    ├─ Razorpay returns paymentId & signature                │
│    ├─ Status: "captured" (payment successful)               │
│    ├─ Create payment record in /payments/{paymentId}        │
│    ├─ Update order status to "completed"                    │
│    └─ Show success modal                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. UPDATE USER REWARDS                                      │
│    ├─ Get current user points from /users/{uid}             │
│    ├─ Add 10 points for this purchase                       │
│    ├─ Update /users/{uid} with:                             │
│    │  ├─ points: newPoints                                  │
│    │  ├─ totalSpent: totalSpent + 199                       │
│    │  ├─ purchaseCount: purchaseCount + 1                   │
│    │  └─ updatedAt: current timestamp                       │
│    └─ Create log in /rewardLogs/{logId} (optional)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. SUCCESS STATE                                            │
│    ├─ Show checkmark icon                                   │
│    ├─ Display "Payment Successful"                          │
│    ├─ Show "₹199 charged | +10 points awarded"              │
│    ├─ After 2 seconds, close modal                          │
│    └─ Reload page to show updated points                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Error Handling

### Error Cases:

```
┌─────────────────────────────────────────────────────────────┐
│ PAYMENT FAILED                                              │
│    ├─ Update order status to "failed"                       │
│    ├─ Do NOT award points                                   │
│    ├─ Show error message with reason                        │
│    ├─ Provide "Retry" button                                │
│    └─ Allow user to cancel                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DUPLICATE PAYMENT PROTECTION                                │
│    ├─ Check if orderId already exists in /payments          │
│    ├─ If exists → Ignore duplicate                          │
│    ├─ Only process first successful payment                 │
│    └─ Log duplicate attempt                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SIGNATURE VERIFICATION (Backend/Cloud Function)             │
│    ├─ Receive paymentId, orderId, signature from frontend   │
│    ├─ Fetch payment details from Razorpay API               │
│    ├─ Verify signature: HMAC(orderId + paymentId + secret)  │
│    ├─ If valid → Update Firestore & award points           │
│    ├─ If invalid → Log security alert                       │
│    └─ Return success/failure to frontend                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Users can only read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId || 
                            request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only read their own payments
    match /payments/{paymentId} {
      allow read: if request.auth.uid == resource.data.userId;
    }
    
    // Only server (Cloud Functions) can write to payments
    match /payments/{paymentId} {
      allow write: if request.auth.token.firebase.sign_in_provider == 'custom';
    }
    
    // Reward logs are read-only for users
    match /rewardLogs/{logId} {
      allow read: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🚀 Implementation Checklist

- [ ] Create Firestore collections in Firebase Console
- [ ] Set up Security Rules in Firebase Console
- [ ] Create backend verification function (Node.js/Python)
- [ ] Add payment verification logic
- [ ] Test payment flow in development
- [ ] Deploy to production
- [ ] Monitor Firestore usage and optimize indexes if needed
