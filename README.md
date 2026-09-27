# 🎁 DEDICA — Tienda de Regalos Digitales Interactivos

> **Convierte lo que sientes en algo que puedan vivir.**
> Plataforma web estática de alta fidelidad para vender experiencias digitales emotivas (declaraciones de amor, aniversarios, cartas y recuerdos) con productos 100% autónomos y links personalizados para clientes.

---

> ⚠️ **IMPORTANTE: PRIVACIDAD DE DATOS DE CLIENTES**
>
> **El repositorio de producción debe mantenerse PRIVADO** si dentro de `/clientes/` se almacenan nombres, mensajes, fotografías, audios u otros datos reales de clientes.
>
> ⛔ **NO subir información real de clientes a un repositorio público.**
> 
> *Nota sobre datos demo:* Las carpetas `/clientes/A72FK9/`, `/clientes/X92KLM/` y `/clientes/H81PQ4/` contienen datos ficticios de demostración. Cuando comiencen los pedidos reales, reemplaza o elimina estas carpetas demo si ya no son necesarias.

---

## 📁 Arquitectura del Proyecto

```text
/
├── index.html                     # Landing page de la tienda (Estilo Apple, Mobile-First)
├── catalogo/
│   └── index.html                 # Catálogo interactivo con Bottom Sheet de compra
│
├── store-assets/                  # RECURSOS EXCLUSIVOS DE LA TIENDA
│   ├── css/
│   │   └── global.css             # Sistema de diseño Apple (Dark Glass, Bottom Sheet)
│   ├── js/
│   │   └── store.js               # Control de Bottom Sheet y checkout WhatsApp (+51 988 799 404)
│   └── images/
│       ├── favicon.svg
│       ├── og-image.svg
│       └── previews/              # Vistas previas de las experiencias
│
├── productos/                     # PRODUCTOS AUTÓNOMOS (Vendibles como ZIP)
│   ├── camino-hacia-ti/           # ← Click derecho → Comprimir en ZIP → Enviar al cliente
│   │   ├── index.html
│   │   ├── config.js
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── README.txt
│   │   └── assets/
│   │       ├── images/
│   │       └── audio/
│   │
│   ├── nuestra-historia/          # ← Vendible como ZIP
│   │   ├── index.html
│   │   ├── config.js
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── README.txt
│   │   └── assets/
│   │
│   └── carta-especial/            # ← Vendible como ZIP
│       ├── index.html
│       ├── config.js
│       ├── style.css
│       ├── script.js
│       ├── README.txt
│       └── assets/
│
├── clientes/                      # CLIENTES PERSONALIZADOS (Copias autónomas en vivo)
│   ├── A72FK9/                    # ← misregalos.pages.dev/clientes/A72FK9/ (Camila & Luis)
│   │   ├── index.html
│   │   ├── config.js
│   │   ├── style.css
│   │   ├── script.js
│   │   └── assets/
│   │
│   ├── X92KLM/                    # ← misregalos.pages.dev/clientes/X92KLM/ (Mateo & Sofía)
│   │   ├── index.html
│   │   ├── config.js
│   │   ├── style.css
│   │   ├── script.js
│   │   └── assets/
│   │
│   └── H81PQ4/                    # ← misregalos.pages.dev/clientes/H81PQ4/ (Valentina & Carlos)
│       ├── index.html
│       ├── config.js
│       ├── style.css
│       ├── script.js
│       └── assets/
│
├── .gitignore
└── README.md
```

---

## 📦 1. Vender un Producto como Archivo ZIP

Cada carpeta dentro de `/productos/` es **100% autónoma e independiente**. No depende de `/store-assets/` ni de ningún archivo exterior.

**Para venderlo al cliente:**
1. Haz clic derecho sobre `productos/camino-hacia-ti/` (o el producto comprado).
2. Selecciona **Comprimir en archivo ZIP**.
3. Envía el archivo ZIP al cliente.

El cliente descomprime la carpeta, abre `index.html` en cualquier navegador y funciona de inmediato, incluso sin conexión a internet. El paquete incluye un `README.txt` que le explica cómo editar `config.js` y colocar sus fotos en `assets/images/`.

---

## 🎯 2. Modo Demo (`?demo=1`) vs. Experiencia Limpia de Cliente

Para mantener el proyecto libre de duplicación de archivos:
- **En la tienda:** Los botones "Ver demo" abren las URLs con el parámetro `?demo=1` (ej: `/productos/camino-hacia-ti/?demo=1`). En este modo, se muestra discretamente el botón `← Tienda`.
- **En enlaces de clientes y archivos ZIP:** Cuando se abre sin dicho parámetro (`/clientes/A72FK9/` o `index.html` local de un ZIP), el botón de tienda **no se muestra en lo absoluto**, garantizando una experiencia limpia, íntima y 100% personalizada.

---

## 🔗 3. Crear un Link Personalizado para un Cliente en 60 Segundos

Cuando un cliente te compre un **Link Personalizado** (ejemplo ID: `H81PQ4`):

1. **Copia la carpeta completa** del producto base elegido:
   - Copia `/productos/camino-hacia-ti/` a `/clientes/H81PQ4/`.
2. **Edita su `config.js`** con sus nombres, mensajes y fecha:
   ```javascript
   window.REGALO = {
     destinatario: "Valentina",
     remitente: "Carlos",
     titulo: "Valentina... Tengo algo para ti ❤️",
     mensajeInicial: "Hay algo que hace tiempo quería decirte...",
     // ...
   };
   ```
3. **Coloca las fotos del cliente** en `/clientes/H81PQ4/assets/images/`.
4. **Sube a GitHub:**
   ```bash
   git add .
   git commit -m "Nuevo cliente H81PQ4"
   git push origin main
   ```

Cloudflare Pages publicará de inmediato:
`https://misregalos.pages.dev/clientes/H81PQ4/`

---

## 📱 4. Flujo de Compra por WhatsApp

- Al hacer clic en cualquier botón de compra de la tienda, se abre un **Bottom Sheet** estilo Apple que permite elegir entre:
  1. `🔗 Link personalizado`
  2. `📦 Proyecto completo / archivos (ZIP)`
- Al confirmar, se redirige automáticamente al WhatsApp del negocio (**+51 988 799 404**) con el mensaje pre-llenado que contiene el **nombre del producto**, la **modalidad elegida** y los datos del comprador.

---

## ☁️ 5. Despliegue en Cloudflare Pages

1. Sube este repositorio a tu cuenta de **GitHub**.
2. En Cloudflare Dashboard > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Selecciona tu repositorio.
4. En Build Settings:
   - **Framework preset:** `None`
   - **Build command:** *(en blanco)*
   - **Build output directory:** `/`
5. Haz clic en **Save and Deploy**.

---

© 2026 DEDICA — Arquitectura autónoma, ultraligera y lista para producción.
