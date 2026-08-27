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

// Función para cargar el número de encuesta desde localStorage
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

// Función para actualizar el número de encuesta
function actualizarNumeroEncuesta() {
    const num = cargarNumeroEncuesta();
    const elemento = document.getElementById('numeroEncuesta');
    if (elemento) {
        elemento.textContent = `#${String(num).padStart(3, '0')}`;
    }
    return num;
}

// Inicializar la página principal (index.html)
function initPaginaPrincipal() {
    console.log('Inicializando página principal...');
    
    const zonaSelect = document.getElementById('zonaPrincipal');
    const subZonaSelect = document.getElementById('subZona');
    const btnIniciar = document.getElementById('btnIniciarEncuesta');
    const estimacionSpan = document.getElementById('estimacionViviendas');
    const costaneraInfo = document.getElementById('costaneraInfo');
    const cuadrasGrid = document.getElementById('cuadrasGrid');

    if (!zonaSelect || !subZonaSelect || !btnIniciar) {
        console.error('No se encontraron todos los elementos necesarios en la página');
        return;
    }

    // Generar diagrama de cuadras para La Costanera
    if (cuadrasGrid) {
        for (let i = 1; i <= 25; i++) {
            const div = document.createElement('div');
            div.className = 'cuadra-item';
            div.textContent = i;
            div.dataset.numero = i;
            div.onclick = function() {
                document.querySelectorAll('.cuadra-item').forEach(el => el.classList.remove('seleccionada'));
                this.classList.add('seleccionada');
                const numCuadra = document.getElementById('numeroCuadra');
                if (numCuadra) numCuadra.value = i;
                verificarHabilitarBoton();
            };
            cuadrasGrid.appendChild(div);
        }
    }

    // Evento cambio de zona principal
    zonaSelect.addEventListener('change', function() {
        console.log('Zona seleccionada:', this.value);
        const zona = this.value;
        zonaSeleccionada = zona;
        
        subZonaSelect.innerHTML = '<option value="">Seleccione una subzona...</option>';
        subZonaSelect.disabled = true;
        if (costaneraInfo) costaneraInfo.style.display = 'none';
        
        if (zona && zonasData[zona]) {
            const data = zonasData[zona];
            if (estimacionSpan) estimacionSpan.textContent = data.estimacion;
            
            console.log('Cargando subzonas para:', zona);
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
        console.log('Subzona seleccionada:', this.value);
        subzonaSeleccionada = this.value;
        verificarHabilitarBoton();
    });

    // Evento número de cuadra
    const numeroCuadra = document.getElementById('numeroCuadra');
    if (numeroCuadra) {
        numeroCuadra.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val >= 1 && val <= 25) {
                document.querySelectorAll('.cuadra-item').forEach(el => {
                    el.classList.toggle('seleccionada', parseInt(el.dataset.numero) === val);
                });
            }
            verificarHabilitarBoton();
        });
    }

    // Botón iniciar encuesta
    btnIniciar.addEventListener('click', function() {
        const zona = zonaSelect.value;
        const subzona = subZonaSelect.value;
        let cuadra = '';
        
        if (zona === 'sur' && subzona === 'La Costanera (Dividido en 25 Cuadras)') {
            const numCuadra = document.getElementById('numeroCuadra');
            if (numCuadra) cuadra = numCuadra.value;
            if (!cuadra || cuadra < 1 || cuadra > 25) {
                alert('Por favor, seleccione un número de cuadra (1-25)');
                return;
            }
        }
        
        // Guardar en sessionStorage
        sessionStorage.setItem('zonaEncuesta', zona);
        sessionStorage.setItem('subzonaEncuesta', subzona);
        sessionStorage.setItem('cuadraEncuesta', cuadra);
        
        // Generar número de encuesta
        const numEncuesta = cargarNumeroEncuesta();
        sessionStorage.setItem('numeroEncuesta', numEncuesta.toString());
        
        console.log('Datos guardados en sessionStorage:', {
            zona, subzona, cuadra, numero: numEncuesta
        });
        
        // Redirigir
        window.location.href = 'encuesta.html';
    });

    verificarHabilitarBoton();
}

// Función para verificar si el botón de iniciar debe estar habilitado
function verificarHabilitarBoton() {
    const zonaSelect = document.getElementById('zonaPrincipal');
    const subZonaSelect = document.getElementById('subZona');
    const btnIniciar = document.getElementById('btnIniciarEncuesta');
    const numeroCuadra = document.getElementById('numeroCuadra');
    
    if (!zonaSelect || !subZonaSelect || !btnIniciar) {
        return;
    }
    
    let habilitado = false;
    
    if (zonaSelect.value && subZonaSelect.value) {
        if (zonaSelect.value === 'sur' && subZonaSelect.value === 'La Costanera (Dividido en 25 Cuadras)') {
            if (numeroCuadra) {
                const val = parseInt(numeroCuadra.value);
                if (val >= 1 && val <= 25) {
                    habilitado = true;
                }
            }
        } else {
            habilitado = true;
        }
    }
    
    btnIniciar.disabled = !habilitado;
}

// Inicializar la página de encuesta (encuesta.html)
function initPaginaEncuesta() {
    console.log('Inicializando página de encuesta...');
    
    // Mostrar zona y subzona seleccionadas
    const zona = sessionStorage.getItem('zonaEncuesta') || 'No seleccionada';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || 'No seleccionada';
    const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    const zonaElem = document.getElementById('zonaSeleccionada');
    const subzonaElem = document.getElementById('subzonaSeleccionada');
    const numElem = document.getElementById('numeroEncuesta');
    
    if (zonaElem) zonaElem.textContent = zonasData[zona]?.nombre || zona;
    if (subzonaElem) subzonaElem.textContent = subzona + (cuadra ? ` (Cuadra ${cuadra})` : '');
    if (numElem) numElem.textContent = `#${String(numEncuesta).padStart(3, '0')}`;

    // Mostrar pregunta abierta si se selecciona Regular, Malo o Muy malo
    const preguntasCalificacion = ['p2', 'p4', 'p5'];
    preguntasCalificacion.forEach(id => {
        document.querySelectorAll(`input[name="${id}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const motivoDiv = document.getElementById('preguntaAbierta1');
                if (motivoDiv) {
                    if (['regular', 'malo'].includes(this.value)) {
                        motivoDiv.style.display = 'block';
                    } else if (this.value === 'muy-bueno' || this.value === 'nsnr') {
                        if (!document.querySelector(`input[name="${id}"]:checked`) || 
                            ['muy-bueno', 'nsnr'].includes(document.querySelector(`input[name="${id}"]:checked`).value)) {
                            motivoDiv.style.display = 'none';
                        }
                    }
                }
            });
        });
    });

    // Mostrar/ocultar bloque 2 según respuesta
    document.querySelectorAll('input[name="p6"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const continuacion = document.getElementById('bloque2Continuacion');
            if (continuacion) {
                continuacion.style.display = this.value === 'si' ? 'block' : 'none';
            }
        });
    });

    // Botón guardar - AHORA CON MEJOR MANEJO DE ERRORES
    const btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function() {
            console.log('Botón guardar clickeado');
            
            if (validarFormulario()) {
                console.log('Formulario válido, recolectando datos...');
                const datos = recolectarDatos();
                console.log('Datos recolectados:', datos);
                guardarDatos(datos);
            } else {
                console.log('Formulario no válido');
            }
        });
    } else {
        console.error('No se encontró el botón guardar');
    }
}

// Función para validar el formulario
function validarFormulario() {
    const camposRequeridos = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p10', 'p12', 'p14'];
    let valid = true;
    let mensaje = 'Por favor, complete los siguientes campos:\n';
    let camposFaltantes = [];
    
    camposRequeridos.forEach(id => {
        const seleccionado = document.querySelector(`input[name="${id}"]:checked`);
        if (!seleccionado) {
            camposFaltantes.push(id.replace('p', ''));
            valid = false;
        }
    });
    
    // Validar pregunta 9 (ranking)
    for (let i = 1; i <= 3; i++) {
        const select = document.querySelector(`select[name="p9_${i}"]`);
        if (!select || !select.value) {
            camposFaltantes.push(`9.${i}`);
            valid = false;
        }
    }
    
    if (!valid) {
        alert(`Por favor, complete todos los campos obligatorios:\n- Preguntas: ${camposFaltantes.join(', ')}`);
        return false;
    }
    
    return true;
}

// Función para recolectar datos del formulario
function recolectarDatos() {
    // Obtener la zona y subzona del sessionStorage
    const zona = sessionStorage.getItem('zonaEncuesta') || '';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || '';
    const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    // Recolectar respuestas
    const datos = {
        // Metadatos
        fecha: new Date().toISOString(),
        numeroEncuesta: numEncuesta,
        zona: zona,
        zonaNombre: zonasData[zona]?.nombre || zona,
        subzona: subzona,
        cuadra: cuadra,
        
        // Bloque 1
        p1: document.querySelector('input[name="p1"]:checked')?.value || '',
        p2: document.querySelector('input[name="p2"]:checked')?.value || '',
        p3: document.querySelector('input[name="p3"]:checked')?.value || '',
        p4: document.querySelector('input[name="p4"]:checked')?.value || '',
        p5: document.querySelector('input[name="p5"]:checked')?.value || '',
        p5_motivo: document.querySelector('textarea[name="p5_motivo"]')?.value || '',
        
        // Bloque 2
        p6: document.querySelector('input[name="p6"]:checked')?.value || '',
        p7_salud: document.querySelector('input[name="p7_salud"]')?.checked || false,
        p7_documentacion: document.querySelector('input[name="p7_doc"]')?.checked || false,
        p7_legal: document.querySelector('input[name="p7_legal"]')?.checked || false,
        p7_otro: document.querySelector('input[name="p7_otro"]')?.value || '',
        p8: document.querySelector('input[name="p8"]:checked')?.value || '',
        
        // Bloque 3
        p9_1: document.querySelector('select[name="p9_1"]')?.value || '',
        p9_2: document.querySelector('select[name="p9_2"]')?.value || '',
        p9_3: document.querySelector('select[name="p9_3"]')?.value || '',
        p10: document.querySelector('input[name="p10"]:checked')?.value || '',
        p10_otro: document.querySelector('input[name="p10_otro"]')?.value || '',
        p11: document.querySelector('textarea[name="p11"]')?.value || '',
        
        // Bloque 4
        p12: document.querySelector('input[name="p12"]:checked')?.value || '',
        p12_otro: document.querySelector('input[name="p12_otro"]')?.value || '',
        p13: document.querySelector('textarea[name="p13"]')?.value || '',
        p14: document.querySelector('input[name="p14"]:checked')?.value || '',
        p14_otro: document.querySelector('input[name="p14_otro"]')?.value || '',
        p15: document.querySelector('textarea[name="p15"]')?.value || '',
        
        // Bloque 5
        p16: document.querySelector('textarea[name="p16"]')?.value || ''
    };
    
    return datos;
}

// Función para guardar datos - AHORA CON VERIFICACIONES
function guardarDatos(datos) {
    try {
        console.log('Intentando guardar datos...');
        
        // Obtener datos existentes
        let encuestas = JSON.parse(localStorage.getItem('encuestas') || '[]');
        console.log(`Encuestas existentes: ${encuestas.length}`);
        
        // Agregar nueva encuesta
        encuestas.push(datos);
        
        // Guardar en localStorage
        localStorage.setItem('encuestas', JSON.stringify(encuestas));
        console.log(`✅ Encuesta guardada correctamente. Total: ${encuestas.length}`);
        
        // Mostrar mensaje de éxito
        alert(`✅ Encuesta #${datos.numeroEncuesta} guardada correctamente!\nTotal de encuestas: ${encuestas.length}`);
        
        // Redirigir a página de agradecimiento
        window.location.href = 'gracias.html';
        
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        alert('❌ Error al guardar la encuesta. Por favor, intente nuevamente.');
    }
}

// Función para exportar todas las encuestas a CSV
function exportarEncuestasCSV() {
    const encuestas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    
    if (encuestas.length === 0) {
        alert('📭 No hay encuestas guardadas para exportar');
        return;
    }
    
    // Definir columnas para el CSV
    const columnas = [
        'numeroEncuesta', 'fecha', 'zonaNombre', 'subzona', 'cuadra',
        'p1', 'p2', 'p3', 'p4', 'p5', 'p5_motivo',
        'p6', 'p7_salud', 'p7_documentacion', 'p7_legal', 'p7_otro', 'p8',
        'p9_1', 'p9_2', 'p9_3', 'p10', 'p10_otro', 'p11',
        'p12', 'p12_otro', 'p13', 'p14', 'p14_otro', 'p15',
        'p16'
    ];
    
    // Crear CSV
    let csv = columnas.join(',') + '\n';
    
    encuestas.forEach(enc => {
        const row = columnas.map(col => {
            let val = enc[col] || '';
            // Escapar comillas y comas
            if (typeof val === 'string') {
                val = val.replace(/"/g, '""');
                if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                    val = `"${val}"`;
                }
            }
            return val;
        });
        csv += row.join(',') + '\n';
    });
    
    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `encuestas_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`✅ Se exportaron ${encuestas.length} encuestas correctamente`);
}

// Función para ver cuántas encuestas hay guardadas (desde consola)
function verEstadisticas() {
    const encuestas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    console.log(`📊 Total de encuestas guardadas: ${encuestas.length}`);
    console.log('📋 Últimas 5 encuestas:', encuestas.slice(-5));
    return {
        total: encuestas.length,
        ultimas: encuestas.slice(-5)
    };
}

// Función para borrar todas las encuestas (con confirmación)
function borrarTodasEncuestas() {
    if (confirm('⚠️ ¿Estás seguro de borrar TODAS las encuestas guardadas?')) {
        if (confirm('Confirmación final: ¿Borrar todas las encuestas?')) {
            localStorage.removeItem('encuestas');
            alert('✅ Todas las encuestas han sido borradas');
            console.log('✅ Todas las encuestas borradas');
        }
    }
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado completamente');
    console.log('Ruta actual:', window.location.pathname);
    
    const path = window.location.pathname;
    
    if (path.includes('encuesta.html')) {
        console.log('Página detectada: encuesta.html');
        initPaginaEncuesta();
    } else if (path.includes('gracias.html')) {
        console.log('Página detectada: gracias.html');
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
        console.log('Página detectada: index.html (por defecto)');
        initPaginaPrincipal();
    }
});

// Funciones disponibles desde la consola
window.exportarEncuestasCSV = exportarEncuestasCSV;
window.verEstadisticas = verEstadisticas;
window.borrarTodasEncuestas = borrarTodasEncuestas;
