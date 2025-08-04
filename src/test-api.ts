// Test file - có thể xóa sau khi test
console.log("EMR Application test file loaded!")
console.log("Window object available:", typeof window !== "undefined")
console.log("Current environment:", process.env.NODE_ENV)

// Test API connection
if (typeof window !== "undefined") {
	console.log("Running in browser environment")
	console.log("Location:", window.location.href)

	// Test fetch to backend API
	const backendUrl = "http://localhost:4000/patient/search?page=1&limit=5"
	console.log("Testing API call to:", backendUrl)

	fetch(backendUrl, {
		headers: {
			Authorization: "Bearer test-token",
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			console.log("API Test Response Status:", response.status)
			console.log("API Test Response Headers:", response.headers)
			return response.json()
		})
		.then((data) => {
			console.log("API Test Response Data:", data)
		})
		.catch((error) => {
			console.error("API Test Error:", error)
			console.error("API Test Error Details:", {
				message: error.message,
				stack: error.stack,
			})
		})
} else {
	console.log("Running in Node.js environment (SSR)")
}
