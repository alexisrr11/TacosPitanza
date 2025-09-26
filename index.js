//Navegación móvil
const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Array de slides
const slides = [
  {
    image: "https://www.panchovilla.cl/wp-content/uploads/2022/07/Nachos-con-guacamole.jpg",
    title: "Deliciosos Nachos con Guacamole",
    text: "Totopos crujientes con guacamole fresco y salsa mexicana."
  },
  {
    image: "https://www.panchovilla.cl/wp-content/uploads/2022/07/Quesadilla-de-pollo-1024x683.jpg",
    title: "Quesadillas irresistibles",
    text: "Tortilla rellena de queso y tus ingredientes favoritos."
  },
  {
    image: "https://cdn.colombia.com/gastronomia/2015/08/31/burrito-de-carne-3236.jpg",
    title: "Burritos llenos de sabor",
    text: "Tortilla gigante rellena de carne, arroz, frijoles y vegetales."
  },
  {
    image: "https://cocinarrecetasdepostres.net/po/wp-content/uploads/2020/06/Todos-os-nachos.jpg",
    title: "Más Nachos para todos",
    text: "Perfectos para compartir con amigos y acompañar con salsa casera."
  }
];

let currentSlide = 0;
const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroText = document.getElementById("hero-text");

// Función para mostrar el slide
function showSlide(index) {
    const slide = slides[index];
    hero.style.backgroundImage = `url('${slide.image}')`;
    heroTitle.textContent = slide.title;
    heroText.textContent = slide.text;
}

// Inicializar primer slide
showSlide(currentSlide);

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

//Modales y ofertas
const modal = document.getElementById("ofertasModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const slider = document.getElementById("slider");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;

openModal.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

nextBtn.addEventListener("click", () => {
    if (index < 2) index++;
    else index = 0;
    slider.style.transform = `translateX(-${index * 100}%)`;
});

prevBtn.addEventListener("click", () => {
    if (index > 0) index--;
    else index = 2;
    slider.style.transform = `translateX(-${index * 100}%)`;
});

// Cargar productos desde productos.json
fetch("/productos.json")
    .then(response => response.json())
    .then(data => {
        const saladoContainer = document.getElementById("menu-salado");
        const bebidaContainer = document.getElementById("menu-bebida");
        const saladoTitle = document.getElementById("salado");
        const bebidaTitle = document.getElementById("bebida");

        // Agrupar por id y luego por categoria
        const grupos = {
            Salados: {},
            Bebidas: {}
        };

        data.forEach(producto => {
            const group = producto.id; // "Salados" o "Bebidas"
            const categoria = producto.categoria;

            if (!grupos[group][categoria]) {
                grupos[group][categoria] = [];
            }
            grupos[group][categoria].push(producto);
        });

        function renderGrupo(container, titleContainer, grupo, titulo, filtro = "Todos") {
            container.innerHTML = ""; // limpiar antes de renderizar
            titleContainer.innerHTML = ""; // limpiar título

            let hayContenido = false;

            Object.keys(grupo).forEach(categoria => {
                if (filtro !== "Todos" && categoria !== filtro) return;

                if (grupo[categoria].length > 0) {
                    hayContenido = true;

                    // Título del grupo
                    if (!titleContainer.innerHTML) {
                        titleContainer.innerHTML = `
              <h4 class="text-2xl md:text-3xl font-bold text-green-700 mb-8 border-b-4 border-green-600 pb-2">
                ${titulo}
              </h4>
            `;
                    }

                    // Contenedor de categoría
                    const categoriaSection = document.createElement("div");
                    categoriaSection.className = "mb-12";

                    // Título de categoría
                    const categoriaTitle = document.createElement("h5");
                    categoriaTitle.className =
                        "text-xl md:text-2xl font-semibold text-green-800 mb-6";
                    categoriaTitle.textContent = categoria;
                    categoriaSection.appendChild(categoriaTitle);

                    // Grid de productos
                    const catContainer = document.createElement("div");
                    catContainer.className = "grid md:grid-cols-3 gap-8";
                    categoriaSection.appendChild(catContainer);

                    // Productos
                    grupo[categoria].forEach(producto => {
                        const card = document.createElement("div");
                        card.className =
                            "bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transform transition-all duration-300";
                        card.innerHTML = `
              <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover">
              <div class="p-4">
                <h4 class="text-lg md:text-xl font-semibold text-green-700">${producto.nombre}</h4>
                ${producto.descripcion
                                ? `<p class="text-gray-600">${producto.descripcion}</p>`
                                : ""
                            }
                <p class="mt-2 font-bold text-green-800">$${producto.precio}</p>
              </div>
            `;
                        catContainer.appendChild(card);
                    });

                    container.appendChild(categoriaSection);
                }
            });

            if (!hayContenido) {
                titleContainer.innerHTML = "";
            }
        }

        // Escuchar clicks en los botones de filtro
        document.querySelectorAll(".filtro").forEach(btn => {
            btn.addEventListener("click", () => {
                const filtro = btn.getAttribute("data-filtro");

                if (filtro === "Todos") {
                    renderGrupo(saladoContainer, saladoTitle, grupos.Salados, "Salados");
                    renderGrupo(bebidaContainer, bebidaTitle, grupos.Bebidas, "Bebidas");
                } else {
                    if (grupos.Salados[filtro]) {
                        renderGrupo(saladoContainer, saladoTitle, grupos.Salados, "Salados", filtro);
                        bebidaContainer.innerHTML = "";
                        bebidaTitle.innerHTML = "";
                    } else if (grupos.Bebidas[filtro]) {
                        renderGrupo(bebidaContainer, bebidaTitle, grupos.Bebidas, "Bebidas", filtro);
                        saladoContainer.innerHTML = "";
                        saladoTitle.innerHTML = "";
                    }
                }
            });
        });

        // Render inicial → mostrar ambos
        renderGrupo(saladoContainer, saladoTitle, grupos.Salados, "Salados");
        renderGrupo(bebidaContainer, bebidaTitle, grupos.Bebidas, "Bebidas");
    })
    .catch(error => console.error("Error al cargar el menú:", error));






//Ver ofertas
window.onload = function () {
    const modal = document.getElementById("modal-ofertas");
    const listaOfertas = document.getElementById("lista-ofertas");
    const contenedor = document.getElementById("contenedor-ofertas");
    const titulo = document.getElementById("titulo-ofertas");
    const btnConsultaWp = document.getElementById("botonConsultaWhatsapp");


    // Array de ofertas por día
    const ofertasPorDia = {
        1: [
            "🌮 Lunes: 20% OFF en Tacos al Pastor",
            "💳 15% OFF pagando con Visa en Quesadillas"
        ],
        2: [
            "🌯 Martes: 2x1 en Burritos de Carne Asada",
            "📲 15% OFF con Mercado Pago en cualquier combo de tacos"
        ],
        3: [
            "🧀 Miércoles: 25% OFF en Quesadillas de Queso",
            "🏦 Santander Río 10% sin interés en combos de nachos + bebida"
        ],
        4: [
            "🌮 Jueves: 30% OFF en Tacos de Pollo pagando en efectivo",
            "💳 15% OFF con tarjetas Visa en Burritos Veganos"
        ],
        5: [
            "🌮 Viernes: 2x1 en Tacos de Asada",
            "🌯 20% OFF en Burritos Mixtos (promo exclusiva)"
        ],
        6: [
            "🥑 Sábado: Nachos con guacamole 10% OFF en efectivo",
            "🌮 Tacos al Pastor + Cerveza 5% OFF con débito Visa"
        ]
        // Domingo sin ofertas
    };


    // Obtener el día actual
    const diaHoy = new Date().getDay();

    //  Llenar el MODAL
    if (listaOfertas) {
        if (ofertasPorDia[diaHoy]) {
            ofertasPorDia[diaHoy].forEach(oferta => {
                const li = document.createElement("li");
                li.textContent = oferta;
                listaOfertas.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No tenemos ofertas especiales para hoy, vuelva mañana. Lo esperamos😊";
            listaOfertas.appendChild(li);
            btnConsultaWp.classList.add("hidden");
        }

        // Mostrar modal automáticamente
        modal.classList.remove("hidden");
    }

    // Llenar la SECCIÓN DE OFERTAS
    if (contenedor && titulo) {
        contenedor.innerHTML = "";

        if (ofertasPorDia[diaHoy]) {
            const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            titulo.textContent = `Ofertas del ${diasSemana[diaHoy]}`;

            ofertasPorDia[diaHoy].forEach((oferta) => {
                const card = document.createElement("div");
                card.className = "relative bg-cover rounded-xl shadow-lg p-6 text-center text-white";

                // Overlay negro
                const overlay = document.createElement("div");
                overlay.className = "absolute inset-0 bg-green-50 rounded-xl my-1";
                card.appendChild(overlay);

                // Texto oferta
                const content = document.createElement("div");
                content.className = "relative z-10 text-black";
                const p = document.createElement("p");
                p.textContent = oferta;
                content.appendChild(p);

                card.appendChild(content);
                contenedor.appendChild(card);
            });
        } else {
            titulo.textContent = "No tenemos ofertas especiales para hoy";
            const msg = document.createElement("p");
            msg.className = "text-center text-gray-600 col-span-3";
            msg.textContent = "Vuelve mañana para ver nuestras promociones 😊";
            contenedor.appendChild(msg);
        }
    }

};
