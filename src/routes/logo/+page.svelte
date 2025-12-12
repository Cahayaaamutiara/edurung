<script lang="ts">
  import EduRuangLogo from '$lib/components/EduRuangLogo.svelte';
</script>

<svelte:head>
  <title>Edu Ruang Logo Showcase</title>
</svelte:head>

<div class="container">
  <header class="header">
    <h1>Edu Ruang Logo Showcase</h1>
    <p class="subtitle">Modern and minimalist educational app logo with book, technology, and room elements</p>
  </header>

  <!-- Logo Variants -->
  <section class="logo-variants">
    <!-- Icon Version -->
    <div class="variant-card">
      <h2>Icon Version</h2>
      <div class="logo-display">
        <EduRuangLogo variant="icon" size={80} />
      </div>
      <p class="description">Perfect for app icons and favicons</p>
    </div>

    <!-- Default Version -->
    <div class="variant-card">
      <h2>Default Version</h2>
      <div class="logo-display">
        <EduRuangLogo variant="default" size={80} />
      </div>
      <p class="description">Stacked layout with text below</p>
    </div>

    <!-- Horizontal Version -->
    <div class="variant-card">
      <h2>Horizontal Version</h2>
      <div class="logo-display">
        <EduRuangLogo variant="horizontal" size={60} />
      </div>
      <p class="description">Side-by-side layout for headers</p>
    </div>
  </section>

  <!-- Size Variations -->
  <section class="size-section">
    <h2>Size Variations</h2>
    <div class="size-display">
      <div class="size-item">
        <EduRuangLogo variant="icon" size={32} />
        <p>32px</p>
      </div>
      <div class="size-item">
        <EduRuangLogo variant="icon" size={48} />
        <p>48px</p>
      </div>
      <div class="size-item">
        <EduRuangLogo variant="icon" size={64} />
        <p>64px</p>
      </div>
      <div class="size-item">
        <EduRuangLogo variant="icon" size={96} />
        <p>96px</p>
      </div>
      <div class="size-item">
        <EduRuangLogo variant="icon" size={128} />
        <p>128px</p>
      </div>
    </div>
  </section>

  <!-- Design Elements -->
  <section class="elements-section">
    <h2>Design Elements</h2>
    <div class="elements-grid">
      <div class="element-card">
        <div class="element-icon book-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
            <rect x="8" y="6" width="16" height="20" rx="2"/>
            <line x1="16" y1="6" x2="16" y2="26" stroke="#1e40af" stroke-width="1"/>
          </svg>
        </div>
        <h3>Book Element</h3>
        <p>Represents education and learning</p>
      </div>
      
      <div class="element-card">
        <div class="element-icon tech-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
            <circle cx="12" cy="12" r="2"/>
            <circle cx="20" cy="16" r="1.5"/>
            <line x1="12" y1="12" x2="20" y2="16" stroke="white" stroke-width="1"/>
          </svg>
        </div>
        <h3>Technology</h3>
        <p>Circuit patterns and pixels for digital learning</p>
      </div>
      
      <div class="element-card">
        <div class="element-icon room-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" stroke-width="2">
            <rect x="4" y="4" width="24" height="24" rx="4"/>
            <rect x="6" y="6" width="20" height="20" rx="2"/>
          </svg>
        </div>
        <h3>Room Frame</h3>
        <p>Window-like frame representing learning space</p>
      </div>
    </div>
  </section>

  <!-- Color Palette -->
  <section class="color-section">
    <h2>Color Palette</h2>
    <div class="color-palette">
      <div class="color-item">
        <div class="color-swatch" style="background-color: var(--primary-blue);"></div>
        <p class="color-code">var(--primary-blue)</p>
        <p class="color-name">Primary Blue</p>
      </div>
      <div class="color-item">
        <div class="color-swatch" style="background-color: #60a5fa;"></div>
        <p class="color-code">#60a5fa</p>
        <p class="color-name">Light Blue</p>
      </div>
      <div class="color-item">
        <div class="color-swatch" style="background-color: var(--primary-cyan);"></div>
        <p class="color-code">var(--primary-cyan)</p>
        <p class="color-name">Primary Cyan</p>
      </div>
      <div class="color-item">
        <div class="color-swatch" style="background-color: #22d3ee;"></div>
        <p class="color-code">#22d3ee</p>
        <p class="color-name">Bright Cyan</p>
      </div>
      <div class="color-item">
        <div class="color-swatch background-color" style="background-color: #f0f9ff; border: 2px solid var(--border-medium);"></div>
        <p class="color-code">#f0f9ff</p>
        <p class="color-name">Background</p>
      </div>
    </div>
  </section>

  <!-- Usage Examples -->
  <section class="usage-section">
    <h2>Usage Examples</h2>
    
    <!-- Header Example -->
    <div class="usage-example">
      <h3>Navigation Header</h3>
      <div class="demo-header">
        <nav class="demo-nav">
          <EduRuangLogo variant="horizontal" size={40} />
          <div class="nav-links">
            <button type="button">Courses</button>
            <button type="button">Profile</button>
            <button type="button">Settings</button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Mobile App Icon -->
    <div class="usage-example">
      <h3>Mobile App Icon</h3>
      <div class="app-icons">
        <div class="app-icon dark">
          <EduRuangLogo variant="icon" size={60} />
        </div>
        <div class="app-icon light">
          <EduRuangLogo variant="icon" size={60} />
        </div>
        <div class="app-icon gradient">
          <EduRuangLogo variant="icon" size={60} />
        </div>
      </div>
    </div>

    <!-- Splash Screen -->
    <div class="usage-example">
      <h3>Splash Screen</h3>
      <div class="splash-screen">
        <EduRuangLogo variant="default" size={120} />
        <p class="splash-text">Welcome to your learning space</p>
      </div>
    </div>
  </section>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-8);
  }
  
  .header {
    text-align: center;
    margin-bottom: var(--space-12);
  }
  
  .header h1 {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: var(--text-lg);
  }
  
  .logo-variants {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-8);
    margin-bottom: var(--space-12);
  }
  
  .variant-card {
    background-color: var(--bg-primary);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-light);
    text-align: center;
  }
  
  .variant-card h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-4);
  }
  
  .logo-display {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-4);
  }
  
  .description {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }
  
  .size-section {
    background-color: var(--bg-tertiary);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-12);
  }
  
  .size-section h2 {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    text-align: center;
    margin-bottom: var(--space-6);
  }
  
  .size-display {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: var(--space-8);
    flex-wrap: wrap;
  }
  
  .size-item {
    text-align: center;
  }
  
  .size-item p {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    margin-top: var(--space-2);
  }
  
  .elements-section {
    background-color: var(--bg-primary);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    margin-bottom: var(--space-12);
  }
  
  .elements-section h2 {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    text-align: center;
    margin-bottom: var(--space-6);
  }
  
  .elements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-6);
  }
  
  .element-card {
    text-align: center;
    padding: var(--space-4);
  }
  
  .element-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto var(--space-3);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .book-icon {
    background-color: var(--primary-blue);
  }
  
  .tech-icon {
    background: linear-gradient(135deg, var(--primary-cyan), #22d3ee);
  }
  
  .room-icon {
    background-color: #60a5fa;
  }
  
  .element-card h3 {
    font-weight: var(--font-semibold);
    color: var(--primary-blue);
    margin-bottom: var(--space-2);
  }
  
  .element-card p {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }
  
  .color-section {
    background-color: var(--bg-primary);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    margin-bottom: var(--space-12);
  }
  
  .color-section h2 {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    text-align: center;
    margin-bottom: var(--space-6);
  }
  
  .color-palette {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  
  .color-item {
    text-align: center;
  }
  
  .color-swatch {
    width: 5rem;
    height: 5rem;
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-2);
  }
  
  .color-code {
    font-size: var(--text-sm);
    font-family: 'Courier New', monospace;
    margin-bottom: var(--space-1);
  }
  
  .color-name {
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }
  
  .usage-section {
    background-color: var(--bg-tertiary);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
  }
  
  .usage-section h2 {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    text-align: center;
    margin-bottom: var(--space-6);
  }
  
  .usage-example {
    margin-bottom: var(--space-8);
  }
  
  .usage-example:last-child {
    margin-bottom: 0;
  }
  
  .usage-example h3 {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-4);
  }
  
  .demo-header {
    background-color: var(--bg-primary);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-light);
  }
  
  .demo-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .nav-links {
    display: flex;
    gap: var(--space-4);
  }
  
  .nav-links button {
    background: none;
    border: none;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
  }
  
  .nav-links button:hover {
    color: var(--primary-blue);
  }
  
  .app-icons {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }
  
  .app-icon {
    padding: var(--space-4);
    border-radius: var(--radius-2xl);
  }
  
  .app-icon.dark {
    background-color: #1f2937;
  }
  
  .app-icon.light {
    background-color: var(--bg-primary);
    box-shadow: var(--shadow-md);
  }
  
  .app-icon.gradient {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
  }
  
  .splash-screen {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
    padding: var(--space-12);
    border-radius: var(--radius-lg);
    text-align: center;
  }
  
  .splash-text {
    color: var(--text-inverse);
    margin-top: var(--space-4);
    font-size: var(--text-lg);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: var(--space-4);
    }
    
    .logo-variants {
      grid-template-columns: 1fr;
    }
    
    .size-display {
      gap: var(--space-4);
    }
    
    .demo-nav {
      flex-direction: column;
      gap: var(--space-4);
      align-items: center;
    }
    
    .app-icons {
      justify-content: center;
    }
  }
</style>