# 🐦 Flappy - Sistema de Ventas e Inventario

Un sistema web moderno para la gestión integral de inventarios, ventas y operaciones comerciales, desarrollado con Laravel y React. 

## ✨ Características Principales

- **Gestión de Inventario**: Control completo de productos, lotes y stock en tiempo real
- **Operaciones de Stock**: Registro de entradas y salidas con validación automática 
- **Sistema de Ventas**: Procesamiento de transacciones con detalles por lote
- **Gestión de Entidades**: Administración de proveedores, clientes y métodos de pago
- **Control de Estados**: Sistema integral de habilitación/deshabilitación de registros
- **Interfaz Moderna**: Frontend React con componentes reutilizables y filtros avanzados

## 🛠️ Stack Tecnológico

### Backend
- **Laravel 10** - Framework PHP robusto
- **MongoDB** - Base de datos NoSQL
- **Inertia.js** - Conecta Laravel con React sin API

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Tailwind CSS** - Framework de estilos utilitarios
- **Headless UI** - Componentes accesibles

## 🚀 Instalación

### Prerrequisitos
- PHP 8.1+
- Composer
- Node.js 16+
- MongoDB

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/franklinnot/Flappy.git
   cd Flappy
   ```

2. **Instalar dependencias de PHP**
   ```bash
   composer install
   ```

3. **Instalar dependencias de Node.js**
   ```bash
   npm install
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configurar MongoDB**
   Edita tu archivo `.env` con la configuración de MongoDB:
   ```env
   DB_CONNECTION=mongodb
   DB_HOST=127.0.0.1
   DB_PORT=27017
   DB_DATABASE=flappy
   ```

6. **Compilar assets**
   ```bash
   npm run build
   # o para desarrollo
   npm run dev
   ```

7. **Iniciar el servidor**
   ```bash
   php artisan serve
   ```

## 📋 Funcionalidades del Sistema

### Gestión de Operaciones
El sistema maneja dos tipos principales de operaciones de stock [5](#0-4) :

- **Entradas (INPUT)**: Incrementan el stock del lote
- **Salidas (OUTPUT)**: Decrementan el stock con validación de disponibilidad

### Control de Inventario
- Productos organizados por categorías y unidades de medida
- Lotes con códigos únicos y control de stock
- Validación automática de stock insuficiente [2](#0-1) 

### Sistema de Ventas
- Transacciones con múltiples detalles por lote
- Integración con métodos de pago [6](#0-5) 
- Control de estados (habilitado/deshabilitado)

### Interfaz de Usuario
- Filtros avanzados en tiempo real [7](#0-6) 
- Componentes reutilizables con validación
- Notificaciones toast para feedback del usuario

## 🔧 Estructura del Proyecto

```
app/
├── Http/Controllers/     # Controladores organizados por módulo
├── Models/              # Modelos Eloquent para MongoDB
└── Enums/              # Enumeraciones (Status, TypesOperation)

resources/
├── js/
│   ├── Components/     # Componentes React reutilizables
│   └── Pages/         # Páginas organizadas por módulo
└── views/             # Plantillas Blade

config/
└── database.php       # Configuración de MongoDB
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. [8](#0-7) 

---

⭐ ¡No olvides dar una estrella al proyecto si te resulta útil!
