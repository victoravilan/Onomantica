import React from "react"

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#0b1220",
      color: "#e5e7eb",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    }}>
      <div style={{padding: 24, borderRadius: 16, background: "#111827", border: "1px solid #1f2937"}}>
        <h1 style={{margin: 0, fontSize: 24}}>🚀 Onomántica</h1>
        <p style={{marginTop: 8}}>Si ves esto, React está montando bien.</p>
      </div>
    </div>
  )
}
