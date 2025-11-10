# Multi-AI Platform - Usage Guide

## 🎨 Color Reference

### Theme Colors
```css
Background:     #0d0e10  /* Deep dark base */
Neon Cyan:      #00ffc6  /* Primary accent */
Purple:         #b366ff  /* Secondary accent */
Orange:         #ff6b00  /* Tertiary accent */
Emerald Green:  #00ff8f  /* Quaternary accent */
```

### Gradient Combinations
```css
/* Primary Gradient */
linear-gradient(90deg, #00ffc6, #ff6b00, #b366ff)

/* Model-Specific Colors */
GPT:        #00ff8f  (Emerald Green)
Gemini:     #b366ff  (Purple)
DeepSeek:   #ff6b00  (Orange)
Perplexity: #00ffc6  (Neon Cyan)
Claude:     #ff9500  (Orange variant)
Mistral:    #ff4d94  (Pink)
```

---

## 🧩 Component Usage

### 1. ParticleBackground
```tsx
<ParticleBackground 
  intensity="medium"  // 'low' | 'medium' | 'high'
  containerClassName="custom-class"
/>
```

**Particle Counts**:
- Low: 30 particles
- Medium: 50 particles
- High: 100 particles

---

### 2. Sidebar
```tsx
<Sidebar 
  isExpanded={true}
  toggleSidebar={() => setIsExpanded(!isExpanded)}
/>
```

**States**:
- Expanded: 250px width
- Collapsed: 70px width

**Sections**:
- History (History icon)
- Super AI (Zap icon)
- Settings (Settings icon)

---

### 3. ModelBar
```tsx
<ModelBar 
  models={modelData}
  selectedModels={['gpt', 'gemini']}
  onToggleModel={(id) => handleToggle(id)}
/>
```

**Props**:
- `models`: Array of model objects with id, name, color, icon
- `selectedModels`: Array of selected model IDs
- `onToggleModel`: Callback when model is toggled

---

### 4. ChatInput
```tsx
<ChatInput 
  onSubmit={(message) => handleSubmit(message)}
  isFirstPrompt={true}
  setIsFirstPrompt={(value) => setIsFirstPrompt(value)}
/>
```

**Behavior**:
- `isFirstPrompt=true`: Centered on screen
- `isFirstPrompt=false`: Docked at bottom

**Keyboard Shortcuts**:
- Enter: Submit message
- Shift+Enter: New line

---

### 5. ModelCard
```tsx
<ModelCard
  id="gpt"
  name="GPT-5 Nano"
  color="#00ff8f"
  isEnabled={true}
  onToggle={() => toggleModel('gpt')}
  isTyping={false}
/>
```

**States**:
- Enabled: Full opacity, particles active, glowing border
- Disabled: Reduced opacity, no particles
- Typing: Animated dots indicator

---

### 6. ModelCardContainer
```tsx
<ModelCardContainer
  models={enabledModels}
  enabledModels={['gpt', 'gemini']}
  onToggleModel={(id) => handleToggle(id)}
/>
```

**Features**:
- Horizontal scrolling
- Scroll buttons (left/right)
- Fade edges for overflow indication
- Snap scrolling

---

## 🎯 Interaction Patterns

### Initial State
1. Particle background is active
2. Sidebar is expanded (desktop) or collapsed (mobile)
3. Model bar shows all available models
4. Input is centered on screen
5. No model cards visible

### After First Prompt
1. Input slides to bottom
2. Model cards appear for enabled models
3. Typing animation starts on enabled cards
4. User message displays above cards
5. Particles increase intensity slightly

### Model Toggle
1. Click model in top bar to enable/disable
2. Click toggle switch on card to enable/disable
3. Disabled models don't show cards
4. Cards fade in/out smoothly

### Sidebar Toggle
1. Click chevron button to toggle
2. Smooth width transition
3. Icons remain visible when collapsed
4. Labels show/hide based on state

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────┐
│ ModelBar (Fixed Top)                            │
├──────┬──────────────────────────────────────────┤
│      │                                          │
│ Side │  Main Content Area                       │
│ bar  │  - Particle Background                   │
│      │  - User Message (after first prompt)     │
│ (L)  │  - Model Cards (horizontal scroll)       │
│      │                                          │
│      │                                          │
├──────┴──────────────────────────────────────────┤
│ ChatInput (Bottom Dock after first prompt)      │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Custom CSS Classes

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(90deg, #00ffc6, #ff6b00, #b366ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Gradient Border
```css
.gradient-border {
  /* Animated gradient border on hover */
}
```

### Hide Scrollbar
```css
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## 🔧 Customization

### Adding a New Model
```tsx
const newModel = {
  id: 'model-id',
  name: 'Model Name',
  color: '#hexcolor',
  icon: '🤖'
};

// Add to modelData array in App.tsx
```

### Changing Particle Count
```tsx
// In ParticleBackground.tsx
const getParticleCount = () => {
  switch (intensity) {
    case 'low': return 30;    // Change these values
    case 'high': return 100;
    default: return 50;
  }
};
```

### Adjusting Animation Speed
```tsx
// In tailwind.config.js
animation: {
  'pulse-glow': 'pulse-glow 2s infinite',  // Change duration
  'float': 'float 6s ease-in-out infinite',
}
```

---

## 🐛 Troubleshooting

### Issue: Particles not showing
- Check if canvas is rendering
- Verify ParticleBackground component is mounted
- Check z-index (-z-10)

### Issue: Sidebar not toggling
- Verify state is updating
- Check Framer Motion is installed
- Inspect animation variants

### Issue: Model cards not appearing
- Ensure models are enabled
- Check if isFirstPrompt is false
- Verify ModelCardContainer is rendering

### Issue: Tailwind classes not working
- Run `npm install` to ensure dependencies
- Check tailwind.config.js content paths
- Verify @tailwind directives in index.css

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 640px   (Sidebar collapsed, single card view)
Tablet:  640-1024px (Sidebar toggle, 2-3 cards)
Desktop: > 1024px   (Full sidebar, 3-4 cards)
```

---

## ⚡ Performance Tips

1. **Particle Count**: Use 'low' intensity on mobile
2. **Model Cards**: Limit enabled models to 3-4 for best performance
3. **Animations**: Reduce motion for accessibility
4. **Images**: Use optimized assets (not implemented yet)

---

## 🎉 Quick Start Checklist

- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Open http://localhost:3002
- [ ] Toggle sidebar to test animation
- [ ] Enable/disable models in top bar
- [ ] Type a message and press Enter
- [ ] Watch input transition to bottom
- [ ] See model cards appear
- [ ] Scroll horizontally through cards
- [ ] Toggle individual model cards

---

**Happy Coding! 🚀**
