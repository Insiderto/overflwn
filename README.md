# Overflwn - React Overflow Container

A lightweight React library featuring the `OverflowContainer` component that intelligently handles overflow content with a customizable "more" indicator.
Live demo: https://insiderto.github.io/overflwn
---

## 🌟 Features
- Automatically handles overflowed content
- Supports tags, menus, numbers, and more
- Custom render for hidden elements
- Zero dependencies beyond React
- TypeScript support

---

## 🚀 Installation

```bash
npm install overflwn
# or
yarn add overflwn
```

---

## 🛠️ Usage Example

```tsx
// Import the OverflowContainer component
import { OverflowContainer } from "overflwn";

const tags = [
  "#react", "#typescript", "#opensource", "#webdev", "#saas",
  "#uiux", "#css", "#frontend", "#demo", "#overflow"
];

export default function Demo() {
  return (
    <div style={{ maxWidth: 400 }}>
      <OverflowContainer
        renderHiddenElements={hidden => (
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            +{hidden.length} more
          </div>
        )}
      >
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '0.2em 0.7em',
              margin: '0 0.3em 0.3em 0',
              background: '#eee',
              borderRadius: '999px',
              display: 'inline-block',
              fontSize: '0.95em',
            }}
          >
            {tag}
          </span>
        ))}
      </OverflowContainer>
    </div>
  );
}
```

---

## ✨ Live Preview

You can see a live demo in the main app. Try resizing the container or toggling dark mode!

---

## 🧩 Customization
- Pass `renderHiddenElements` to customize the hidden items indicator.
- Style children as you wish.

---

## 💡 Pro Tips
- Works great with tags, menu items, avatars, and more.
- Combine with TailwindCSS or your favorite CSS framework.

---

## 📦 Repository
https://github.com/Insiderto/overflwn

---

Enjoy using `OverflowContainer`!
