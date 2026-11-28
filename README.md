# QuickCart - A simple eCommerce website

QuickCart is an open-source **Next.js eCommerce frontend** project.  
It provides a modern, fast and customizable shopping UI.  
This repo is **frontend only** – contributors can improve the design, add new pages, animations and more.

---

## Features

-   Built with **Next.js + Tailwind CSS**
-   Responsive design
-   Reusable components
-   Customizable layouts and colors
-   Open for contributions (UI/UX, animations, themes, layouts etc.)

---

## Getting Started

1. Clone the repo

    ```bash
    git clone https://github.com/GreatStackDev/QuickCart.git
    cd QuickCart
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Run locally

    ```bash
    npm run dev
    ```

### Seller access

Seller API routes read the seller role from Clerk's signed session claims. In the Clerk Dashboard, open **Sessions** → **Customize session token** and add this claim:

```json
{
  "public_metadata": "{{user.public_metadata}}"
}
```

Set a seller's **Public metadata** to `{"role":"seller"}`. After saving the session claim, sign out and back in so Clerk issues a token containing the claim.

---

## Contributing

We welcome all kinds of contributions! You can:

- Create new pages
- Improve layouts
- Add animations and transitions
- Enhance responsiveness
- Refactor components
- Suggest new UI/UX ideas
- Add themes or color variations
- Introduce accessibility improvements
- Add filtering/search features
- Improve documentation

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the **MIT License**.

---

## 🌟 Contributors

Thanks to everyone who contributes to **QuickCart**!