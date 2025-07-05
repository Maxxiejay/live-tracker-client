## 🌍 App Name (Assumed): **LiveTrack**

We'll design it as a **responsive web app** (mobile-first), with the following primary flows:

* Tracker dashboard (create/view sessions)
* Rider interface (location sharing)
* Public viewer (view live location)
* Admin area (optional, for moderation & stats)

---

## 📄 Full UI Page Structure

| Page                        | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| 1. `Home / Landing Page`    | Overview of the app, how it works, signup/login           |
| 2. `Auth Pages`             | Login / Register / Forgot Password                        |
| 3. `Dashboard`              | Main tracker panel — create and monitor tracking sessions |
| 4. `New Tracking Session`   | Generate and share a new tracking link                    |
| 5. `Rider Location Share`   | Rider opens link and starts sharing location              |
| 6. `Public Viewer`          | Anyone with a code can view live location on a map        |
| 7. `Session History`        | Tracker sees list of active/inactive past sessions        |
| 8. `404 Page`               | Not found page for bad links                              |
| 9. `Admin Panel (Optional)` | View global usage, abuse reports, performance stats       |

---

## 🖼️ Page-by-Page UI Description

---

### 1. **🏠 Home / Landing Page**

> First impression. Brief, fast, and inviting.

* Hero section: "Track Anyone. Anytime. With Consent."
* “How It Works” steps:

  1. Create tracking link
  2. Rider accepts & shares location
  3. You and others track live on map
* CTA buttons: \[Create Tracking] \[Login] \[View a Code]
* Features:

  * No package required
  * Temporary session
  * Map-based real-time view
* Footer: About | Privacy | Support

---

### 2. **🔐 Auth Pages**

* **Login Page**:

  * Email + Password
  * Link to Register / Forgot Password

* **Register Page**:

  * Full name, email, password
  * Optional: phone number

* **Forgot Password Page**:

  * Email input
  * Send reset link

---

### 3. **📊 Dashboard Page (After Login)**

> This is the user's control center.

* **Header**: Logo + “Create Tracking” + Account Menu
* **Sections**:

  * Active Sessions (live)
  * Recently Ended Sessions
  * Button: “+ New Tracking Session”
* Each session shows:

  * Code
  * Status: “Active”, “Ended”
  * Time created
  * Button: “View”, “Copy Link”, “Delete”

---

### 4. **➕ New Tracking Session Page**

> Create a new session and get the code/link.

* Tracking code auto-generated
* “Generate Share Link” button
* Link preview + copy button
* QR code (optional)
* “Open Viewer” button
* Notes section (optional — e.g., “Bike dispatch to Ikeja”)

---

### 5. **📍 Rider Location Sharing Page**

> Rider receives link, opens, and shares location.

* Read-only view of tracking code
* “Start Sharing Location” button
* Map preview of current location
* Permission dialog
* “Stop Sharing” button
* UI should reassure rider:

  > “Only people with the code can see your location. You can stop anytime.”

---

### 6. **🗺️ Public Viewer Page**

> Anyone with the code can view the map.

* Map view (Google Maps or Leaflet)
* Rider name (if provided)
* “Last updated: 3s ago”
* Tracking path (optional — draw line)
* “Session ends in: 14 mins” (if expiring)
* Share/Copy button

---

### 7. **📁 Session History Page**

> Show all previous sessions.

* Table view:

  * Code
  * Created At
  * Duration
  * Status (Expired / Manual Stop)
  * View Map (Readonly)
* Search/filter options

---

### 8. **🚫 404 Page**

> Friendly “Oops! Code not found.” message

* Button: Go Home
* Support link

---

### 9. **🔧 Admin Panel (Optional)**

> For internal use.

* Total users
* Active sessions
* Top used locations (map heatmap)
* Reports of abuse (e.g., unauthorized tracking)

---

## 🧱 UI Components Overview

| Component           | Description                      |
| ------------------- | -------------------------------- |
| Navbar              | Sticky header with brand + nav   |
| Session Card        | Small box showing session info   |
| Code Generator      | Random alphanumeric ID           |
| Location Map        | Interactive map w/ live marker   |
| Notification/Alerts | Location denied, session expired |
| Loader/Spinner      | For map & GPS updates            |
| Modals              | Confirm stop, share link, etc.   |

---

## 📱 Mobile-Friendly UI Tips

* Fixed bottom nav (for riders)
* Larger buttons
* Zoomable map
* Real-time sync with limited animations
* Map pin drop effects for rider location

---

## ✨ Suggested Tech Stack for Frontend

| Layer        | Tech                                         |
| ------------ | -------------------------------------------- |
| UI Framework | Tailwind CSS                                 |
| JS Framework | Vue.js(composition, script setup)            |
| Icon Library | Lucide                                       |
| Maps         | Google Maps                                  |

---
