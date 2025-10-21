# Design Document

## Overview

La aplicación Onomántica presenta problemas críticos en la visualización de la información de nombres. El campo `significado` en los datos contiene cinco párrafos separados por doble salto de línea (`\n\n`) que deben mostrarse como secciones independientes con títulos e íconos específicos. Actualmente, el código intenta dividir el contenido pero no lo hace correctamente, resultando en una visualización incompleta.

## Architecture

### Estructura de Datos Actual
- **Tipo Principal**: `NombreItem` (no `NameData` como se usa erróneamente en el código)
- **Campo Significado**: Contiene 5 párrafos separados por `\n\n`:
  1. Etimología y significado básico
  2. Figuras históricas y legado
  3. Relato poético/simbólico
  4. Narrativa épica/fantástica
  5. Numerología

### Problema Identificado
El código actual en `App.tsx` usa un tipo inexistente `NameData` en lugar de `NombreItem`, y la lógica de división de párrafos no funciona correctamente para mostrar las cinco secciones.

## Components and Interfaces

### 1. Corrección de Tipos
```typescript
// Corregir importación en App.tsx
import type { NombreItem } from './types';

// Actualizar todas las referencias de NameData a NombreItem
```

### 2. Componente NameCard Mejorado
```typescript
interface NameCardProps {
  item: NombreItem | null;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}
```

### 3. Lógica de División de Contenido
```typescript
const parseSections = (significado: string): string[] => {
  // Dividir por doble salto de línea y filtrar secciones vacías
  return significado.split('\n\n').filter(section => section.trim().length > 0);
};
```

### 4. Mapeo de Secciones
```typescript
const sectionConfig = [
  { title: "Origen y Significado", icon: BookText },
  { title: "Legado y Personajes", icon: Users },
  { title: "Relato Poético", icon: Feather },
  { title: "Narrativa Épica", icon: Sword },
  { title: "Numerología", icon: Gem }
];
```

### 5. Componente Modal/Dialog
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ShareModalProps extends ModalProps {
  nameData: NombreItem;
  shareUrl: string;
}
```

### 6. Componente SearchInput con Lupa
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
}
```

### 7. Funcionalidad de Compartir
```typescript
interface ShareOptions {
  copyLink: () => Promise<void>;
  shareWhatsApp: (text: string, url: string) => void;
  shareFacebook: (url: string) => void;
  shareTwitter: (text: string, url: string) => void;
  generateImage: (nameData: NombreItem) => Promise<string>;
}
```

### 8. Footer Component
```typescript
interface FooterProps {
  author: string;
  className?: string;
}
```

## Data Models

### NombreItem (Existente - Correcto)
```typescript
export interface NombreItem {
  nombre: string;
  genero: 'M'|'F'|'U'|string;
  origen: string;
  significado: string; // Contiene 5 párrafos separados por \n\n
  historia: { 
    tipo: HistoriaTipo; 
    relato: string; 
  };
}
```

### Estructura del Campo Significado
```
Párrafo 1: Etimología y definición básica
\n\n
Párrafo 2: Figuras históricas y legado cultural
\n\n
Párrafo 3: Relato poético/simbólico
\n\n
Párrafo 4: Narrativa épica/fantástica
\n\n
Párrafo 5: Numerología y vibración numérica
```

## Error Handling

### 1. Manejo de Contenido Insuficiente
- Si hay menos de 5 párrafos, mostrar solo las secciones disponibles
- Usar títulos dinámicos basados en el contenido disponible
- Evitar secciones vacías

### 2. Validación de Tipos
- Corregir todas las referencias de `NameData` a `NombreItem`
- Asegurar compatibilidad con la estructura de datos existente

### 3. Fallback para Nombres Generados
- Mantener la funcionalidad existente para nombres no encontrados
- Asegurar que el contenido generado también se divida correctamente

## Testing Strategy

### 1. Pruebas de División de Contenido
- Verificar que `significado.split('\n\n')` funcione correctamente
- Probar con diferentes cantidades de párrafos
- Validar filtrado de secciones vacías

### 2. Pruebas de Renderizado
- Confirmar que se muestren exactamente las secciones con contenido
- Verificar que cada sección tenga título e ícono correcto
- Probar responsive design

### 3. Pruebas de Datos
- Validar con nombres existentes en la base de datos
- Probar con nombres generados dinámicamente
- Verificar manejo de casos edge (nombres vacíos, contenido malformado)

## Visual Design Improvements

### 1. Esquema de Colores
- Mantener el tema oscuro actual con acentos dorados
- Usar colores diferenciados para cada tipo de sección
- Mejorar contraste para mejor legibilidad

### 2. Layout y Espaciado
- Separación clara entre secciones
- Uso consistente de tipografía serif para títulos
- Espaciado vertical adecuado entre elementos

### 3. Iconografía
- Íconos específicos para cada tipo de contenido
- Tamaño y color consistente
- Alineación correcta con títulos

### 4. Ventanas Flotantes (Modal/Dialog)
- Implementar sistema de ventanas flotantes para mostrar información detallada
- Usar componentes de diálogo con fondo semi-transparente
- Animaciones suaves de entrada y salida
- Botón de cierre (X) en la esquina superior derecha
- Soporte para cerrar con tecla Escape o clic fuera del modal

### 5. Funcionalidad de Compartir
- Botón "Compartir" prominente en los resultados
- Opciones de compartir:
  - Copiar enlace al portapapeles
  - Compartir en redes sociales (WhatsApp, Facebook, Twitter)
  - Generar imagen para compartir con el resultado
- Feedback visual cuando se copia o comparte exitosamente

### 6. Búsqueda con Lupa
- Ícono de lupa (Search) integrado en el campo de búsqueda
- Posición: dentro del campo de entrada, lado derecho
- Funcionalidad: iniciar búsqueda al hacer clic
- Estados visuales: hover, active, disabled
- Accesibilidad: soporte para Enter y clic

### 7. Footer con Créditos
- Línea fija en la parte inferior de la página
- Texto: "Creado por Victor M.F. Avilan"
- Estilo: discreto pero visible, tipografía pequeña
- Color: tono dorado suave para mantener coherencia
- Posición: centrado horizontalmente

## Implementation Notes

### Prioridades de Corrección
1. **Crítico**: Corregir tipo `NameData` → `NombreItem`
2. **Crítico**: Implementar división correcta de párrafos
3. **Alto**: Mostrar las cinco secciones con títulos e íconos
4. **Alto**: Implementar búsqueda con lupa integrada
5. **Alto**: Agregar footer con créditos "Creado por Victor M.F. Avilan"
6. **Medio**: Implementar sistema de ventanas flotantes (modales)
7. **Medio**: Agregar funcionalidad de compartir resultados
8. **Medio**: Mejorar diseño visual según imágenes de referencia
9. **Bajo**: Optimizaciones de rendimiento

### Compatibilidad
- Mantener funcionalidad existente para nombres generados
- Preservar la lógica de búsqueda y normalización
- Asegurar que los cambios no rompan la carga de datos