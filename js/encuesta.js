// ===== CONFIGURACIÓN =====
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby5PZXTs5sfuO0Y6ZpGUvl3aQPBEtrkyp-X_M38YVSjjwcDmNdEJLddjivNnE8wGnSW/exec';

// ===== DATOS DE DISTRITOS Y SUBZONAS =====
const distritosData = {
    '12 de Octubre': {
        subzonas: [
            { id: 1, name: 'B° Santa María y 12 de Octubre', zona: 'RURAL' },
            { id: 2, name: 'Cruce Ruta 50 y El Mirador', zona: 'RURAL' },
            { id: 3, name: '25 de Mayo', zona: 'RURAL' },
            { id: 4, name: 'Malvinas Argentinas', zona: 'RURAL' },
            { id: 5, name: 'Viña Fundación', zona: 'RURAL' },
            { id: 6, name: 'El Divisadero', zona: 'RURAL' }
        ]
    },
    'El Marcado': {
        subzonas: [
            { id: 1, name: 'B° Molina Cabrera', zona: 'RURAL' },
            { id: 2, name: 'B° Esperanza Santarrosina', zona: 'RURAL' }
        ]
    },
    'La Dormida': {
        subzonas: [
            { id: 1, name: 'Crespo Norte', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 2, name: 'PROCREAR', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 3, name: 'Saavedra y Colectoras Ruta 7', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 4, name: 'Crespo Sur', zona: 'RADIO URBANO SUR', orientacion: 'S' },
            { id: 5, name: 'San Cayetano III', zona: 'RADIO URBANO SUR', orientacion: 'S' },
            { id: 6, name: 'Nuevo Horizonte', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 7, name: '30 de Agosto y La Posta', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 8, name: 'SAAR', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 9, name: 'Cosquín', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 10, name: 'Remo Falciani (B° La Dormida)', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 11, name: 'Gdor. Civit', zona: 'RURAL' },
            { id: 12, name: 'B° Parrales Mendocinos', zona: 'RURAL' }
        ]
    },
    'Las Catitas': {
        subzonas: [
            { id: 1, name: 'Los Espinillos y SUTE', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 2, name: 'Arenas', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 3, name: 'San Cayetano', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 4, name: 'Guiñazú y colectoras', zona: 'RADIO URBANO NORTE', orientacion: 'N' },
            { id: 5, name: 'Eulalia Calderón y Guiñazú', zona: 'RADIO URBANO CENTRO', orientacion: 'C' },
            { id: 6, name: 'Entre Emilio Civit y Uriburu', zona: 'RADIO URBANO CENTRO', orientacion: 'C' },
            { id: 7, name: 'B° Jardín Oeste', zona: 'RADIO URBANO CENTRO', orientacion: 'C' },
            { id: 8, name: 'Eliseo Ortiz', zona: 'RADIO URBANO CENTRO', orientacion: 'C' },
            { id: 9, name: 'La Costanera ESTE', zona: 'RADIO URBANO SUR', orientacion: 'S' },
            { id: 10, name: 'La Costanera OESTE', zona: 'RADIO URBANO SUR', orientacion: 'S' },
            { id: 11, name: 'Las Chircas', zona: 'RADIO URBANO SUR', orientacion: 'S' },
            { id: 12, name: 'Cuadro Estación', zona: 'RADIO URBANO SUR', orientacion: 'S' },
            { id: 13, name: 'La Piedad (Entre Carballo y Galigniana)', zona: 'RURAL' },
            { id: 14, name: 'B° San Cayetano y Calle Arenas', zona: 'RURAL' },
            { id: 15, name: 'B° Cristo de La Piedad', zona: 'RURAL' },
            { id: 16, name: 'Los Lotes', zona: 'RURAL' },
            { id: 17, name: 'Barrio Municipal', zona: 'RURAL' },
            { id: 18, name: 'Catitas Vieja (Alrededor Esc. Rodríguez)', zona: 'RURAL' },
            { id: 19, name: 'Catitas Vieja (Frente Calle Fredes y alrededores)', zona: 'RURAL' }
        ]
    },
    'Villa Cabecera': {
        subzonas: [
            { id: 1, name: 'Centro Villa (Entre San Martín y Arenas)', zona: 'RADIO URBANO OESTE', orientacion: 'O' },
            { id: 2, name: 'Centro Villa (Entre Arenas y Alberdi)', zona: 'RADIO URBANO OESTE', orientacion: 'O' },
            { id: 3, name: 'B° Primavera', zona: 'RADIO URBANO OESTE', orientacion: 'O' },
            { id: 4, name: 'Cuadro Estación', zona: 'RADIO URBANO OESTE', orientacion: 'O' },
            { id: 5, name: 'Acceso Suárez', zona: 'RADIO URBANO OESTE', orientacion: 'O' },
            { id: 6, name: 'Centro Villa', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 7, name: 'SAAR', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 8, name: 'Angelino Arenas', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 9, name: 'Barrio Disperso', zona: 'RADIO URBANO ESTE', orientacion: 'E' },
            { id: 10, name: 'La Costa', zona: 'RURAL' },
            { id: 11, name: 'B° Jardín (La Costa)', zona: 'RURAL' },
            { id: 12, name: 'B° Los Gringos y calle Unión', zona: 'RURAL' },
            { id: 13, name: 'Las Trincheras', zona: 'RURAL' }
        ]
    }
};

// ===== OBRAS POR DISTRITO =====
const obrasPorDistrito = {
    'Las Catitas': [
        'Remodelación integral de Plaza La Costanera (Playón Multideportivo e Isla de Juegos)',
        'Repavimentación de Ruta Provincial 50 (La Piedad/Los Lotes)',
        'Urbanización del barrio Arenas y SUTE',
        'Construcción de la ciclovía de calle Guiñazú',
        'Erradicación del basural',
        'Refacción y ampliación de la Terminal de Ómnibus (Baños)',
        'Remodelación de las plazas Malvinas Argentinas y Sarmiento',
        'Recambio a led y nuevas luminarias (Calle Eliseo Ortiz, La Costanera y otros)',
        'Repavimentación y asfaltado de calles Francisco Cirot, Av. Emilio Civit y calles alrededor de Plaza Sarmiento',
        'Construcción del Paseo Urbano Leonardo Favio'
    ],
    'La Dormida': [
        'Construcción Centro Sustentable y Planta de Transferencia',
        'Construcción Centro de Desarrollo Infantil B° Cosquín',
        'Construcción del Parque Ventura Segura',
        'Repavimentación de Ruta Provincial 50 (Gob. Civit)',
        'Remodelación Plaza Eva Perón',
        'Remodelación Boulevard Los Damascos y Av. Remo Falciani',
        'Ampliación CIC La Dormida',
        'Playón Multideportivo B° Procrear',
        'Recambio a led y nuevas luminarias'
    ],
    'Villa Cabecera': [
        'Construcción Auditorio Municipal',
        'Asfaltado Calle Alberdi y Alejo Mallea',
        'Construcción Ciclovía Calle Suárez',
        'Repavimentación de Ruta Provincial 50 (La Costa)',
        'Remodelación Plaza 25 de Mayo (Pintura, refacción y Rincón de las Infancias)',
        'Refacciones Baños Polideportivo Municipal y Playón Multideportivo',
        'Construcción Paseo Armando Benjamín Henríquez',
        'Remodelación Paseo Vendimia y Monumento Cruz Blanca',
        'Recambio a led y nuevas luminarias'
    ],
    '12 de Octubre': [],
    'El Marcado': []
};

// ===== VARIABLES GLOBALES =====
let numeroEncuesta = 1;

// ===== FUNCIONES AUXILIARES =====
function cargarNumeroEncuesta() {
    const guardado = localStorage.getItem('numeroEncuesta');
    numeroEncuesta = guardado ? parseInt(guardado) + 1 : 1;
    localStorage.setItem('numeroEncuesta', numeroEncuesta.toString());
    return numeroEncuesta;
}

function volverAlDistrito() {
    window.location.href = 'index.html';
}

function volverAlInicio() {
    if (confirm('¿Estás seguro de que quieres volver? Los datos del formulario se perderán.')) {
        window.location.href = 'index.html';
    }
}

// ===== PASO 1: INICIALIZAR PÁGINA DE DISTRITOS =====
function initPaginaDistrito() {
    console.log('📄 Inicializando página de distritos...');
    
    const distritoSelect = document.getElementById('distritoPrincipal');
    const btnIrSubzonas = document.getElementById('btnIrSubzonas');

    if (!distritoSelect || !btnIrSubzonas) {
        console.error('❌ No se encontraron los elementos necesarios');
        return;
    }

    // Poblar distritos
    Object.keys(distritosData).forEach(distrito => {
        const option = document.createElement('option');
        option.value = distrito;
        option.textContent = distrito;
        distritoSelect.appendChild(option);
    });

    // Habilitar botón al seleccionar distrito
    distritoSelect.addEventListener('change', function() {
        btnIrSubzonas.disabled = !this.value;
    });

    // Ir a subzonas
    btnIrSubzonas.addEventListener('click', function() {
        const distrito = distritoSelect.value;
        if (!distrito) {
            alert('Por favor, seleccione un distrito');
            return;
        }
        
        // Guardar distrito en sessionStorage
        sessionStorage.setItem('distritoEncuesta', distrito);
        
        // Ir a la página de subzonas
        window.location.href = 'subzonas.html';
    });
}

// ===== PASO 2: INICIALIZAR PÁGINA DE SUBZONAS =====
function initPaginaSubzonas() {
    console.log('📄 Inicializando página de subzonas...');
    
    // Obtener distrito guardado
    const distrito = sessionStorage.getItem('distritoEncuesta');
    
    if (!distrito || !distritosData[distrito]) {
        alert('No se ha seleccionado un distrito. Volviendo al inicio...');
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre del distrito en el header
    const distritoActualElem = document.getElementById('distritoActual');
    if (distritoActualElem) {
        distritoActualElem.textContent = distrito;
    }
    
    // Generar listado de subzonas
    const listadoContainer = document.getElementById('listadoSubzonas');
    const btnContinuar = document.getElementById('btnContinuarEncuesta');
    
    if (!listadoContainer || !btnContinuar) {
        console.error('❌ No se encontraron los contenedores necesarios');
        return;
    }
    
    const subzonas = distritosData[distrito].subzonas;
    
    // Agrupar por zona
    const grupos = {};
    subzonas.forEach(sub => {
        if (!grupos[sub.zona]) grupos[sub.zona] = [];
        grupos[sub.zona].push(sub);
    });
    
    // Orden de zonas: urbanas primero (por orientación), luego rurales
    const ordenZonas = [
        'RADIO URBANO NORTE',
        'RADIO URBANO CENTRO',
        'RADIO URBANO SUR',
        'RADIO URBANO ESTE',
        'RADIO URBANO OESTE',
        'RURAL'
    ];
    
    let html = '';
    
    ordenZonas.forEach(zona => {
        if (grupos[zona] && grupos[zona].length > 0) {
            // Header del grupo
            let label = zona;
            let emoji = '📍';
            let colorClass = 'zona-rural';
            
            if (zona.includes('RADIO URBANO')) {
                const orient = zona.replace('RADIO URBANO ', '');
                emoji = { 'NORTE': '⬆️', 'SUR': '⬇️', 'ESTE': '➡️', 'OESTE': '⬅️', 'CENTRO': '🎯' }[orient] || '📍';
                colorClass = `zona-urbana zona-${orient.toLowerCase()}`;
                label = `${emoji} ${zona}`;
            } else {
                emoji = '🌾';
                label = `${emoji} ZONA RURAL`;
            }
            
            html += `<div class="grupo-zona ${colorClass}">`;
            html += `<h3 class="grupo-titulo">${label}</h3>`;
            html += `<div class="subzonas-listado">`;
            
            grupos[zona].forEach(sub => {
                let displayName = `<span class="subzona-id">${sub.id}</span> ${sub.name}`;
                if (sub.orientacion) {
                    displayName += ` <span class="subzona-orient">(${sub.orientacion})</span>`;
                }
                
                html += `
                    <label class="subzona-opcion" data-id="${sub.id}" data-zona="${sub.zona}" data-name="${sub.name}">
                        <input type="radio" name="subzonaSeleccionada" value="${sub.name}">
                        <span class="subzona-texto">${displayName}</span>
                    </label>
                `;
            });
            
            html += `</div></div>`;
        }
    });
    
    listadoContainer.innerHTML = html;
    
    // Evento de selección de subzona
    document.querySelectorAll('input[name="subzonaSeleccionada"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Quitar clase seleccionada de todos
            document.querySelectorAll('.subzona-opcion').forEach(el => {
                el.classList.remove('seleccionada');
            });
            
            // Marcar la seleccionada
            this.closest('.subzona-opcion').classList.add('seleccionada');
            
            // Habilitar botón continuar
            btnContinuar.disabled = false;
        });
    });
    
    // Botón continuar
    btnContinuar.addEventListener('click', function() {
        const seleccionada = document.querySelector('input[name="subzonaSeleccionada"]:checked');
        
        if (!seleccionada) {
            alert('Por favor, seleccione una subzona');
            return;
        }
        
        const labelPadre = seleccionada.closest('.subzona-opcion');
        const subzonaId = labelPadre.dataset.id;
        const subzonaZona = labelPadre.dataset.zona;
        const subzonaNombre = labelPadre.dataset.name;
        
        // Guardar en sessionStorage
        sessionStorage.setItem('subzonaEncuesta', subzonaNombre);
        sessionStorage.setItem('subzonaId', subzonaId);
        sessionStorage.setItem('subzonaZona', subzonaZona);
        
        // Generar número de encuesta
        const numEncuesta = cargarNumeroEncuesta();
        sessionStorage.setItem('numeroEncuesta', numEncuesta.toString());
        
        // Ir a la encuesta
        window.location.href = 'encuesta.html';
    });
}

// ===== PASO 3: INICIALIZAR PÁGINA DE ENCUESTA =====
function initPaginaEncuesta() {
    console.log('📄 Inicializando página de encuesta...');
    
    const distrito = sessionStorage.getItem('distritoEncuesta') || 'No seleccionado';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || 'No seleccionada';
    const subzonaZona = sessionStorage.getItem('subzonaZona') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    // Mostrar info en el header
    const distritoElem = document.getElementById('distritoSeleccionado');
    const subzonaElem = document.getElementById('subzonaSeleccionada');
    const numElem = document.getElementById('numeroEncuesta');
    
    if (distritoElem) distritoElem.textContent = distrito;
    if (subzonaElem) {
        let text = subzona;
        if (subzonaZona.includes('RADIO URBANO')) {
            const orient = subzonaZona.replace('RADIO URBANO ', '');
            text += ` (${orient})`;
        } else if (subzonaZona === 'RURAL') {
            text += ' 🌾';
        }
        subzonaElem.textContent = text;
    }
    if (numElem) numElem.textContent = `#${String(numEncuesta).padStart(3, '0')}`;

    // Mostrar nombre del distrito en la pregunta 13
    const nombreDistritoObras = document.getElementById('nombreDistritoObras');
    if (nombreDistritoObras) nombreDistritoObras.textContent = distrito;

    // Cargar obras según distrito
    cargarObrasDistrito(distrito);

    // Mostrar pregunta abierta
    const preguntasCalificacion = ['p2', 'p4', 'p5'];
    preguntasCalificacion.forEach(id => {
        document.querySelectorAll(`input[name="${id}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const motivoDiv = document.getElementById('preguntaAbierta1');
                if (motivoDiv) {
                    motivoDiv.style.display = ['regular', 'malo'].includes(this.value) ? 'block' : 'none';
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
                guardarDatos(recolectarDatos());
            }
        });
    }
}

// ===== CARGAR OBRAS SEGÚN DISTRITO =====
function cargarObrasDistrito(distrito) {
    const container = document.getElementById('obrasDistritoContainer');
    if (!container) return;
    
    const obras = obrasPorDistrito[distrito] || [];
    
    if (obras.length === 0) {
        container.innerHTML = `
            <p style="color: #95a5a6; font-style: italic; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                ℹ️ Las obras para este distrito aún no están cargadas.
            </p>
            <input type="hidden" name="p13" value="">
        `;
        return;
    }
    
    let html = '<div class="opciones">';
    obras.forEach((obra, index) => {
        html += `
            <label>
                <input type="radio" name="p13" value="obra_${index + 1}">
                ${obra}
            </label>
        `;
    });
    html += `
        <label>
            <input type="radio" name="p13" value="otro">
            Otra obra o intervención: <input type="text" name="p13_otro" placeholder="Especifique">
        </label>
    `;
    html += '</div>';
    
    container.innerHTML = html;
}

// ===== VALIDAR FORMULARIO =====
function validarFormulario() {
    const camposRequeridos = ['sexo', 'edad', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p10', 'p11'];
    let camposFaltantes = [];
    
    const nombresCampos = {
        'sexo': 'Sexo',
        'edad': 'Rango etario',
        'p10': 'Pregunta 10',
        'p11': 'Pregunta 11'
    };
    
    // Solo validar p13 si hay obras cargadas
    const distrito = sessionStorage.getItem('distritoEncuesta');
    const obrasDisponibles = obrasPorDistrito[distrito] || [];
    if (obrasDisponibles.length > 0) {
        camposRequeridos.push('p13');
    }
    
    camposRequeridos.forEach(id => {
        const seleccionado = document.querySelector(`input[name="${id}"]:checked`);
        if (!seleccionado) {
            const nombre = nombresCampos[id] || `Pregunta ${id.replace('p', '')}`;
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
    const distrito = sessionStorage.getItem('distritoEncuesta') || '';
    const subzona = sessionStorage.getItem('subzonaEncuesta') || '';
    const subzonaId = sessionStorage.getItem('subzonaId') || '';
    const subzonaZona = sessionStorage.getItem('subzonaZona') || '';
    const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
    
    return {
        fecha: new Date().toISOString(),
        numeroEncuesta: numEncuesta,
        distrito: distrito,
        subzona: subzona,
        subzonaId: subzonaId,
        subzonaZona: subzonaZona,
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

// ===== GUARDAR EN GOOGLE SHEETS =====
function guardarDatos(datos) {
    console.log('📤 Enviando datos a Google Sheets...');
    
    const btnGuardar = document.getElementById('btnGuardar');
    const textoOriginal = btnGuardar.textContent;
    btnGuardar.textContent = '⏳ Guardando...';
    btnGuardar.disabled = true;
    
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => {
        btnGuardar.textContent = '✅ ¡Guardado!';
        alert(`✅ Encuesta #${datos.numeroEncuesta} guardada correctamente!`);
        setTimeout(() => window.location.href = 'gracias.html', 1000);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        btnGuardar.textContent = textoOriginal;
        btnGuardar.disabled = false;
        alert('❌ Error al guardar. Intente nuevamente.');
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando...');
    
    const path = window.location.pathname;
    
    if (path.includes('subzonas.html')) {
        console.log('📄 Página: subzonas.html');
        initPaginaSubzonas();
    } else if (path.includes('encuesta.html')) {
        console.log('📄 Página: encuesta.html');
        initPaginaEncuesta();
    } else if (path.includes('gracias.html')) {
        console.log('📄 Página: gracias.html');
        const distrito = sessionStorage.getItem('distritoEncuesta') || '-';
        const subzona = sessionStorage.getItem('subzonaEncuesta') || '-';
        const numEncuesta = sessionStorage.getItem('numeroEncuesta') || '001';
        
        const distritoElem = document.getElementById('encuestaDistrito');
        const subzonaElem = document.getElementById('encuestaSubzona');
        const numElem = document.getElementById('encuestaNumero');
        
        if (distritoElem) distritoElem.textContent = distrito;
        if (subzonaElem) subzonaElem.textContent = subzona;
        if (numElem) numElem.textContent = `#${String(numEncuesta).padStart(3, '0')}`;
    } else {
        console.log('📄 Página: index.html');
        initPaginaDistrito();
    }
});

// Exponer funciones globales
window.volverAlInicio = volverAlInicio;
window.volverAlDistrito = volverAlDistrito;
