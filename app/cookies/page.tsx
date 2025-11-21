"use client";

import { IntegrateLogo } from "@/components/integrate-logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cookie, Shield, Settings, BarChart3, Lock } from "lucide-react";

export default function CookiesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <nav className="bg-white border-b-2 shadow-md" style={{ borderBottomColor: '#2C248E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <IntegrateLogo size="md" priority />
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2 border-2"
              style={{ borderColor: '#2C248E', color: '#2C248E' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
               style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}>
            <Cookie className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
            Política de Cookies
          </h1>
          <p className="text-gray-600 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#2C248E20' }}>
          <p className="text-gray-700 text-lg leading-relaxed">
            En <strong>INTEGRATE 2.0 - Test de Áreas Sensibles</strong>, utilizamos cookies y tecnologías similares para mejorar tu experiencia, garantizar la seguridad y analizar el uso de nuestra aplicación. Esta política explica qué cookies usamos y cómo puedes gestionarlas.
          </p>
        </div>

        {/* Contenido de la política */}
        <div className="space-y-8">
          {/* Sección 1 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#2C248E20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6" style={{ color: '#2C248E' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#2C248E' }}>
                1. ¿Qué son las Cookies?
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un período de tiempo.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  💡 Las cookies NO contienen virus ni pueden acceder a tu información personal sin tu consentimiento.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 2 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#8E235D20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6" style={{ color: '#8E235D' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#8E235D' }}>
                2. Tipos de Cookies que Utilizamos
              </h2>
            </div>
            <div className="text-gray-700 space-y-6">
              {/* Cookies Esenciales */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#2C248E' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C248E' }}>
                  🔒 Cookies Esenciales (Obligatorias)
                </h3>
                <p className="mb-2">
                  Necesarias para el funcionamiento básico de la aplicación. No se pueden desactivar.
                </p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Autenticación:</strong> Mantienen tu sesión activa en el panel de administración</li>
                  <li><strong>Seguridad:</strong> Protegen contra ataques CSRF y XSS</li>
                  <li><strong>Preferencias:</strong> Recuerdan tus configuraciones de idioma y tema</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  Duración: Sesión o hasta 30 días
                </p>
              </div>

              {/* Cookies Funcionales */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#8E235D' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8E235D' }}>
                  ⚙️ Cookies Funcionales (Opcionales)
                </h3>
                <p className="mb-2">
                  Mejoran la funcionalidad y personalización de la aplicación.
                </p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Resultados del test:</strong> Almacenan temporalmente las respuestas del cuestionario</li>
                  <li><strong>Preferencias de visualización:</strong> Recuerdan cómo prefieres ver el cubo 3D</li>
                  <li><strong>Caché de contenido:</strong> Mejoran la velocidad de carga</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  Duración: Hasta 90 días
                </p>
              </div>

              {/* Cookies Analíticas */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#D91D5C' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#D91D5C' }}>
                  📊 Cookies Analíticas (Opcionales)
                </h3>
                <p className="mb-2">
                  Nos ayudan a entender cómo los usuarios interactúan con la aplicación.
                </p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Estadísticas de uso:</strong> Páginas visitadas, tiempo de permanencia</li>
                  <li><strong>Rendimiento:</strong> Velocidad de carga, errores técnicos</li>
                  <li><strong>Interacciones:</strong> Clics en botones, uso del cubo 3D</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  Duración: Hasta 2 años • Proveedor: Google Analytics (anonimizado)
                </p>
              </div>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#F0872620' }}>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6" style={{ color: '#F08726' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#F08726' }}>
                3. Cookies de Terceros
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Utilizamos servicios de terceros que pueden establecer sus propias cookies:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">🔹 Supabase (Base de datos)</p>
                  <p className="text-sm text-gray-600">Cookies de autenticación y sesión. Ubicación: EU (RGPD compliant)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">🔹 Vercel (Hosting)</p>
                  <p className="text-sm text-gray-600">Cookies de rendimiento y CDN. Ubicación: Global</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold">🔹 Google Analytics (Opcional)</p>
                  <p className="text-sm text-gray-600">Cookies analíticas anonimizadas. Puedes desactivarlas en la configuración.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sección 4 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#2C248E20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6" style={{ color: '#2C248E' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#2C248E' }}>
                4. Cómo Gestionar las Cookies
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Tienes control total sobre las cookies que aceptas:
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">🌐 Desde tu Navegador</h4>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                    <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                    <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                    <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">⚙️ Desde Nuestra Aplicación</h4>
                  <p className="text-sm text-green-800">
                    Próximamente: Panel de configuración de cookies en el footer de la página.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm font-semibold text-yellow-900">
                  ⚠️ Advertencia: Desactivar las cookies esenciales puede afectar la funcionalidad de la aplicación.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 5 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#8E235D20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6" style={{ color: '#8E235D' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#8E235D' }}>
                5. Cumplimiento Legal
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Nuestra política de cookies cumple con:
              </p>
              <ul className="space-y-2">
                <li>✅ <strong>RGPD</strong> (Reglamento General de Protección de Datos - UE)</li>
                <li>✅ <strong>ePrivacy Directive</strong> (Directiva de Privacidad Electrónica)</li>
                <li>✅ <strong>LOPD-GDD</strong> (Ley Orgánica de Protección de Datos - España)</li>
              </ul>
              <p className="text-sm text-gray-600">
                Solicitamos tu consentimiento explícito antes de utilizar cookies no esenciales.
              </p>
            </div>
          </section>
        </div>

        {/* Footer de la página */}
        <div className="text-center pt-8 border-t-2" style={{ borderColor: '#2C248E20' }}>
          <p className="text-gray-600 mb-4">
            Para más información sobre cómo protegemos tus datos, consulta nuestra{" "}
            <button
              onClick={() => router.push("/privacidad")}
              className="text-blue-600 hover:underline font-semibold"
            >
              Política de Privacidad
            </button>
          </p>
          <Button
            onClick={() => router.push("/")}
            className="text-white font-bold shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #2C248E 0%, #D91D5C 100%)' }}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </main>
  );
}

