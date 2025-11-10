# Technical Specifications

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.553.0",
  "react-icons": "^5.5.0",
  "typescript": "^4.9.5"
}
```

### Development Dependencies
```json
{
  "tailwindcss": "^3.3.2",
  "postcss": "^8.4.23",
  "autoprefixer": "^10.4.14",
  "postcss-import": "^16.1.1"
}
```

---

## 🏗️ File Structure

```
multi-ai-platform/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ParticleBackground.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ModelBar.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ModelCard.tsx
│   │   └── ModelCardContainer.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
├── README.md
├── PROJECT_SUMMARY.md
├── USAGE_GUIDE.md
└── TECHNICAL_SPECS.md
```

---

## 🎨 Tailwind Configuration

### Extended Theme
```javascript
{
  colors: {
    background: "#0d0e10",
    neonCyan: "#00ffc6",
    purple: "#b366ff",
    orange: "#ff6b00",
    emeraldGreen: "#00ff8f",
  },
  fontFamily: {
    poppins: ["Poppins", "sans-serif"],
    inter: ["Inter", "sans-serif"],
  },
  animation: {
    'pulse-glow': 'pulse-glow 2s infinite',
    'float': 'float 6s ease-in-out infinite',
  }
}
```

---

## 🔧 Component APIs

### ParticleBackground
```typescript
interface ParticleBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  containerClassName?: string;
}
```

### Sidebar
```typescript
interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}
```

### ModelBar
```typescript
interface Model {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ModelBarProps {
  models: Model[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}
```

### ChatInput
```typescript
interface ChatInputProps {
  onSubmit: (message: string) => void;
  isFirstPrompt: boolean;
  setIsFirstPrompt: (value: boolean) => void;
}
```

### ModelCard
```typescript
interface ModelCardProps {
  id: string;
  name: string;
  color: string;
  isEnabled: boolean;
  onToggle: () => void;
  isTyping?: boolean;
}
```

### ModelCardContainer
```typescript
interface Model {
  id: string;
  name: string;
  color: string;
  isTyping?: boolean;
}

interface ModelCardContainerProps {
  models: Model[];
  enabledModels: string[];
  onToggleModel: (modelId: string) => void;
}
```

---

## 🎬 Animation Specifications

### Framer Motion Variants

#### Sidebar
```typescript
{
  expanded: { 
    width: '250px', 
    transition: { duration: 0.3 } 
  },
  collapsed: { 
    width: '70px', 
    transition: { duration: 0.3 } 
  }
}
```

#### ChatInput
```typescript
{
  center: { 
    maxWidth: '700px',
    width: '90%',
    y: '-50%',
    x: '-50%',
    left: '50%',
    bottom: '50%',
    position: 'absolute'
  },
  bottom: { 
    maxWidth: '900px',
    width: '90%',
    y: 0,
    x: '-50%',
    left: '50%',
    bottom: '20px',
    position: 'fixed'
  }
}
```

#### ModelCard
```typescript
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}
```

---

## 🎨 CSS Animations

### Keyframes
```css
@keyframes textShine {
  to {
    background-position: 200% center;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(0, 255, 198, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 198, 0.6);
  }
}

@keyframes typing {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}
```

---

## 🖼️ Canvas Particle System

### Particle Interface
```typescript
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}
```

### Particle Properties
- **Size Range**: 1-4px
- **Speed Range**: -0.25 to 0.25 (X and Y)
- **Colors**: ['#00ffc6', '#ff6b00', '#b366ff', '#00ff8f']
- **Opacity**: 0.7
- **Bounce**: Particles bounce off screen edges

### Performance
- **Low**: 30 particles
- **Medium**: 50 particles
- **High**: 100 particles

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  .ml-[70px] { margin-left: 0; }
}

/* Tablet */
@media (max-width: 768px) {
  .ml-[250px] { margin-left: 70px; }
}
```

### Layout Adjustments
- **Mobile**: Sidebar always collapsed, single card view
- **Tablet**: Sidebar toggleable, 2-3 cards visible
- **Desktop**: Full sidebar, 3-4 cards visible

---

## 🔐 TypeScript Configuration

### tsconfig.json (Key Settings)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

---

## 🚀 Build Configuration

### Development
```bash
npm start
# Starts webpack dev server on port 3000+
# Hot module replacement enabled
# Source maps enabled
```

### Production
```bash
npm run build
# Creates optimized build in /build
# Minifies JS and CSS
# Generates source maps
# Optimizes images and assets
```

---

## 🧪 Testing Setup

### Test Scripts
```json
{
  "test": "react-scripts test",
  "test:coverage": "react-scripts test --coverage"
}
```

### Testing Libraries
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event

---

## 🔍 ESLint Configuration

### Rules
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ]
}
```

### Resolved Warnings
- ✅ Unused imports removed
- ✅ React Hooks dependencies fixed
- ✅ TypeScript strict mode compliance

---

## 🌐 Browser Support

### Production
- \>0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Last 1 Chrome version
- Last 1 Firefox version
- Last 1 Safari version

---

## 📊 Performance Metrics

### Bundle Size (Estimated)
- **Main Bundle**: ~500KB (uncompressed)
- **Vendor Bundle**: ~300KB (React, Framer Motion)
- **CSS Bundle**: ~50KB (Tailwind)

### Load Time (Estimated)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Largest Contentful Paint**: <2.5s

### Optimization Opportunities
1. Code splitting for model cards
2. Lazy loading for components
3. Image optimization (when images added)
4. Service worker for caching

---

## 🔒 Security Considerations

### Current Implementation
- No user authentication
- No data persistence
- No external API calls
- Client-side only

### Future Security Needs
- API key management
- HTTPS enforcement
- CORS configuration
- Input sanitization
- XSS prevention

---

## 🐛 Known Limitations

1. **No Backend**: UI only, no real AI integration
2. **No Persistence**: State resets on refresh
3. **Mock Responses**: Typing animation only, no actual responses
4. **No History**: Chat history not saved
5. **Static Models**: Model list is hardcoded

---

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Initial UI implementation
- ✅ All core components
- ✅ Responsive design
- ✅ Dark theme with particles
- ✅ Smooth animations
- ✅ No lint errors

---

## 📝 Development Notes

### PostCSS Configuration
```javascript
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Important: Tailwind CSS Version
- **Must use v3.3.2** (not v4.x)
- v4 requires @tailwindcss/postcss plugin
- v3 works with standard PostCSS setup

---

## 🎯 Code Quality

### Metrics
- **TypeScript Coverage**: 100%
- **ESLint Errors**: 0
- **ESLint Warnings**: 0
- **Build Errors**: 0

### Best Practices
- ✅ Component composition
- ✅ Props interface definitions
- ✅ Consistent naming conventions
- ✅ Modular CSS with Tailwind
- ✅ Reusable components

---

**Last Updated**: November 10, 2025  
**Status**: Production Ready (UI Only)  
**Version**: 1.0.0
