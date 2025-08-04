console.log("🔥 FRONTEND DEBUG FILE LOADED")
console.error("Test error for Console Ninja detection")
console.warn("Test warning for Console Ninja detection")
console.info("Test info for Console Ninja detection")

// Log environment info
console.log("=== FRONTEND DEBUG INFO ===")
console.log("Timestamp:", new Date().toISOString())
console.log("User Agent:", navigator.userAgent)
console.log("Location:", window.location.href)
console.log("Screen size:", window.screen.width + "x" + window.screen.height)

// Test a simple API call
setTimeout(() => {
	console.log("Testing delayed API call...")
	fetch("http://localhost:4000/patient/search?page=1&limit=1")
		.then((response) => {
			console.log("✅ API Response Status:", response.status)
			console.log("✅ API Response OK:", response.ok)
			return response.json()
		})
		.then((data) => {
			console.log("✅ API Response Data:", data)
		})
		.catch((error) => {
			console.error("❌ API Error:", error)
			console.error("❌ API Error Message:", error.message)
		})
}, 1000)

export {}
