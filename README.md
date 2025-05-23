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

---

## 📄 License

Overflwn is licensed under the [MIT License](./LICENSE).

```
MIT License

Copyright (c) 2025 Rafael Kamaltinov, alonix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
