"use client";

import { IntegrateLogo } from "@/components/integrate-logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail, Calendar } from "lucide-react";

export default function PrivacidadPage() {
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
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
            Política de Privacidad
          </h1>
          <p className="text-gray-600 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Contenido de la política */}
        <div className="prose prose-lg max-w-none space-y-8">
          {/* Sección 1 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#2C248E20' }}>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6" style={{ color: '#2C248E' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#2C248E' }}>
                1. Responsable del Tratamiento de Datos
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <p className="font-semibold text-blue-900 mb-3">Identidad del Responsable:</p>
                <ul className="space-y-2 text-blue-800">
                  <li><strong>Denominación:</strong> INTEGRATE 2.0 - Test de Áreas Sensibles</li>
                  <li><strong>Finalidad:</strong> Diagnóstico organizativo basado en el modelo INTEGRATE 2.0</li>
                  <li><strong>Email de contacto:</strong> privacidad@integrate.com</li>
                  <li><strong>Delegado de Protección de Datos (DPO):</strong> dpo@integrate.com</li>
                  <li><strong>Ubicación de servidores:</strong> Unión Europea (Supabase - Frankfurt, Alemania)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 2 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#8E235D20' }}>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6" style={{ color: '#8E235D' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#8E235D' }}>
                2. Información que Recopilamos
              </h2>
            </div>
            <div className="text-gray-700 space-y-6">
              <p className="text-lg font-semibold">
                En INTEGRATE 2.0, recopilamos únicamente la información estrictamente necesaria para proporcionar nuestro servicio de diagnóstico organizativo:
              </p>

              {/* Datos de Administradores */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#2C248E' }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2C248E' }}>
                  📧 Datos de Administradores
                </h3>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> Dirección de correo electrónico para autenticación</li>
                  <li><strong>Contraseña:</strong> Almacenada con hash bcrypt (nunca en texto plano)</li>
                  <li><strong>Fecha de registro:</strong> Timestamp de creación de cuenta</li>
                  <li><strong>Última sesión:</strong> Fecha y hora del último acceso</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Base legal:</strong> Ejecución de contrato (Art. 6.1.b RGPD)
                </p>
              </div>

              {/* Respuestas del Test */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#8E235D' }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#8E235D' }}>
                  📊 Respuestas del Test (Anónimas)
                </h3>
                <ul className="space-y-2">
                  <li><strong>24 respuestas:</strong> Valoraciones de 0.0 a 4.0 en escala Likert</li>
                  <li><strong>Código único:</strong> Identificador alfanumérico generado aleatoriamente (ej: ABC123)</li>
                  <li><strong>Fecha de realización:</strong> Timestamp de completado del test</li>
                  <li><strong>Perspectiva:</strong> Directiva u Operativa (sin identificación personal)</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Base legal:</strong> Consentimiento explícito (Art. 6.1.a RGPD)
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-3">
                  <p className="text-sm font-semibold text-green-900">
                    ✅ Las respuestas del test NO contienen datos personales identificables. El sistema es 100% anónimo.
                  </p>
                </div>
              </div>

              {/* Datos Técnicos */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#D91D5C' }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#D91D5C' }}>
                  🔧 Datos Técnicos y de Navegación
                </h3>
                <ul className="space-y-2">
                  <li><strong>Dirección IP:</strong> Para seguridad y prevención de fraude</li>
                  <li><strong>User-Agent:</strong> Tipo de navegador y sistema operativo</li>
                  <li><strong>Cookies técnicas:</strong> Sesión, autenticación, preferencias</li>
                  <li><strong>Logs de servidor:</strong> Accesos, errores, rendimiento (anonimizados después de 90 días)</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Base legal:</strong> Interés legítimo (Art. 6.1.f RGPD) - Seguridad y mejora del servicio
                </p>
              </div>

              {/* Datos que NO recopilamos */}
              <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold mb-3 text-red-900">
                  ❌ Datos que NO Recopilamos
                </h3>
                <ul className="space-y-2 text-red-800">
                  <li>❌ Nombre completo de participantes del test</li>
                  <li>❌ DNI, NIF o documentos de identidad</li>
                  <li>❌ Número de teléfono</li>
                  <li>❌ Dirección postal</li>
                  <li>❌ Datos bancarios o de pago</li>
                  <li>❌ Datos sensibles (salud, religión, orientación sexual, etc.)</li>
                  <li>❌ Datos de menores de 16 años</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#F0872620' }}>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6" style={{ color: '#F08726' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#F08726' }}>
                3. Finalidades del Tratamiento
              </h2>
            </div>
            <div className="text-gray-700 space-y-6">
              <p className="text-lg font-semibold">
                Utilizamos la información recopilada exclusivamente para las siguientes finalidades:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">✅ Prestación del Servicio</h4>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li>• Generar el cubo 3D interactivo</li>
                    <li>• Calcular puntuaciones por área</li>
                    <li>• Mostrar resultados visuales</li>
                    <li>• Exportar informes en PDF/PNG</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">✅ Gestión de Acceso</h4>
                  <ul className="text-sm space-y-1 text-green-800">
                    <li>• Autenticación de administradores</li>
                    <li>• Control de sesiones</li>
                    <li>• Recuperación de contraseña</li>
                    <li>• Gestión del panel CMS</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-900 mb-2">✅ Seguridad</h4>
                  <ul className="text-sm space-y-1 text-purple-800">
                    <li>• Prevención de accesos no autorizados</li>
                    <li>• Detección de fraude</li>
                    <li>• Logs de auditoría</li>
                    <li>• Protección contra ataques</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-2">✅ Mejora del Servicio</h4>
                  <ul className="text-sm space-y-1 text-orange-800">
                    <li>• Análisis de uso (anonimizado)</li>
                    <li>• Optimización de rendimiento</li>
                    <li>• Corrección de errores</li>
                    <li>• Desarrollo de nuevas funciones</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold mb-3 text-red-900">
                  ❌ Usos Prohibidos
                </h3>
                <ul className="space-y-2 text-red-800 font-semibold">
                  <li>❌ NO vendemos tus datos a terceros</li>
                  <li>❌ NO compartimos datos con empresas de marketing</li>
                  <li>❌ NO usamos datos para publicidad dirigida</li>
                  <li>❌ NO cedemos datos sin tu consentimiento explícito</li>
                  <li>❌ NO realizamos perfilado automatizado con efectos legales</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 4 - RGPD */}
          <section id="rgpd" className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#D91D5C20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6" style={{ color: '#D91D5C' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#D91D5C' }}>
                4. Derechos del Usuario (RGPD)
              </h2>
            </div>
            <div className="text-gray-700 space-y-6">
              <p className="text-lg font-semibold">
                Cumplimos íntegramente con el Reglamento General de Protección de Datos (RGPD - UE 2016/679). Como usuario, tienes los siguientes derechos:
              </p>

              {/* Derecho de Acceso */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#2C248E' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C248E' }}>
                  📋 Derecho de Acceso (Art. 15 RGPD)
                </h3>
                <p className="mb-2">Puedes solicitar:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Confirmación de si tratamos tus datos personales</li>
                  <li>• Copia de todos tus datos almacenados</li>
                  <li>• Información sobre las finalidades del tratamiento</li>
                  <li>• Categorías de datos que procesamos</li>
                  <li>• Destinatarios de tus datos (si los hay)</li>
                  <li>• Plazo de conservación previsto</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Plazo de respuesta:</strong> 1 mes (ampliable a 3 meses en casos complejos)
                </p>
              </div>

              {/* Derecho de Rectificación */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#8E235D' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8E235D' }}>
                  ✏️ Derecho de Rectificación (Art. 16 RGPD)
                </h3>
                <p className="mb-2">Puedes solicitar la corrección de:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Datos inexactos o erróneos</li>
                  <li>• Datos incompletos</li>
                  <li>• Información desactualizada</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Ejemplo:</strong> Cambiar tu email de administrador
                </p>
              </div>

              {/* Derecho de Supresión */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#D91D5C' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#D91D5C' }}>
                  🗑️ Derecho de Supresión / "Derecho al Olvido" (Art. 17 RGPD)
                </h3>
                <p className="mb-2">Puedes solicitar la eliminación de tus datos cuando:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Ya no sean necesarios para los fines para los que fueron recogidos</li>
                  <li>• Retires tu consentimiento</li>
                  <li>• Te opongas al tratamiento y no prevalezcan motivos legítimos</li>
                  <li>• Los datos hayan sido tratados ilícitamente</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mt-2">
                  <p className="text-xs font-semibold text-yellow-900">
                    ⚠️ Nota: Algunos datos pueden conservarse por obligaciones legales (ej: logs de seguridad durante 90 días)
                  </p>
                </div>
              </div>

              {/* Derecho de Portabilidad */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#F08726' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#F08726' }}>
                  📦 Derecho de Portabilidad (Art. 20 RGPD)
                </h3>
                <p className="mb-2">Puedes solicitar tus datos en formato estructurado, de uso común y lectura mecánica:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Formato JSON con todas tus respuestas del test</li>
                  <li>• Exportación de resultados en CSV</li>
                  <li>• Datos de administrador en formato portable</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Uso:</strong> Puedes transferir estos datos a otro servicio similar
                </p>
              </div>

              {/* Derecho de Oposición */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#E65B3E' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#E65B3E' }}>
                  🛑 Derecho de Oposición (Art. 21 RGPD)
                </h3>
                <p className="mb-2">Puedes oponerte al tratamiento de tus datos cuando:</p>
                <ul className="space-y-1 text-sm">
                  <li>• El tratamiento se base en interés legítimo (ej: análisis estadísticos)</li>
                  <li>• Los datos se usen para marketing directo</li>
                  <li>• Se realice elaboración de perfiles</li>
                </ul>
              </div>

              {/* Derecho de Limitación */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#412761' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#412761' }}>
                  ⏸️ Derecho de Limitación del Tratamiento (Art. 18 RGPD)
                </h3>
                <p className="mb-2">Puedes solicitar que suspendamos el tratamiento de tus datos cuando:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Impugnes la exactitud de los datos (durante la verificación)</li>
                  <li>• El tratamiento sea ilícito pero no quieras que se supriman</li>
                  <li>• Necesites los datos para reclamaciones legales</li>
                  <li>• Te hayas opuesto al tratamiento (durante la verificación)</li>
                </ul>
              </div>

              {/* Derecho a no ser objeto de decisiones automatizadas */}
              <div className="border-l-4 pl-4" style={{ borderColor: '#2C248E' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2C248E' }}>
                  🤖 Derecho a no ser objeto de Decisiones Automatizadas (Art. 22 RGPD)
                </h3>
                <p className="text-sm">
                  Tienes derecho a no ser objeto de decisiones basadas únicamente en tratamiento automatizado que produzcan efectos jurídicos o te afecten significativamente.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-3 mt-2">
                  <p className="text-xs font-semibold text-green-900">
                    ✅ En INTEGRATE 2.0 NO realizamos decisiones automatizadas con efectos legales. Los resultados son meramente informativos.
                  </p>
                </div>
              </div>

              {/* Cómo ejercer tus derechos */}
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold mb-3 text-blue-900">
                  📧 Cómo Ejercer tus Derechos
                </h3>
                <p className="text-blue-800 mb-3">
                  Para ejercer cualquiera de estos derechos, envía un email a:
                </p>
                <div className="bg-white rounded p-4 mb-3">
                  <p className="font-mono text-lg font-bold text-blue-900">privacidad@integrate.com</p>
                </div>
                <p className="text-sm text-blue-800">
                  <strong>Incluye en tu solicitud:</strong>
                </p>
                <ul className="text-sm space-y-1 text-blue-800 mt-2">
                  <li>• Tu email de administrador (para verificación)</li>
                  <li>• Derecho que deseas ejercer</li>
                  <li>• Descripción clara de tu solicitud</li>
                  <li>• Copia de tu DNI/NIE (solo para verificación de identidad)</li>
                </ul>
                <p className="text-xs text-blue-700 mt-3">
                  <strong>Plazo de respuesta:</strong> 1 mes desde la recepción de la solicitud (ampliable a 3 meses en casos complejos)
                </p>
              </div>

              {/* Derecho a reclamar */}
              <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold mb-3 text-orange-900">
                  ⚖️ Derecho a Presentar una Reclamación
                </h3>
                <p className="text-orange-800 mb-3">
                  Si consideras que tus derechos han sido vulnerados, puedes presentar una reclamación ante la autoridad de control:
                </p>
                <div className="bg-white rounded p-4">
                  <p className="font-bold text-orange-900">Agencia Española de Protección de Datos (AEPD)</p>
                  <p className="text-sm text-orange-800 mt-2">
                    <strong>Web:</strong> <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline">www.aepd.es</a><br />
                    <strong>Dirección:</strong> C/ Jorge Juan, 6, 28001 Madrid<br />
                    <strong>Teléfono:</strong> 901 100 099 / 912 663 517
                  </p>
                </div>
              </div>

              {/* Medidas de Seguridad */}
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold mb-3 text-green-900">
                  🔒 Medidas de Seguridad Implementadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="font-semibold text-green-900 mb-2">Técnicas:</p>
                    <ul className="text-sm space-y-1 text-green-800">
                      <li>✅ Encriptación SSL/TLS (HTTPS)</li>
                      <li>✅ Hash bcrypt para contraseñas</li>
                      <li>✅ Firewall y protección DDoS</li>
                      <li>✅ Backups diarios encriptados</li>
                      <li>✅ Autenticación de dos factores (2FA)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-green-900 mb-2">Organizativas:</p>
                    <ul className="text-sm space-y-1 text-green-800">
                      <li>✅ Acceso restringido a datos</li>
                      <li>✅ Logs de auditoría</li>
                      <li>✅ Formación en protección de datos</li>
                      <li>✅ Política de privacidad by design</li>
                      <li>✅ Evaluaciones de impacto (DPIA)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección 4 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#F0872620' }}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6" style={{ color: '#F08726' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#F08726' }}>
                4. Retención de Datos
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Conservamos tus datos durante el tiempo necesario para cumplir con los fines descritos:
              </p>
              <ul className="space-y-2">
                <li><strong>Respuestas del test:</strong> Se almacenan mientras el usuario desee mantener acceso a sus resultados.</li>
                <li><strong>Datos de administrador:</strong> Se mantienen mientras la cuenta esté activa.</li>
                <li><strong>Logs de seguridad:</strong> Se conservan durante 90 días.</li>
              </ul>
              <p className="text-sm italic text-gray-600">
                Puedes solicitar la eliminación de tus datos en cualquier momento contactándonos.
              </p>
            </div>
          </section>

          {/* Sección 5 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#2C248E20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6" style={{ color: '#2C248E' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#2C248E' }}>
                5. Contacto
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Para ejercer tus derechos o realizar consultas sobre privacidad, contáctanos:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> privacidad@integrate.com</p>
                <p><strong>Responsable:</strong> INTEGRATE 2.0 - Test de Áreas Sensibles</p>
                <p><strong>Ubicación:</strong> Unión Europea</p>
              </div>
              <p className="text-sm text-gray-600">
                Responderemos a tu solicitud en un plazo máximo de 30 días.
              </p>
            </div>
          </section>

          {/* Sección 6 */}
          <section className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#8E235D20' }}>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6" style={{ color: '#8E235D' }} />
              <h2 className="text-2xl font-bold m-0" style={{ color: '#8E235D' }}>
                6. Cambios en esta Política
              </h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios significativos serán notificados mediante:
              </p>
              <ul className="space-y-2">
                <li>📧 Email a los administradores registrados</li>
                <li>🔔 Aviso destacado en la aplicación</li>
                <li>📅 Actualización de la fecha en la parte superior de esta página</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer de la página */}
        <div className="text-center pt-8 border-t-2" style={{ borderColor: '#2C248E20' }}>
          <p className="text-gray-600 mb-4">
            Esta política de privacidad es efectiva desde el {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
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

