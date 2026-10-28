-- ========================================================
-- ESQUEMA DE BASE DE DATOS PARA "LA MATERA DEL GRINGO"
-- Copia y pega este contenido en el SQL Editor de Supabase
-- ========================================================

-- 1. Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categorias (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Datos iniciales de categorías
INSERT INTO public.categorias (id, nombre) VALUES
    ('mates', 'Mates'),
    ('bombillas', 'Bombillas'),
    ('termos', 'Termos'),
    ('accesorios', 'Accesorios'),
    ('grabados', 'Grabados'),
    ('combos', 'Combos & Sets')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Productos
CREATE TABLE IF NOT EXISTS public.productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL REFERENCES public.categorias(id) ON UPDATE CASCADE,
    precio NUMERIC NOT NULL CHECK (precio >= 0),
    destacado BOOLEAN DEFAULT false NOT NULL,
    descripcion TEXT DEFAULT '',
    imagen TEXT NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0),
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Promociones y Descuentos Programados
CREATE TABLE IF NOT EXISTS public.promociones (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    producto_id INTEGER REFERENCES public.productos(id) ON DELETE CASCADE,
    categoria TEXT,
    porcentaje_descuento INTEGER NOT NULL CHECK (porcentaje_descuento > 0 AND porcentaje_descuento <= 100),
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    activa BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas RLS (Row Level Security)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promociones ENABLE ROW LEVEL SECURITY;

-- Acceso de lectura público para todos los visitantes
CREATE POLICY "Lectura pública de categorías" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de productos" ON public.productos FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública de promociones" ON public.promociones FOR SELECT USING (true);

-- Acceso completo para usuarios autenticados (Admin)
CREATE POLICY "Admin total en categorias" ON public.categorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total en productos" ON public.productos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total en promociones" ON public.promociones FOR ALL USING (auth.role() = 'authenticated');

-- 4. Storage Bucket para Imágenes de Productos
-- Ejecutar en caso de crear el bucket por SQL o crearlo desde el panel Storage como 'productos' (público)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Imágenes públicas de productos" ON storage.objects
FOR SELECT USING (bucket_id = 'productos');

CREATE POLICY "Admin sube y modifica imágenes" ON storage.objects
FOR ALL USING (bucket_id = 'productos' AND auth.role() = 'authenticated');
