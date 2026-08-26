// Datos de las zonas (también en data/zonas.json)
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
    const zonaSelect = document.getElementById('zonaPrincipal');
    const subZonaSelect = document.getElementById('subZona');
    const btnIniciar = document.getElementById('btnIniciarEncuesta');
    const estimacionSpan = document.getElementById('estimacionViviendas');
    const costaneraInfo = document.getElementById('costaneraInfo');
    const cuadrasGrid = document.getElementById('cuadrasGrid');

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
                document.getElementById('numeroCuadra').value = i;
            };
            cuadrasGrid.appendChild(div);
        }
    }

    // Evento cambio de zona principal
    zonaSelect.addEventListener('change', function() {
        const zona = this.value;
        zonaSeleccionada = zona;
        
        // Limpiar subzonas
        subZonaSelect.innerHTML = '<option value="">Seleccione una subzona...</option>';
        subZonaSelect.disabled = true;
        costaneraInfo.style.display = 'none';
        
        if (zona && zonasData[zona]) {
            const data = zonasData[zona];
            estimacionSpan.textContent = data.estimacion;
            
            // Cargar subzonas
            data.subzonas.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                subZonaSelect.appendChild(option);
            });
            
            subZonaSelect.disabled = false;
            
            // Si es SUR, mostrar info de Costanera
            if (zona === 'sur') {
                costaneraInfo.style.display = 'block';
            }
        } else {
            estimacionSpan.textContent = '-';
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
            cuadra = document.getElementById('numeroCuadra').value;
            if (!cuadra || cuadra < 1 || cuadra > 25) {
                alert('Por favor, seleccione un número de cuadra (1-25)');
                return;
            }
        }
        
        // Guardar en sessionStorage para usarlo en encuesta.html
        sessionStorage.setItem('zonaEncuesta', zona);
        sessionStorage.setItem('subzonaEncuesta', subzona);
        sessionStorage.setItem('cuadraEncuesta', cuadra);
        sessionStorage.setItem('numeroEncuesta', actualizarNumeroEncuesta());
        
        // Redirigir a la encuesta
        window.location.href = 'encuesta.html';
    });
}

// Función para verificar si el botón de iniciar debe estar habilitado
function verificarHabilitarBoton() {
    const zonaSelect = document.getElementById('zonaPrincipal');
    const subZonaSelect = document.getElementById('subZona');
    const btnIniciar = document.getElementById('btnIniciarEncuesta');
    const numeroCuadra = document.getElementById('numeroCuadra');
    
    let habilitado = false;
    
    if (zonaSelect.value && subZonaSelect.value) {
        if (zonaSelect.value === 'sur' && subZonaSelect.value === 'La Costanera (Dividido en 25 Cuadras)') {
            const val = parseInt(numeroCuadra.value);
            if (val >= 1 && val <= 25) {
                habilitado = true;
            }
        } else {
            habilitado = true;
        }
    }
    
    btnIniciar.disabled = !habilitado;
}

// Inicializar la página de encuesta (encuesta.html)
function initPaginaEncuesta() {
    // Mostrar zona y subzona seleccionadas
    const zona = sessionStorage.getItem('zonaEncuesta') || 'No seleccionada';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || 'No seleccionada';
    const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    document.getElementById('zonaSeleccionada').textContent = zonasData[zona]?.nombre || zona;
    document.getElementById('subzonaSeleccionada').textContent = subzona + (cuadra ? ` (Cuadra ${cuadra})` : '');
    document.getElementById('numeroEncuesta').textContent = `#${String(numEncuesta).padStart(3, '0')}`;

    // Mostrar pregunta abierta si se selecciona Regular, Malo o Muy malo
    const preguntasCalificacion = ['p2', 'p4', 'p5'];
    preguntasCalificacion.forEach(id => {
        document.querySelectorAll(`input[name="${id}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const motivoDiv = document.getElementById('preguntaAbierta1');
                if (['regular', 'malo'].includes(this.value)) {
                    motivoDiv.style.display = 'block';
                } else if (this.value === 'muy-bueno' || this.value === 'nsnr') {
                    if (!document.querySelector(`input[name="${id}"]:checked`) || 
                        ['muy-bueno', 'nsnr'].includes(document.querySelector(`input[name="${id}"]:checked`).value)) {
                        motivoDiv.style.display = 'none';
                    }
                }
            });
        });
    });

    // Mostrar/ocultar bloque 2 según respuesta
    document.querySelectorAll('input[name="p6"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const continuacion = document.getElementById('bloque2Continuacion');
            continuacion.style.display = this.value === 'si' ? 'block' : 'none';
        });
    });

    // Botón guardar
    document.getElementById('btnGuardar').addEventListener('click', function() {
        if (validarFormulario()) {
            const datos = recolectarDatos();
            guardarDatos(datos);
        }
    });
}

// Función para validar el formulario
function validarFormulario() {
    const camposRequeridos = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p10', 'p12', 'p14'];
    let valid = true;
    let mensaje = 'Por favor, complete los siguientes campos:\n';
    
    camposRequeridos.forEach(id => {
        const seleccionado = document.querySelector(`input[name="${id}"]:checked`);
        if (!seleccionado) {
            mensaje += `- Pregunta ${id.replace('p', '')}\n`;
            valid = false;
        }
    });
    
    // Validar pregunta 9 (ranking)
    for (let i = 1; i <= 3; i++) {
        const select = document.querySelector(`select[name="p9_${i}"]`);
        if (!select || !select.value) {
            mensaje += `- Pregunta 9 - Problema #${i}\n`;
            valid = false;
        }
    }
    
    if (!valid) {
        alert(mensaje);
        return false;
    }
    
    return true;
}

// Función para recolectar datos del formulario
function recolectarDatos() {
    const datos = {
        fecha: new Date().toISOString(),
        zona: sessionStorage.getItem('zonaEncuesta'),
        subzona: sessionStorage.getItem('subzonaEncuesta'),
        cuadra: sessionStorage.getItem('cuadraEncuesta'),
        numeroEncuesta: sessionStorage.getItem('numeroEncuesta'),
        p1: document.querySelector('input[name="p1"]:checked')?.value || '',
        p2: document.querySelector('input[name="p2"]:checked')?.value || '',
        p3: document.querySelector('input[name="p3"]:checked')?.value || '',
        p4: document.querySelector('input[name="p4"]:checked')?.value || '',
        p5: document.querySelector('input[name="p5"]:checked')?.value || '',
        p5_motivo: document.querySelector('textarea[name="p5_motivo"]')?.value || '',
        p6: document.querySelector('input[name="p6"]:checked')?.value || '',
        p7: {
            salud: document.querySelector('input[name="p7_salud"]')?.checked || false,
            documentacion: document.querySelector('input[name="p7_doc"]')?.checked || false,
            legal: document.querySelector('input[name="p7_legal"]')?.checked || false,
            otro: document.querySelector('input[name="p7_otro"]')?.value || ''
        },
        p8: document.querySelector('input[name="p8"]:checked')?.value || '',
        p9: {
            problema1: document.querySelector('select[name="p9_1"]')?.value || '',
            problema2: document.querySelector('select[name="p9_2"]')?.value || '',
            problema3: document.querySelector('select[name="p9_3"]')?.value || ''
        },
        p10: document.querySelector('input[name="p10"]:checked')?.value || '',
        p10_otro: document.querySelector('input[name="p10_otro"]')?.value || '',
        p11: document.querySelector('textarea[name="p11"]')?.value || '',
        p12: document.querySelector('input[name="p12"]:checked')?.value || '',
        p12_otro: document.querySelector('input[name="p12_otro"]')?.value || '',
        p13: document.querySelector('textarea[name="p13"]')?.value || '',
        p14: document.querySelector('input[name="p14"]:checked')?.value || '',
        p14_otro: document.querySelector('input[name="p14_otro"]')?.value || '',
        p15: document.querySelector('textarea[name="p15"]')?.value || '',
        p16: document.querySelector('textarea[name="p16"]')?.value || ''
    };
    
    return datos;
}

// Función para guardar datos
function guardarDatos(datos) {
    // Obtener datos existentes de localStorage
    let encuestas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    encuestas.push(datos);
    localStorage.setItem('encuestas', JSON.stringify(encuestas));
    
    // Descargar como CSV (opcional)
    descargarCSV(datos);
    
    // Redirigir a página de agradecimiento
    window.location.href = 'gracias.html';
}

// Función para descargar CSV (puede exportar todas las encuestas)
function descargarCSV(datos) {
    // Esto es opcional - puedes implementar descarga automática
    // o simplemente guardar en localStorage y luego exportar manualmente
    console.log('Datos guardados:', datos);
    
    // Actualizar el número de encuesta para la próxima
    const numActual = parseInt(sessionStorage.getItem('numeroEncuesta') || '0');
    const nuevoNum = numActual + 1;
    sessionStorage.setItem('numeroEncuesta', nuevoNum.toString());
}

// Función para exportar todas las encuestas a CSV (para usar desde consola)
function exportarEncuestasCSV() {
    const encuestas = JSON.parse(localStorage.getItem('encuestas') || '[]');
    if (encuestas.length === 0) {
        alert('No hay encuestas guardadas');
        return;
    }
    
    const headers = Object.keys(encuestas[0]);
    let csv = headers.join(',') + '\n';
    
    encuestas.forEach(enc => {
        const row = headers.map(h => {
            let val = enc[h];
            if (typeof val === 'object') val = JSON.stringify(val);
            return `"${String(val).replace(/"/g, '""')}"`;
        });
        csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encuestas_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
}

// Inicializar según la página
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initPaginaPrincipal();
    } else if (window.location.pathname.includes('encuesta.html')) {
        initPaginaEncuesta();
    } else if (window.location.pathname.includes('gracias.html')) {
        // Mostrar información de la encuesta completada
        const zona = sessionStorage.getItem('zonaEncuesta') || 'No especificada';
        const subzona = sessionStorage.getItem('subzonaEncuesta') || 'No especificada';
        const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
        const cuadra = sessionStorage.getItem('cuadraEncuesta') || '';
        
        document.getElementById('encuestaNumero').textContent = `#${String(numEncuesta).padStart(3, '0')}`;
        document.getElementById('encuestaZona').textContent = zonasData[zona]?.nombre || zona;
        document.getElementById('encuestaSubzona').textContent = subzona + (cuadra ? ` (Cuadra ${cuadra})` : '');
    }
});

// Hacer accesible la función de exportación desde consola
window.exportarEncuestasCSV = exportarEncuestasCSV;