# Edu Ruang Logo Usage Guide

The Edu Ruang logo is a modern, minimalist design that combines educational and technological elements to represent our learning platform.

## Logo Components

### 🏫 Room Frame
- **Design**: Window-like frame with rounded corners
- **Symbolism**: Represents learning space and educational environment
- **Colors**: Blue frame (#3B82F6) with teal inner border (#06B6D4)

### 📚 Book Element
- **Design**: Stylized open book with visible pages
- **Symbolism**: Traditional education and knowledge
- **Colors**: Primary blue (#3B82F6) with lighter blue accents (#60a5fa)

### ⚡ Technology Elements
- **Design**: Circuit patterns and pixel elements
- **Symbolism**: Digital learning and modern technology
- **Colors**: Cyan gradients (#06B6D4, #22d3ee, #0891b2)

## Logo Variants

### Icon Version (`variant="icon"`)
- Pure symbol without text
- Perfect for favicons, app icons, and small spaces
- Recommended sizes: 16px, 32px, 48px, 64px, 128px

### Default Version (`variant="default"`)
- Logo with text stacked below
- Good for splash screens and centered layouts
- Includes "Edu Ruang" title and "Learning Space" subtitle

### Horizontal Version (`variant="horizontal"`)
- Logo with text alongside
- Ideal for headers, navigation bars, and wide layouts
- Compact and space-efficient

## Usage Examples

```svelte
<!-- Import the component -->
<script>
  import EduRuangLogo from '$lib/components/EduRuangLogo.svelte';
</script>

<!-- Different variations -->
<EduRuangLogo variant="icon" size={64} />
<EduRuangLogo variant="default" size={80} />
<EduRuangLogo variant="horizontal" size={48} />
```

## Color Palette

- **Primary Blue**: `#3B82F6` (var(--primary-blue))
- **Light Blue**: `#60a5fa`
- **Dark Blue**: `#1e40af`
- **Primary Cyan**: `#06B6D4` (var(--primary-cyan))
- **Bright Cyan**: `#22d3ee`
- **Deep Cyan**: `#0891b2`
- **Background**: `#f0f9ff`

## File Locations

- **Main Component**: `src/lib/components/EduRuangLogo.svelte`
- **Favicon**: `src/lib/assets/favicon.svg`
- **Icon Assets**: `static/icon-192.svg`, `static/icon-512.svg`
- **Showcase Page**: `src/routes/logo/+page.svelte`

## Best Practices

1. **Maintain aspect ratio** when resizing
2. **Use appropriate variant** for the context
3. **Ensure sufficient contrast** on backgrounds
4. **Don't modify the colors** without design approval
5. **Keep minimum size** readable (16px for icon variant)

## Technical Specifications

- **Format**: SVG (Scalable Vector Graphics)
- **Viewbox**: 0 0 64 64
- **Scalable**: Yes, maintains quality at any size
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Includes proper semantic markup

Visit `/logo` in the application to see all variants and usage examples.