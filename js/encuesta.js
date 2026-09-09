// ===== CONFIGURACIÓN =====
// 🔴 CAMBIA ESTA URL POR LA TUYA (la que copiaste de Google Apps Script)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby5PZXTs5sfuO0Y6ZpGUvl3aQPBEtrkyp-X_M38YVSjjwcDmNdEJLddjivNnE8wGnSW/exec';

// Datos de las zonas
const zonasData = {
    norte: {
        nombre: 'NORTE',
        estimacion: 350,
        subzonas: [
            'Arenas',
            'Los Espinillos/SUTE',
            'San Cayetano',
            'Guiñazú Norte y Colectora'
        ]
    },
    centro: {
        nombre: 'CENTRO',
        estimacion: 300,
        subzonas: [
            'B° Jardín',
            'Calle Eliseo Ortiz',
            'Centro'
        ]
    },
    sur: {
        nombre: 'SUR',
        estimacion: 420,
        subzonas: [
            'La Costanera (Dividido en 25 Cuadras)',
            'Las Chircas',
            'Cuadro Estación'
        ]
    }
};

// Variables globales
let zonaSeleccionada = '';
let subzonaSeleccionada = '';
let numeroEncuesta = 1;

// ===== FUNCIONES DE NÚMERO DE ENCUESTA =====
function cargarNumeroEncuesta() {
    const guardado = localStorage.getItem('numeroEncuesta');
    if (guardado) {
        numeroEncuesta = parseInt(guardado) + 1;
    } else {
        numeroEncuesta = 1;
    }
    localStorage.setItem('numeroEncuesta', numeroEncuesta.toString());
    return numeroEncuesta;
}

function actualizarNumeroEncuesta() {
    const num = cargarNumeroEncuesta();
    const elemento = document.getElementById('numeroEncuesta');
    if (elemento) {
        elemento.textContent = `#${String(num).padStart(3, '0')}`;
    }
    return num;
}

// ===== FUNCIÓN PARA VOLVER AL INICIO =====
function volverAlInicio() {
    if (confirm('¿Estás seguro de que quieres volver? Los datos del formulario se perderán.')) {
        window.location.href = 'index.html';
    }
}

// ===== FUNCIÓN PARA OBTENER ESTADÍSTICAS DESDE CSV PUBLICADO =====
function obtenerEstadisticasDesdeGoogle() {
    console.log('📊 Obteniendo estadísticas desde Google Sheets (CSV)...');
    
    // La URL de tu CSV publicado
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTuURL/pub?output=csv';
    
    return fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el CSV: ' + response.status);
            }
            return response.text();
        })
        .then(csvText => {
            // Convertir CSV a datos
            const lines = csvText.split('\n');
            
            // Si solo hay encabezados o está vacío
            if (lines.length <= 1) {
                return {
                    total: 0,
                    porZona: { norte: 0, centro: 0, sur: 0 },
                    porSubzona: {}
                };
            }
            
            // Obtener encabezados (primera línea)
            const headers = lines[0].split(',').map(h => h.trim());
            
            // Encontrar índices de las columnas
            const idxZonaNombre = headers.indexOf('zonaNombre');
            const idxSubzona = headers.indexOf('subzona');
            const idxZona = headers.indexOf('zona');
            
            // Si no encuentra las columnas, mostrar error
            if (idxZonaNombre === -1 || idxSubzona === -1) {
                console.warn('No se encontraron las columnas esperadas. Usando índices por posición.');
                // Usar índices por posición (D=3, E=4)
                return procesarCSVPorPosicion(lines);
            }
            
            // Procesar CSV usando encabezados
            return procesarCSVConHeaders(lines, idxZona, idxZonaNombre, idxSubzona);
        })
        .catch(error => {
            console.error('❌ Error al obtener estadísticas:', error);
            return obtenerEstadisticasLocales();
        });
}

// Función para procesar CSV usando encabezados
function procesarCSVConHeaders(lines, idxZona, idxZonaNombre, idxSubzona) {
    const porZona = { norte: 0, centro: 0, sur: 0 };
    const porSubzona = {};
    let total = 0;
    
    // Saltar encabezados (línea 0)
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim());
        
        // Saltar filas vacías
        if (row.length === 1 && row[0] === '') continue;
        
        const zona = row[idxZona] || '';
        const zonaNombre = row[idxZonaNombre] || '';
        const subzona = row[idxSubzona] || 'Sin especificar';
        
        // Contar por zona (usando el código de zona)
        if (zona && porZona.hasOwnProperty(zona)) {
            porZona[zona]++;
        }
        
        // Contar por subzona
        if (!porSubzona[subzona]) {
            porSubzona[subzona] = 0;
        }
        porSubzona[subzona]++;
        total++;
    }
    
    return { total, porZona, porSubzona };
}

// Función de respaldo usando posiciones (D=3, E=4)
function procesarCSVPorPosicion(lines) {
    const porZona = { norte: 0, centro: 0, sur: 0 };
    const porSubzona = {};
    let total = 0;
    
    // Saltar encabezados (línea 0)
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim());
        
        // Saltar filas vacías
        if (row.length === 1 && row[0] === '') continue;
        
        // Columna D = índice 3 (zonaNombre)
        // Columna E = índice 4 (subzona)
        // Columna C = índice 2 (zona)
        const zona = row[2] || '';
        const subzona = row[4] || 'Sin especificar';
        
        // Contar por zona
        if (zona && porZona.hasOwnProperty(zona)) {
            porZona[zona]++;
        }
        
        // Contar por subzona
        if (!porSubzona[subzona]) {
            porSubzona[subzona] = 0;
        }
        porSubzona[subzona]++;
        total++;
    }
    
    return { total, porZona, porSubzona };
}

// ===== FUNCIÓN PARA OBTENER ESTADÍSTICAS LOCALES (BACKUP) =====
function obtenerEstadisticasLocales() {
    console.log('📊 Usando estadísticas locales (backup)...');
    const encuestas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    const total = encuestas.length;
    
    const porZona = { norte: 0, centro: 0, sur: 0 };
    const porSubzona = {};
    
    encuestas.forEach(enc => {
        const zona = enc.zona || '';
        if (zona && porZona.hasOwnProperty(zona)) {
            porZona[zona]++;
        }
        
        const subzona = enc.subzona || 'Sin especificar';
        if (!porSubzona[subzona]) {
            porSubzona[subzona] = 0;
        }
        porSubzona[subzona]++;
    });
    
    return {
        total: total,
        porZona: porZona,
        porSubzona: porSubzona,
        local: true // Indicar que es dato local
    };
}

// ===== FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS EN LA PÁGINA =====
function actualizarEstadisticas() {
    console.log('🔄 Actualizando estadísticas...');
    
    // Mostrar estado "cargando"
    const totalElem = document.getElementById('totalEncuestas');
    const norteElem = document.getElementById('statsNorte');
    const centroElem = document.getElementById('statsCentro');
    const surElem = document.getElementById('statsSur');
    const detalleElem = document.getElementById('subzonasDetalle');
    
    if (totalElem) totalElem.textContent = '...';
    if (norteElem) norteElem.textContent = '...';
    if (centroElem) centroElem.textContent = '...';
    if (surElem) surElem.textContent = '...';
    
    obtenerEstadisticasDesdeGoogle()
        .then(data => {
            console.log('📊 Datos recibidos:', data);
            
            // Actualizar total
            if (totalElem) totalElem.textContent = data.total || 0;
            
            // Actualizar por zona
            if (norteElem) norteElem.textContent = data.porZona?.norte || 0;
            if (centroElem) centroElem.textContent = data.porZona?.centro || 0;
            if (surElem) surElem.textContent = data.porZona?.sur || 0;
            
            // Actualizar detalle por subzona
            if (detalleElem) {
                detalleElem.innerHTML = '';
                const subzonas = data.porSubzona || {};
                const subzonasOrdenadas = Object.entries(subzonas)
                    .sort((a, b) => b[1] - a[1]);
                
                if (subzonasOrdenadas.length === 0) {
                    detalleElem.innerHTML = '<p style="color: #95a5a6; font-style: italic;">No hay encuestas registradas aún</p>';
                } else {
                    subzonasOrdenadas.forEach(([nombre, cantidad]) => {
                        const div = document.createElement('div');
                        div.className = 'subzona-item';
                        div.innerHTML = `
                            <span class="subzona-nombre">${nombre}</span>
                            <span class="subzona-cantidad">${cantidad}</span>
                        `;
                        detalleElem.appendChild(div);
                    });
                }
            }
            
            // Si son datos locales, mostrar indicador
            if (data.local) {
                const aviso = document.createElement('p');
                aviso.style.cssText = 'color: #e67e22; font-size: 0.85em; margin-top: 10px; text-align: center;';
                aviso.textContent = '⚠️ Usando datos locales (sin conexión a Google Sheets)';
                const statsCard = document.querySelector('.estadisticas');
                if (statsCard && !statsCard.querySelector('.aviso-local')) {
                    aviso.className = 'aviso-local';
                    statsCard.appendChild(aviso);
                }
            } else {
                // Si hay conexión, eliminar aviso local si existe
                const aviso = document.querySelector('.aviso-local');
                if (aviso) aviso.remove();
            }
        })
        .catch(error => {
            console.error('❌ Error al actualizar estadísticas:', error);
            // Si todo falla, mostrar datos locales
            const dataLocal = obtenerEstadisticasLocales();
            if (totalElem) totalElem.textContent = dataLocal.total || 0;
            if (norteElem) norteElem.textContent = dataLocal.porZona?.norte || 0;
            if (centroElem) centroElem.textContent = dataLocal.porZona?.centro || 0;
            if (surElem) surElem.textContent = dataLocal.porZona?.sur || 0;
            
            // Mostrar error
            if (detalleElem) {
                detalleElem.innerHTML = '<p style="color: #e74c3c;">❌ Error al cargar estadísticas. Usando datos locales.</p>';
            }
        });
}

// ===== INICIALIZAR PÁGINA PRINCIPAL =====
function initPaginaPrincipal() {
    console.log('📄 Inicializando página principal...');
    
    const zonaSelect = document.getElementById('zonaPrincipal');
    const subZonaSelect = document.getElementById('subZona');
    const btnIniciar = document.getElementById('btnIniciarEncuesta');
    const estimacionSpan = document.getElementById('estimacionViviendas');
    const costaneraInfo = document.getElementById('costaneraInfo');

    if (!zonaSelect || !subZonaSelect || !btnIniciar) {
        console.error('❌ No se encontraron todos los elementos necesarios');
        return;
    }

    // Evento cambio de zona
    zonaSelect.addEventListener('change', function() {
        const zona = this.value;
        zonaSeleccionada = zona;
        
        subZonaSelect.innerHTML = '<option value="">Seleccione una subzona...</option>';
        subZonaSelect.disabled = true;
        if (costaneraInfo) costaneraInfo.style.display = 'none';
        
        if (zona && zonasData[zona]) {
            const data = zonasData[zona];
            if (estimacionSpan) estimacionSpan.textContent = data.estimacion;
            
            data.subzonas.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                subZonaSelect.appendChild(option);
            });
            
            subZonaSelect.disabled = false;
            
            if (zona === 'sur') {
                if (costaneraInfo) costaneraInfo.style.display = 'block';
            }
        } else {
            if (estimacionSpan) estimacionSpan.textContent = '-';
        }
        
        verificarHabilitarBoton();
    });

    // Evento cambio de subzona
    subZonaSelect.addEventListener('change', function() {
        subzonaSeleccionada = this.value;
        verificarHabilitarBoton();
    });

    // Evento número de cuadra
    const numeroCuadra = document.getElementById('numeroCuadra');
    if (numeroCuadra) {
        numeroCuadra.addEventListener('input', function() {
            verificarHabilitarBoton();
        });
    }

    // Botón iniciar
    btnIniciar.addEventListener('click', function() {
        const zona = zonaSelect.value;
        const subzona = subZonaSelect.value;
        let cuadra = '';
        
        if (zona === 'sur' && subzona === 'La Costanera (Dividido en 25 Cuadras)') {
            const numCuadra = document.getElementById('numeroCuadra');
            if (numCuadra) cuadra = numCuadra.value;
            if (!cuadra || cuadra < 1 || cuadra > 25) {
                alert('Por favor, ingrese un número de cuadra válido (1-25)');
                return;
            }
        }
        
        sessionStorage.setItem('zonaEncuesta', zona);
        sessionStorage.setItem('subzonaEncuesta', subzona);
        sessionStorage.setItem('cuadraEncuesta', cuadra);
        
        const numEncuesta = cargarNumeroEncuesta();
        sessionStorage.setItem('numeroEncuesta', numEncuesta.toString());
        
        window.location.href = 'encuesta.html';
    });

    verificarHabilitarBoton();
}

// ===== VERIFICAR BOTÓN =====
function verificarHabilitarBoton() {
    const zonaSelect = document.getElementById('zonaPrincipal');
    const subZonaSelect = document.getElementById('subZona');
    const btnIniciar = document.getElementById('btnIniciarEncuesta');
    const numeroCuadra = document.getElementById('numeroCuadra');
    
    if (!zonaSelect || !subZonaSelect || !btnIniciar) return;
    
    let habilitado = false;
    
    if (zonaSelect.value && subZonaSelect.value) {
        if (zonaSelect.value === 'sur' && subZonaSelect.value === 'La Costanera (Dividido en 25 Cuadras)') {
            if (numeroCuadra) {
                const val = parseInt(numeroCuadra.value);
                if (val >= 1 && val <= 25) habilitado = true;
            }
        } else {
            habilitado = true;
        }
    }
    
    btnIniciar.disabled = !habilitado;
}

// ===== INICIALIZAR PÁGINA DE ENCUESTA =====
function initPaginaEncuesta() {
    console.log('📄 Inicializando página de encuesta...');
    
    const zona = sessionStorage.getItem('zonaEncuesta') || 'No seleccionada';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || 'No seleccionada';
    const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    const zonaElem = document.getElementById('zonaSeleccionada');
    const subzonaElem = document.getElementById('subzonaSeleccionada');
    const numElem = document.getElementById('numeroEncuesta');
    
    const zonaNombre = zonasData[zona]?.nombre || zona;
    const emojiZona = zona === 'norte' ? '🟨' : zona === 'centro' ? '🟧' : zona === 'sur' ? '🟦' : '📍';
    
    if (zonaElem) {
        zonaElem.textContent = `${emojiZona} ${zonaNombre}`;
        if (zona === 'norte') zonaElem.style.color = '#f39c12';
        else if (zona === 'centro') zonaElem.style.color = '#e67e22';
        else if (zona === 'sur') zonaElem.style.color = '#2980b9';
    }
    
    if (subzonaElem) {
        subzonaElem.textContent = subzona + (cuadra ? ` (Cuadra ${cuadra})` : '');
    }
    
    if (numElem) numElem.textContent = `#${String(numEncuesta).padStart(3, '0')}`;

    // Mostrar pregunta abierta
    const preguntasCalificacion = ['p2', 'p4', 'p5'];
    preguntasCalificacion.forEach(id => {
        document.querySelectorAll(`input[name="${id}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const motivoDiv = document.getElementById('preguntaAbierta1');
                if (motivoDiv) {
                    if (['regular', 'malo'].includes(this.value)) {
                        motivoDiv.style.display = 'block';
                    } else {
                        motivoDiv.style.display = 'none';
                    }
                }
            });
        });
    });

    // Mostrar/ocultar bloque 2
    document.querySelectorAll('input[name="p6"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const continuacion = document.getElementById('bloque2Continuacion');
            if (continuacion) {
                continuacion.style.display = this.value === 'si' ? 'block' : 'none';
            }
        });
    });

    // Botón guardar
    const btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function() {
            if (validarFormulario()) {
                const datos = recolectarDatos();
                guardarDatos(datos);
            }
        });
    }
}

// ===== VALIDAR FORMULARIO =====
function validarFormulario() {
    const camposRequeridos = ['sexo', 'edad', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p10', 'p11', 'p13'];
    let camposFaltantes = [];
    
    camposRequeridos.forEach(id => {
        const seleccionado = document.querySelector(`input[name="${id}"]:checked`);
        if (!seleccionado) {
            const nombre = id === 'sexo' ? 'Sexo' : 
                          id === 'edad' ? 'Rango etario' :
                          id === 'p10' ? 'Pregunta 10' :
                          id === 'p11' ? 'Pregunta 11' :
                          id === 'p13' ? 'Pregunta 13' :
                          `Pregunta ${id.replace('p', '')}`;
            camposFaltantes.push(nombre);
        }
    });
    
    for (let i = 1; i <= 3; i++) {
        const select = document.querySelector(`select[name="p9_${i}"]`);
        if (!select || !select.value) {
            camposFaltantes.push(`Pregunta 9 - Problema #${i}`);
        }
    }
    
    if (camposFaltantes.length > 0) {
        alert(`Por favor, complete todos los campos obligatorios:\n- ${camposFaltantes.join('\n- ')}`);
        return false;
    }
    
    return true;
}

// ===== RECOLECTAR DATOS =====
function recolectarDatos() {
    const zona = sessionStorage.getItem('zonaEncuesta') || '';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || '';
    const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    return {
        fecha: new Date().toISOString(),
        numeroEncuesta: numEncuesta,
        zona: zona,
        zonaNombre: zonasData[zona]?.nombre || zona,
        subzona: subzona,
        cuadra: cuadra,
        sexo: document.querySelector('input[name="sexo"]:checked')?.value || '',
        edad: document.querySelector('input[name="edad"]:checked')?.value || '',
        p1: document.querySelector('input[name="p1"]:checked')?.value || '',
        p2: document.querySelector('input[name="p2"]:checked')?.value || '',
        p3: document.querySelector('input[name="p3"]:checked')?.value || '',
        p4: document.querySelector('input[name="p4"]:checked')?.value || '',
        p5: document.querySelector('input[name="p5"]:checked')?.value || '',
        p5_motivo: document.querySelector('textarea[name="p5_motivo"]')?.value || '',
        p6: document.querySelector('input[name="p6"]:checked')?.value || '',
        p7_salud: document.querySelector('input[name="p7_salud"]')?.checked || false,
        p7_documentacion: document.querySelector('input[name="p7_doc"]')?.checked || false,
        p7_legal: document.querySelector('input[name="p7_legal"]')?.checked || false,
        p7_otro: document.querySelector('input[name="p7_otro"]')?.value || '',
        p8: document.querySelector('input[name="p8"]:checked')?.value || '',
        p9_1: document.querySelector('select[name="p9_1"]')?.value || '',
        p9_2: document.querySelector('select[name="p9_2"]')?.value || '',
        p9_3: document.querySelector('select[name="p9_3"]')?.value || '',
        p10: document.querySelector('input[name="p10"]:checked')?.value || '',
        p10_otro: document.querySelector('input[name="p10_otro"]')?.value || '',
        p11: document.querySelector('input[name="p11"]:checked')?.value || '',
        p11_otro: document.querySelector('input[name="p11_otro"]')?.value || '',
        p12: document.querySelector('textarea[name="p12"]')?.value || '',
        p13: document.querySelector('input[name="p13"]:checked')?.value || '',
        p13_otro: document.querySelector('input[name="p13_otro"]')?.value || '',
        p14: document.querySelector('textarea[name="p14"]')?.value || '',
        p15: document.querySelector('textarea[name="p15"]')?.value || ''
    };
}

// ===== GUARDAR DATOS EN GOOGLE SHEETS =====
function guardarDatos(datos) {
    console.log('📤 Enviando datos a Google Sheets...');
    
    const btnGuardar = document.getElementById('btnGuardar');
    const textoOriginal = btnGuardar.textContent;
    btnGuardar.textContent = '⏳ Guardando...';
    btnGuardar.disabled = true;
    
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(() => {
        // No-cors no permite leer la respuesta, pero sabemos que se envió
        console.log('✅ Datos enviados correctamente');
        btnGuardar.textContent = '✅ ¡Guardado!';
        
        // Guardar backup local
        guardarBackupLocal(datos);
        
        alert(`✅ Encuesta #${datos.numeroEncuesta} guardada correctamente!`);
        
        setTimeout(() => {
            window.location.href = 'gracias.html';
        }, 1000);
    })
    .catch(error => {
        console.error('❌ Error al guardar:', error);
        btnGuardar.textContent = textoOriginal;
        btnGuardar.disabled = false;
        
        if (confirm('❌ Error de conexión. ¿Guardar la encuesta localmente para enviar después?')) {
            guardarBackupLocal(datos);
            alert('✅ Encuesta guardada localmente. Se enviará cuando tengas conexión.');
            window.location.href = 'gracias.html';
        }
    });
}

// ===== BACKUP LOCAL =====
function guardarBackupLocal(datos) {
    let pendientes = JSON.parse(localStorage.getItem('encuestas_pendientes') || '[]');
    pendientes.push(datos);
    localStorage.setItem('encuestas_pendientes', JSON.stringify(pendientes));
    console.log('📦 Backup local guardado');
}

// ===== SINCronizar PENDIENTES =====
function sincronizarPendientes() {
    const pendientes = JSON.parse(localStorage.getItem('encuestas_pendientes') || '[]');
    
    if (pendientes.length === 0) {
        alert('📭 No hay encuestas pendientes');
        return;
    }
    
    console.log(`📤 Enviando ${pendientes.length} encuestas pendientes...`);
    alert(`📤 Enviando ${pendientes.length} encuestas pendientes...`);
    
    let enviadas = 0;
    let errores = 0;
    
    pendientes.forEach((datos, index) => {
        fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(() => {
            enviadas++;
            console.log(`✅ Encuesta #${datos.numeroEncuesta} sincronizada`);
            
            if (enviadas + errores === pendientes.length) {
                localStorage.removeItem('encuestas_pendientes');
                alert(`✅ Sincronización completa!\nEnviadas: ${enviadas}\nErrores: ${errores}`);
            }
        })
        .catch(() => {
            errores++;
            console.log(`❌ Error al sincronizar encuesta #${datos.numeroEncuesta}`);
        });
    });
}

// ===== FUNCIONES ADMIN (desde consola) =====
function verEstadisticasCompletas() {
    obtenerEstadisticasDesdeGoogle()
        .then(data => {
            console.log('📊 ===== ESTADÍSTICAS COMPLETAS =====');
            console.log(`📝 Total de encuestas: ${data.total || 0}`);
            console.log('📍 Por zona:');
            console.log(`   🟨 NORTE: ${data.porZona?.norte || 0}`);
            console.log(`   🟧 CENTRO: ${data.porZona?.centro || 0}`);
            console.log(`   🟦 SUR: ${data.porZona?.sur || 0}`);
            console.log('📍 Por subzona:');
            if (data.porSubzona) {
                Object.entries(data.porSubzona)
                    .sort((a, b) => b[1] - a[1])
                    .forEach(([nombre, cantidad]) => {
                        console.log(`   ${nombre}: ${cantidad}`);
                    });
            }
            
            let mensaje = `📊 TOTAL DE ENCUESTAS: ${data.total || 0}\n\n`;
            mensaje += `📍 Por zona:\n`;
            mensaje += `   🟨 NORTE: ${data.porZona?.norte || 0}\n`;
            mensaje += `   🟧 CENTRO: ${data.porZona?.centro || 0}\n`;
            mensaje += `   🟦 SUR: ${data.porZona?.sur || 0}`;
            alert(mensaje);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            alert('❌ Error al obtener estadísticas');
        });
}

function exportarEncuestasCSV() {
    alert('📥 Para exportar a CSV, ve a tu Google Sheet y usa: Archivo → Descargar → CSV');
    console.log('📥 Abre tu Google Sheet y ve a: Archivo → Descargar → CSV');
}

function borrarTodasEncuestas() {
    if (confirm('⚠️ ¿Estás seguro de borrar TODAS las encuestas guardadas localmente?')) {
        if (confirm('Confirmación final: ¿Borrar todas las encuestas locales?')) {
            localStorage.removeItem('encuestas');
            localStorage.removeItem('encuestas_pendientes');
            alert('✅ Encuestas locales borradas');
            actualizarEstadisticas();
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación...');
    
    const path = window.location.pathname;
    
    if (path.includes('encuesta.html')) {
        console.log('📄 Página: encuesta.html');
        initPaginaEncuesta();
    } else if (path.includes('gracias.html')) {
        console.log('📄 Página: gracias.html');
        const zona = sessionStorage.getItem('zonaEncuesta') || 'No especificada';
        const subzona = sessionStorage.getItem('subzonaEncuesta') || 'No especificada';
        const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
        const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
        
        const numElem = document.getElementById('encuestaNumero');
        const zonaElem = document.getElementById('encuestaZona');
        const subzonaElem = document.getElementById('encuestaSubzona');
        
        if (numElem) numElem.textContent = `#${String(numEncuesta).padStart(3, '0')}`;
        if (zonaElem) zonaElem.textContent = zonasData[zona]?.nombre || zona;
        if (subzonaElem) subzonaElem.textContent = subzona + (cuadra ? ` (Cuadra ${cuadra})` : '');
    } else {
        console.log('📄 Página: index.html');
        initPaginaPrincipal();
        // Cargar estadísticas después de un pequeño delay
        setTimeout(actualizarEstadisticas, 500);
    }
});

// Funciones disponibles desde consola
window.sincronizarPendientes = sincronizarPendientes;
window.exportarEncuestasCSV = exportarEncuestasCSV;
window.verEstadisticasCompletas = verEstadisticasCompletas;
window.borrarTodasEncuestas = borrarTodasEncuestas;
window.actualizarEstadisticas = actualizarEstadisticas;
window.volverAlInicio = volverAlInicio;
