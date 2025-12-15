import { useState, useEffect } from 'react'
import { database, auth } from './firebase'
import { ref, onValue } from 'firebase/database'
import { signInWithEmailAndPassword } from 'firebase/auth'
import * as XLSX from 'xlsx'
import './App.css'

function App() {
  const [ultimaLectura, setUltimaLectura] = useState(null)
  const [historial, setHistorial] = useState([])
  const [conectado, setConectado] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const [alertas, setAlertas] = useState([])
  const registrosPorPagina = 20

  // Autenticación automática
  useEffect(() => {
    const autenticar = async () => {
      try {
        await signInWithEmailAndPassword(
          auth,
          'gabrielcardenassanchez80@gmail.com',
          'gabriel0503'
        )
        setAutenticado(true)
        console.log('Autenticación exitosa')
      } catch (error) {
        console.error('Error de autenticación:', error.message)
        setAutenticado(false)
      }
    }
    autenticar()
  }, [])

  useEffect(() => {
    if (!autenticado) return
    const lecturaRef = ref(database, 'ultima_lectura')
    
    const unsubscribe = onValue(lecturaRef, (snapshot) => {
      console.log('Snapshot exists:', snapshot.exists())
      if (snapshot.exists()) {
        const datos = snapshot.val()
        console.log('Datos recibidos de ultima_lectura:', datos)
        setUltimaLectura(datos)
        setConectado(true)
        console.log('Estado conectado establecido a: true')
        
        // Verificar si TDS supera 1000 y crear alerta
        if (datos.tds > 1000) {
          const nuevaAlerta = {
            id: Date.now(),
            tds: datos.tds,
            timestamp: new Date().toLocaleTimeString()
          }
          
          setAlertas(prev => {
            const nuevasAlertas = [...prev, nuevaAlerta]
            // Mantener máximo 4 alertas, eliminar la primera si hay más
            if (nuevasAlertas.length > 4) {
              return nuevasAlertas.slice(1)
            }
            return nuevasAlertas
          })
          
          // Eliminar la alerta después de 5 segundos
          setTimeout(() => {
            setAlertas(prev => prev.filter(a => a.id !== nuevaAlerta.id))
          }, 5000)
        }
      } else {
        console.log('No hay datos en ultima_lectura')
        setConectado(false)
      }
    }, (error) => {
      console.error('Error al leer Firebase:', error)
      setConectado(false)
    })

    return () => unsubscribe()
  }, [autenticado])

  useEffect(() => {
    if (!autenticado) return
    
    const historialRef = ref(database, 'historial')
    
    const unsubscribe = onValue(historialRef, (snapshot) => {
      console.log('Historial snapshot exists:', snapshot.exists())
      if (snapshot.exists()) {
        const datos = snapshot.val()
        console.log('Datos del historial:', datos)
        
        // Filtrar y convertir los datos
        const historialArray = Object.entries(datos)
          .filter(([key]) => key !== 'ultima_lectura') // Excluir ultima_lectura del historial
          .map(([key, value]) => {
            // Convertir timestamp a fecha y hora
            const fecha = new Date(parseInt(key) * 1000)
            return {
              id: key,
              timestamp: parseInt(key),
              tds: value.tds,
              voltaje: value.voltaje,
              estado: value.estado,
              accion: value.accion,
              fecha: {
                dia: fecha.getDate(),
                mes: fecha.getMonth() + 1,
                anio: fecha.getFullYear()
              },
              hora: {
                hora: fecha.getHours(),
                minuto: fecha.getMinutes(),
                segundo: fecha.getSeconds()
              }
            }
          })
          .sort((a, b) => {
            // Primero ordena por TDS: los que tienen TDS > 1000 van al final
            const aTdsAlto = a.tds > 1000 ? 1 : 0
            const bTdsAlto = b.tds > 1000 ? 1 : 0
            
            if (aTdsAlto !== bTdsAlto) {
              return aTdsAlto - bTdsAlto
            }
            
            // Dentro de cada grupo, ordena por timestamp descendente
            return b.timestamp - a.timestamp
          })
        
        console.log('Historial procesado:', historialArray.length, 'registros')
        setHistorial(historialArray)
      }
    })

    return () => unsubscribe()
  }, [autenticado])

  const getColorClass = (tds) => {
    if (tds <= 50) return 'border-blue-400 text-blue-400'
    if (tds <= 150) return 'border-green-500 text-green-500'
    if (tds <= 300) return 'border-blue-500 text-blue-500'
    if (tds <= 500) return 'border-amber-500 text-amber-500'
    if (tds <= 1000) return 'border-orange-500 text-orange-500'
    if (tds <= 2000) return 'border-red-600 text-red-600'
    return 'border-red-900 text-red-900'
  }

  const getClasificacion = (tds) => {
    if (tds <= 50) return 'Agua muy pura (RO/destilada)'
    if (tds <= 150) return 'Excelente'
    if (tds <= 300) return 'Buena/Aceptable'
    if (tds <= 500) return 'Moderada / Agua dura'
    if (tds <= 1000) return 'Deficiente'
    if (tds <= 2000) return 'Muy deficiente'
    return 'Crítica'
  }

  const getExplicacion = (tds) => {
    if (tds <= 50) return 'No es agua natural; muy baja mineralización.'
    if (tds <= 150) return 'Agua tratada de alta calidad.'
    if (tds <= 300) return 'Agua potable normal.'
    if (tds <= 500) return 'Todavía APTA según la OMS.'
    if (tds <= 1000) return 'Evitar consumo prolongado.'
    if (tds <= 2000) return 'No apta para consumo.'
    return 'Posible agua salobre o contaminada.'
  }

  const exportarExcel = () => {
    const datosExcel = historial.map((registro) => ({
      'Fecha': `${registro.fecha.dia}/${registro.fecha.mes}/${registro.fecha.anio}`,
      'Hora': `${String(registro.hora.hora).padStart(2, '0')}:${String(registro.hora.minuto).padStart(2, '0')}:${String(registro.hora.segundo).padStart(2, '0')}`,
      'TDS (ppm)': registro.tds,
      'Clasificación': getClasificacion(registro.tds),
      'Explicación': getExplicacion(registro.tds),
      'Voltaje (V)': registro.voltaje,
      'Acción Recomendada': registro.accion
    }))

    const ws = XLSX.utils.json_to_sheet(datosExcel)
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 12 }, // Fecha
      { wch: 10 }, // Hora
      { wch: 12 }, // TDS
      { wch: 30 }, // Clasificación
      { wch: 45 }, // Explicación
      { wch: 12 }, // Voltaje
      { wch: 50 }  // Acción
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Historial TDS')
    
    const fecha = new Date()
    const nombreArchivo = `Historial_TDS_${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}.xlsx`
    XLSX.writeFile(wb, nombreArchivo)
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Alertas laterales */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-red-400 animate-slide-in"
            style={{
              animation: 'slideIn 0.3s ease-out, slideOut 0.3s ease-in 4.7s forwards'
            }}
          >
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold text-lg">¡ALERTA TDS ALTO!</p>
                <p className="text-sm mt-1">Nivel detectado: <span className="font-bold">{alerta.tds.toFixed(2)} ppm</span></p>
                <p className="text-xs mt-1 opacity-90">{alerta.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="w-full bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 shadow-2xl mb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                Monitor de Calidad del Agua
              </h1>
              <p className="text-slate-400 text-sm mt-1">Sistema de Monitoreo TDS en Tiempo Real</p>
            </div>
            <div className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 border
              ${conectado 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
              <span className="w-2 h-2 rounded-full animate-pulse" 
                    style={{backgroundColor: conectado ? '#10b981' : '#ef4444'}}></span>
              {conectado ? 'Conectado' : 'Desconectado'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {ultimaLectura ? (
          <>
            {/* Card Principal - TDS */}
            <div className={`bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-l-4 ${getColorClass(ultimaLectura.tds)} p-10 sm:p-16 mb-12`}>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
                  Nivel de Sólidos Disueltos Totales
                </div>
                <div className="flex items-baseline gap-4">
                  <div className={`text-8xl sm:text-9xl font-bold ${getColorClass(ultimaLectura.tds)} drop-shadow-lg`}>
                    {ultimaLectura.tds}
                  </div>
                  <div className="text-4xl font-medium text-slate-400">ppm</div>
                </div>
                <div className={`text-lg sm:text-xl font-semibold mt-4 uppercase tracking-wider ${getColorClass(ultimaLectura.tds)}`}>
                  {ultimaLectura.estado}
                </div>
              </div>
            </div>

            {/* Grid de Información */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Fecha */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-6 hover:border-slate-600 transition-all">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Fecha de Medición</div>
                <div className="text-3xl font-bold text-slate-100">
                  {ultimaLectura.fecha.dia}/{ultimaLectura.fecha.mes}/{ultimaLectura.fecha.anio}
                </div>
              </div>

              {/* Hora */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-6 hover:border-slate-600 transition-all">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Hora de Lectura</div>
                <div className="text-3xl font-bold text-slate-100 font-mono">
                  {String(ultimaLectura.hora.hora).padStart(2, '0')}:
                  {String(ultimaLectura.hora.minuto).padStart(2, '0')}:
                  {String(ultimaLectura.hora.segundo).padStart(2, '0')}
                </div>
              </div>

              {/* Voltaje */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-6 hover:border-slate-600 transition-all">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Voltaje del Sensor</div>
                <div className="text-3xl font-bold text-slate-100">
                  {ultimaLectura.voltaje} <span className="text-lg text-slate-400">V</span>
                </div>
              </div>

              {/* Acción */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-6 hover:border-slate-600 transition-all">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Acción Recomendada</div>
                <div className="text-base font-medium text-slate-200 leading-tight">{ultimaLectura.accion}</div>
              </div>
            </div>

            {/* Escala de Referencia */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-100 mb-8 uppercase tracking-wide">Escala de Clasificación TDS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                    <span className="font-bold text-slate-100 text-sm">0-50 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Agua muy pura (RO/destilada)</p>
                  <p className="text-xs text-slate-500">No es agua natural; muy baja mineralización.</p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="font-bold text-slate-100 text-sm">51-150 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Excelente</p>
                  <p className="text-xs text-slate-500">Agua tratada de alta calidad.</p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                    <span className="font-bold text-slate-100 text-sm">151-300 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Buena/Aceptable</p>
                  <p className="text-xs text-slate-500">Agua potable normal.</p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div>
                    <span className="font-bold text-slate-100 text-sm">301-500 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Moderada / Agua dura</p>
                  <p className="text-xs text-slate-500">Todavía APTA según la OMS.</p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
                    <span className="font-bold text-slate-100 text-sm">501-1000 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Deficiente</p>
                  <p className="text-xs text-slate-500">Evitar consumo prolongado.</p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600 shadow-lg shadow-red-600/50"></div>
                    <span className="font-bold text-slate-100 text-sm">1001-2000 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Muy deficiente</p>
                  <p className="text-xs text-slate-500">No apta para consumo.</p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-900 shadow-lg shadow-red-900/50"></div>
                    <span className="font-bold text-slate-100 text-sm">&gt;2000 ppm</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300">Crítica</p>
                  <p className="text-xs text-slate-500">Posible agua salobre o contaminada.</p>
                </div>
              </div>
            </div>

            {/* Historial */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-lg p-8 mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wide">Historial de Mediciones</h3>
                <button 
                  onClick={exportarExcel}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                  disabled={historial.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar a Excel
                </button>
              </div>
              
              {historial.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-slate-400 text-sm">
                      Total de registros: <span className="font-bold text-slate-200">{historial.length}</span>
                      {' '} | Página <span className="font-bold text-slate-200">{paginaActual}</span> de <span className="font-bold text-slate-200">{Math.ceil(historial.length / registrosPorPagina)}</span>
                    </div>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-700">
                        <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-700/30">Fecha</th>
                        <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-700/30">Hora</th>
                        <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-700/30">TDS (ppm)</th>
                        <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-700/30">Clasificación</th>
                        <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-700/30">Explicación</th>
                        <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Voltaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina).map((registro) => (
                        <tr key={registro.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                          <td className="py-4 px-4 text-sm text-slate-200 border-r border-slate-700/30">
                            {registro.fecha.dia}/{registro.fecha.mes}/{registro.fecha.anio}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-200 font-mono border-r border-slate-700/30">
                            {String(registro.hora.hora).padStart(2, '0')}:
                            {String(registro.hora.minuto).padStart(2, '0')}:
                            {String(registro.hora.segundo).padStart(2, '0')}
                          </td>
                          <td className="py-4 px-4 border-r border-slate-700/30">
                            <span className={`text-sm font-bold ${getColorClass(registro.tds)}`}>
                              {registro.tds}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-300 border-r border-slate-700/30">
                            {getClasificacion(registro.tds)}
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-400 border-r border-slate-700/30">
                            {getExplicacion(registro.tds)}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-300">
                            {registro.voltaje} V
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Paginación */}
                  {Math.ceil(historial.length / registrosPorPagina) > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                        disabled={paginaActual === 1}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: Math.ceil(historial.length / registrosPorPagina) }, (_, i) => i + 1).map(num => (
                          <button
                            key={num}
                            onClick={() => setPaginaActual(num)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              paginaActual === num
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setPaginaActual(prev => Math.min(Math.ceil(historial.length / registrosPorPagina), prev + 1))}
                        disabled={paginaActual === Math.ceil(historial.length / registrosPorPagina)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">No hay datos en el historial</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-slate-400 rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-semibold text-slate-300">Esperando datos del sensor...</p>
            <p className="text-sm text-slate-500 mt-2">Conectando con Firebase</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
