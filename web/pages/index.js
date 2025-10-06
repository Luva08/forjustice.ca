export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Welcome to forjustice.ca</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        Access affordable legal information and document generation for Canadians.
      </p>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Our Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Legal Questions</h3>
            <p>Get up to 3 legal questions answered for $99</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Document Generation</h3>
            <p>Generate court documents for $399 after receiving answers</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Multi-Language Support</h3>
            <p>Available in the 10 most spoken languages in Canada</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Areas of Law (Ontario MVP)</h2>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          <li>Administrative Law</li>
          <li>Landlord and Tenant Board</li>
          <li>Immigration Law</li>
          <li>Human Rights Law</li>
          <li>Family Law</li>
          <li>Criminal Law</li>
          <li>Wills and Estates</li>
          <li>Municipal Law</li>
        </ul>
      </section>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/auth" style={{ padding: '1rem 2rem', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '1.1rem' }}>
          Get Started
        </a>
      </div>
    </main>
  );
}
