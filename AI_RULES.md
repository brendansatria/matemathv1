# 🚀 AI Agent Development Rules (Kaplay + Jotai First, PixiJS + Konva Option)

## 🔧 Tech Stack & Project Structure
1. You are building a **React application**.  
2. Use **TypeScript**.  
3. Use **React Router**, with all routes defined in `src/App.tsx`.  
4. Keep all source code inside the `src/` folder.  
5. Pages must go into `src/pages/`.  
6. Components must go into `src/components/`.  
7. The **main page (default page)** is `src/pages/Index.tsx`.  
   - ALWAYS import and render new components in this page.  
   - If not, the user cannot see them.  

---

## 🎨 Styling & UI
8. Use **Tailwind CSS** extensively for layout, spacing, colors, and design.  
9. Use **shadcn/ui** components for UI (buttons, cards, dialogs, forms, etc.).  
10. Use **lucide-react** for icons.  
11. Fonts: Use **Google Fonts**, configured in `tailwind.config.js`.  
   - Example: `"Pacifico"` for titles, `"Roboto"` for body text.  
12. Animate UI and values with **framer-motion** (https://github.com/motiondivision/motion).  

---

## 🎮 Game & Simulation Frameworks
### ✅ First Option: Kaplay + Jotai
- Use **Kaplay** for rendering the simulation/game loop.  
- Handle sprites, input, movement, collisions, animations.  
- Use **Jotai** for **global game state management** (profit, customers, decisions, inventory, etc.).  
- Integrate Jotai atoms with both the **Kaplay canvas** and **React UI**.  
- Best suited for **business simulations, learning games, and playful training tools** where logic and UI must sync tightly.  

### 🖼 Secondary Option: PixiJS + Konva
- Use **PixiJS** when you need **low-level rendering control** (custom visuals, dashboards, visual metaphors).  
- Use **Konva (react-konva)** for **interactive drag-and-drop layers** (strategy boards, decision cards).  
- Best suited for **UI-heavy simulations** where visuals and interactivity matter more than a strict game loop.  

---

## 📦 Required Packages
Ensure the following libraries are available:  
- `kaplay`  
- `jotai`  
- `pixi.js`  
- `react-konva`  
- `@motionone/react`  
- `lucide-react`  
- `@/components/ui/*` (shadcn/ui components)  

---

## 🖼️ Assets Handling
13. **Do NOT hardcode asset paths** (e.g., `"/assets/image.png"`). This will fail in production because Vite rewrites paths.  
14. Always **import assets directly** so Vite can manage them correctly:  
   ```tsx
   import logo from "@/assets/logo.png";
   <img src={logo} alt="Logo" />
   ```
15. For Kaplay, load sprites/images via imports
  ```tsx
   import coffeeSprite from "@/assets/coffee.png";
   kaplay.loadSprite("coffee", coffeeSprite);
   ```
16. For PixiJS, use imports for textures:
   ```tsx
   import spriteImg from "@/assets/sprite.png";
   const sprite = PIXI.Sprite.from(spriteImg);
   ```
17. For Konva, load images through imports: 
   ```tsx
   import img from "@/assets/board.png";
   const image = new window.Image();
   image.src = img;
   ```
18. All assets should be placed inside src/assets/.
19. Only use public/ for files that must remain unchanged (e.g., favicon).

## 📄 Implementation Rules
20. Always import new components into src/pages/Index.tsx and render them inside the page layout.
21. When creating a new Kaplay, PixiJS, Konva, or Motion One component:
   - Put the file in src/components/.
   - Use TypeScript.
   - Center the canvas or content with Tailwind (flex, justify-center, items-center, h-screen).
22. Always keep components self-contained:
   - Kaplay initializes its own scene.
   - PixiJS initializes its own app.
   - Konva initializes its own stage.
   - Motion animations are defined inside the component.
23. Do not leak logic into Index.tsx — just render the component there.