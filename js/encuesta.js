// =====================================================
// ENCUESTA DE PERCEPCIÓN VECINAL - SANTA ROSA
// =====================================================

// ===== CONFIGURACIÓN =====
const CONFIG = {
    urlScript: 'https://script.google.com/macros/s/AKfycby5PZXTs5sfuO0Y6ZpGUvl3aQPBEtrkyp-X_M38YVSjjwcDmNdEJLddjivNnE8wGnSW/exec',
    clave: 'no1926', // Debe ser igual a CLAVE en Code.gs
    tiempoEsperaMs: 20000
};

// ===== DATOS =====
const ZONAS = {
    N: 'RADIO URBANO NORTE',
    C: 'RADIO URBANO CENTRO',
    S: 'RADIO URBANO SUR',
    E: 'RADIO URBANO ESTE',
    O: 'RADIO URBANO OESTE',
    R: 'RURAL'
};
const CLASE_ZONA = { N: 'norte', C: 'centro', S: 'sur', E: 'este', O: 'oeste' };
const ORDEN_ZONAS = ['N', 'C', 'S', 'E', 'O', 'R'];

// Cada distrito se abre con su propio enlace: subzonas.html?d=<clave>
const DISTRITOS = {
    'las-catitas': {
        nombre: 'Las Catitas',
        subzonas: [
            ['Los Espinillos y SUTE', 'N'],
            ['Arenas', 'N'],
            ['San Cayetano', 'N'],
            ['Guiñazú y colectoras', 'N'],
            ['Eulalia Calderón y Guiñazú', 'C'],
            ['Entre Emilio Civit y Uriburu', 'C'],
            ['B° Jardín Oeste', 'C'],
            ['Eliseo Ortiz', 'C'],
            ['La Costanera ESTE', 'S'],
            ['La Costanera OESTE', 'S'],
            ['Las Chircas', 'S'],
            ['Cuadro Estación', 'S'],
            ['La Piedad (Entre Carballo y Galigniana)', 'R'],
            ['B° San Cayetano y Calle Arenas', 'R'],
            ['B° Cristo de La Piedad', 'R'],
            ['Los Lotes', 'R'],
            ['Barrio Municipal', 'R'],
            ['Catitas Vieja (Alrededor Esc. Rodríguez)', 'R'],
            ['Catitas Vieja (Frente Calle Fredes y alrededores)', 'R']
        ],
        obras: [
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
        ]
    },
    'la-dormida': {
        nombre: 'La Dormida',
        subzonas: [
            ['Crespo Norte', 'N'],
            ['PROCREAR', 'N'],
            ['Saavedra y Colectoras Ruta 7', 'N'],
            ['Crespo Sur', 'S'],
            ['San Cayetano III', 'S'],
            ['Nuevo Horizonte', 'E'],
            ['30 de Agosto y La Posta', 'E'],
            ['SAAR', 'E'],
            ['Cosquín', 'E'],
            ['Remo Falciani (B° La Dormida)', 'E'],
            ['Gdor. Civit', 'R'],
            ['B° Parrales Mendocinos', 'R']
        ],
        obras: [
            'Construcción Centro Sustentable y Planta de Transferencia',
            'Construcción Centro de Desarrollo Infantil B° Cosquín',
            'Construcción del Parque Ventura Segura',
            'Repavimentación de Ruta Provincial 50 (Gob. Civit)',
            'Remodelación Plaza Eva Perón',
            'Remodelación Boulevard Los Damascos y Av. Remo Falciani',
            'Ampliación CIC La Dormida',
            'Playón Multideportivo B° Procrear',
            'Recambio a led y nuevas luminarias'
        ]
    },
    'villa-cabecera': {
        nombre: 'Villa Cabecera',
        subzonas: [
            ['Centro Villa (Entre San Martín y Arenas)', 'O'],
            ['Centro Villa (Entre Arenas y Alberdi)', 'O'],
            ['B° Primavera', 'O'],
            ['Cuadro Estación', 'O'],
            ['Acceso Suárez', 'O'],
            ['Centro Villa', 'E'],
            ['SAAR', 'E'],
            ['Angelino Arenas', 'E'],
            ['Barrio Disperso', 'E'],
            ['La Costa', 'R'],
            ['B° Jardín (La Costa)', 'R'],
            ['B° Los Gringos y calle Unión', 'R'],
            ['Las Trincheras', 'R']
        ],
        obras: [
            'Construcción Auditorio Municipal',
            'Asfaltado Calle Alberdi y Alejo Mallea',
            'Construcción Ciclovía Calle Suárez',
            'Repavimentación de Ruta Provincial 50 (La Costa)',
            'Remodelación Plaza 25 de Mayo (Pintura, refacción y Rincón de las Infancias)',
            'Refacciones Baños Polideportivo Municipal y Playón Multideportivo',
            'Construcción Paseo Armando Benjamín Henríquez',
            'Remodelación Paseo Vendimia y Monumento Cruz Blanca',
            'Recambio a led y nuevas luminarias'
        ]
    },
    '12-de-octubre': {
        nombre: '12 de Octubre',
        subzonas: [
            ['B° Santa María y 12 de Octubre', 'R'],
            ['Cruce Ruta 50 y El Mirador', 'R'],
            ['25 de Mayo', 'R'],
            ['Malvinas Argentinas', 'R'],
            ['Viña Fundación', 'R'],
            ['El Divisadero', 'R']
        ],
        obras: [
            'Repavimentación de Ruta Provincial 50',
            'Construcción Plazoleta Divina Misericordia',
            'Remodelación Plaza Juan Pablo II',
            'Remodelación Paseo 25 de Mayo',
            'Extensión de red de agua (El Divisadero)',
            'Ampliación CIC 12 de Octubre',
            'Instalación de garitas y cartelería'
        ]
    },
    'el-marcado': {
        nombre: 'El Marcado',
        subzonas: [
            ['B° Molina Cabrera', 'R'],
            ['B° Esperanza Santarrosina', 'R']
        ],
        obras: [
            'Remodelación y ampliación Centro de Salud El Marcado',
            'Remodelación Plaza Manuel Belgrano',
            'Instalación de garitas y cartelería',
            'Recambio a led y nuevas luminarias'
        ]
    }
};

// Opciones de la pregunta 9 (se cargan en los tres selectores)
const PROBLEMAS = [
    ['trabajo', 'Falta de trabajo / empleo'],
    ['inseguridad', 'Inseguridad'],
    ['agua', 'Acceso al agua potable'],
    ['limpieza', 'Limpieza y gestión de residuos'],
    ['contaminacion', 'Contaminación / problemas ambientales'],
    ['calles', 'Estado de calles y caminos'],
    ['educacion', 'Falta de ofertas educativas'],
    ['iluminacion', 'Falta o deterioro de iluminación'],
    ['infraestructura', 'Falta o deterioro de infraestructura y servicios'],
    ['otro', 'Otro']
];

// ===== UTILIDADES =====
const $ = id => document.getElementById(id);

function el(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
}

function distritoPorClave(clave) {
    return clave && Object.prototype.hasOwnProperty.call(DISTRITOS, clave) ? DISTRITOS[clave] : null;
}

function nuevoId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'e-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// ===== COLA DE ENVÍO (la encuesta nunca se pierde si no hay conexión) =====
const CLAVE_COLA = 'colaEncuestasPendientes';

function leerCola() {
    try { return JSON.parse(localStorage.getItem(CLAVE_COLA)) || []; } catch (e) { return []; }
}

function escribirCola(cola) {
    localStorage.setItem(CLAVE_COLA, JSON.stringify(cola));
}

async function enviarAlScript(datos) {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), CONFIG.tiempoEsperaMs);
    try {
        // Sin cabecera Content-Type: se envía como text/plain, lo que evita el bloqueo CORS
        // y permite leer la respuesta real del servidor.
        const respuesta = await fetch(CONFIG.urlScript, {
            method: 'POST',
            body: JSON.stringify(Object.assign({}, datos, { clave: CONFIG.clave })),
            signal: control.signal
        });
        return await respuesta.json();
    } finally {
        clearTimeout(temporizador);
    }
}

let sincronizando = false;

async function sincronizarCola() {
    const resultados = {};
    if (sincronizando) return resultados;
    sincronizando = true;
    try {
        for (const item of leerCola()) {
            try {
                const r = await enviarAlScript(item);
                if (r && r.ok) {
                    resultados[item.idEncuesta] = r;
                    escribirCola(leerCola().filter(x => x.idEncuesta !== item.idEncuesta));
                } else {
                    resultados[item.idEncuesta] = { ok: false, error: (r && r.error) || 'Error del servidor' };
                }
            } catch (e) {
                resultados[item.idEncuesta] = { ok: false, error: 'Sin conexión' };
                break; // sin red: no insistir con el resto
            }
        }
    } finally {
        sincronizando = false;
    }
    return resultados;
}

async function guardarEncuesta(datos) {
    const cola = leerCola();
    if (!cola.some(x => x.idEncuesta === datos.idEncuesta)) {
        cola.push(datos);
        escribirCola(cola); // primero queda guardada en el dispositivo
    }
    const resultados = await sincronizarCola();
    const r = resultados[datos.idEncuesta];
    if (r && r.ok) return { estado: 'enviada', numero: r.numero };
    return { estado: 'pendiente', error: r ? r.error : '' };
}

function actualizarAvisoPendientes() {
    const aviso = $('avisoPendientes');
    if (!aviso) return;
    const n = leerCola().length;
    aviso.classList.toggle('hidden', n === 0);
    const cantidad = aviso.querySelector('[data-cantidad]');
    if (cantidad) cantidad.textContent = n === 1 ? '1 encuesta' : n + ' encuestas';
}

function iniciarSincronizacion() {
    actualizarAvisoPendientes();
    const boton = $('btnEnviarPendientes');
    if (boton) {
        boton.addEventListener('click', async () => {
            boton.disabled = true;
            boton.textContent = 'Enviando...';
            await sincronizarCola();
            boton.disabled = false;
            boton.textContent = 'Enviar ahora';
            actualizarAvisoPendientes();
        });
    }
    if (leerCola().length) sincronizarCola().then(actualizarAvisoPendientes);
    window.addEventListener('online', () => sincronizarCola().then(actualizarAvisoPendientes));
}

// ===== PÁGINA 1: ÍNDICE (selector interno de distrito) =====
function initIndex() {
    iniciarSincronizacion();
    const select = $('distritoPrincipal');
    const boton = $('btnIrSubzonas');

    Object.keys(DISTRITOS).forEach(clave => {
        const opcion = el('option', '', DISTRITOS[clave].nombre);
        opcion.value = clave;
        select.appendChild(opcion);
    });

    select.addEventListener('change', () => { boton.disabled = !select.value; });
    boton.addEventListener('click', () => {
        if (select.value) window.location.href = 'subzonas.html?d=' + encodeURIComponent(select.value);
    });
}

// ===== PÁGINA 2: SUBZONAS (una sola página para todos los distritos) =====
function initSubzonas() {
    iniciarSincronizacion();

    const clave = new URLSearchParams(window.location.search).get('d');
    const distrito = distritoPorClave(clave);
    if (!distrito) {
        $('errorEnlace').classList.remove('hidden');
        $('contenidoSubzonas').classList.add('hidden');
        return;
    }

    document.title = 'Subzonas - ' + distrito.nombre;
    $('distritoActual').textContent = distrito.nombre;

    const subzonas = distrito.subzonas.map(([nombre, z], i) => ({ id: i + 1, nombre: nombre, clave: z, zona: ZONAS[z] }));
    const listado = $('listadoSubzonas');
    const boton = $('btnContinuarEncuesta');
    const campoEncuestador = $('encuestador');
    let seleccion = null;

    campoEncuestador.value = localStorage.getItem('encuestador') || '';

    const actualizarBoton = () => {
        boton.disabled = !(seleccion && campoEncuestador.value.trim());
    };

    ORDEN_ZONAS.forEach(z => {
        const grupo = subzonas.filter(s => s.clave === z);
        if (!grupo.length) return;

        const contenedor = el('div', 'grupo-zona ' + (z === 'R' ? 'zona-rural' : 'zona-urbana zona-' + CLASE_ZONA[z]));
        contenedor.appendChild(el('h3', 'grupo-titulo', z === 'R' ? 'ZONA RURAL' : ZONAS[z]));
        const lista = el('div', 'subzonas-listado');

        grupo.forEach(sub => {
            const etiqueta = el('label', 'subzona-opcion');
            const radio = el('input');
            radio.type = 'radio';
            radio.name = 'subzonaSeleccionada';
            radio.value = String(sub.id);

            const texto = el('span', 'subzona-texto');
            texto.appendChild(el('span', 'subzona-id', String(sub.id)));
            texto.append(' ' + sub.nombre);
            if (z !== 'R') {
                texto.append(' ');
                texto.appendChild(el('span', 'subzona-orient', '(' + z + ')'));
            }

            radio.addEventListener('change', () => {
                listado.querySelectorAll('.subzona-opcion').forEach(n => n.classList.remove('seleccionada'));
                etiqueta.classList.add('seleccionada');
                seleccion = sub;
                actualizarBoton();
            });

            etiqueta.append(radio, texto);
            lista.appendChild(etiqueta);
        });

        contenedor.appendChild(lista);
        listado.appendChild(contenedor);
    });

    campoEncuestador.addEventListener('input', actualizarBoton);

    boton.addEventListener('click', () => {
        if (!seleccion || !campoEncuestador.value.trim()) return;
        const encuestador = campoEncuestador.value.trim();
        localStorage.setItem('encuestador', encuestador);

        sessionStorage.setItem('distritoClave', clave);
        sessionStorage.setItem('distritoNombre', distrito.nombre);
        sessionStorage.setItem('subzonaNombre', seleccion.nombre);
        sessionStorage.setItem('subzonaId', String(seleccion.id));
        sessionStorage.setItem('subzonaZona', seleccion.zona);
        sessionStorage.setItem('subzonaClave', seleccion.clave);
        sessionStorage.setItem('encuestador', encuestador);
        sessionStorage.setItem('idEncuesta', nuevoId());
        window.location.href = 'encuesta.html';
    });
}

// ===== PÁGINA 3: ENCUESTA =====
let form;
let refrescarRanking = () => {};

function initEncuesta() {
    const clave = sessionStorage.getItem('distritoClave');
    const distrito = distritoPorClave(clave);
    if (!distrito || !sessionStorage.getItem('idEncuesta') || !sessionStorage.getItem('subzonaNombre')) {
        window.location.href = distrito ? 'subzonas.html?d=' + encodeURIComponent(clave) : 'index.html';
        return;
    }

    form = $('formEncuesta');

    const zonaClave = sessionStorage.getItem('subzonaClave');
    $('distritoSeleccionado').textContent = distrito.nombre;
    $('subzonaSeleccionada').textContent = sessionStorage.getItem('subzonaNombre') + (zonaClave && zonaClave !== 'R' ? ' (' + zonaClave + ')' : ' (rural)');
    $('encuestadorSeleccionado').textContent = sessionStorage.getItem('encuestador') || '-';
    $('nombreDistritoObras').textContent = distrito.nombre;

    cargarObras(distrito);
    prepararRanking();
    vincularOtros();
    actualizarCondicionales();

    form.addEventListener('change', actualizarCondicionales);

    $('btnVolver').addEventListener('click', () => {
        if (confirm('¿Volver a las subzonas? Los datos cargados en este formulario se perderán.')) {
            window.location.href = 'subzonas.html?d=' + encodeURIComponent(clave);
        }
    });

    $('btnLimpiar').addEventListener('click', () => {
        if (!confirm('¿Limpiar todas las respuestas del formulario?')) return;
        form.reset();
        limpiarErrores();
        mostrarEstado('');
        actualizarCondicionales();
        refrescarRanking();
    });

    $('btnGuardar').addEventListener('click', guardarDesdeFormulario);
}

function cargarObras(distrito) {
    const contenedor = $('obrasDistritoContainer');
    const opciones = el('div', 'opciones');

    distrito.obras.forEach(obra => {
        const etiqueta = el('label');
        const radio = el('input');
        radio.type = 'radio';
        radio.name = 'p13';
        radio.value = obra;
        etiqueta.append(radio, ' ' + obra);
        opciones.appendChild(etiqueta);
    });

    const otra = el('label');
    const radioOtro = el('input');
    radioOtro.type = 'radio';
    radioOtro.name = 'p13';
    radioOtro.value = 'otro';
    const texto = el('input');
    texto.type = 'text';
    texto.name = 'p13_otro';
    texto.placeholder = 'Especifique';
    otra.append(radioOtro, ' Otra obra o intervención: ', texto);
    opciones.appendChild(otra);

    contenedor.appendChild(opciones);
}

// ----- Pregunta 9: no se puede repetir un problema -----
function prepararRanking() {
    const selects = Array.from(form.querySelectorAll('select[name^="p9_"]'));
    selects.forEach((select, i) => {
        const placeholder = el('option', '', 'Seleccione el ' + (i + 1) + '° problema...');
        placeholder.value = '';
        select.appendChild(placeholder);
        PROBLEMAS.forEach(([valor, texto]) => {
            const opcion = el('option', '', texto);
            opcion.value = valor;
            select.appendChild(opcion);
        });
    });

    refrescarRanking = () => {
        const elegidos = selects.map(s => s.value).filter(Boolean);
        selects.forEach(select => {
            Array.from(select.options).forEach(opcion => {
                opcion.disabled = !!opcion.value && opcion.value !== select.value && elegidos.includes(opcion.value);
            });
        });
    };
    selects.forEach(s => s.addEventListener('change', refrescarRanking));
    refrescarRanking();
}

// ----- Campos "Otro": al escribir se marca la opción; al elegir otra se borra el texto -----
function controlDeOtro(textoInput) {
    const base = textoInput.name.replace(/_otro$/, '');
    return form.querySelector('input[name="' + base + '"][value="otro"]');
}

function vincularOtros() {
    form.querySelectorAll('input[type="text"][name$="_otro"]').forEach(texto => {
        const control = controlDeOtro(texto);
        if (!control) return;
        const marcar = () => { if (!control.checked) { control.checked = true; actualizarCondicionales(); } };
        texto.addEventListener('focus', marcar);
        texto.addEventListener('input', marcar);
    });
}

function sincronizarOtros() {
    form.querySelectorAll('input[type="text"][name$="_otro"]').forEach(texto => {
        const control = controlDeOtro(texto);
        if (control && !control.checked) texto.value = '';
    });
}

// ----- Preguntas condicionales -----
function valorRadio(nombre) {
    const marcado = form.querySelector('input[name="' + nombre + '"]:checked');
    return marcado ? marcado.value : '';
}

function limpiarCampos(contenedor) {
    contenedor.querySelectorAll('input, textarea, select').forEach(campo => {
        if (campo.type === 'radio' || campo.type === 'checkbox') campo.checked = false;
        else campo.value = '';
    });
    contenedor.querySelectorAll('.pregunta.error').forEach(p => p.classList.remove('error'));
}

function alternar(id, mostrar) {
    const nodo = $(id);
    if (!nodo) return;
    nodo.classList.toggle('hidden', !mostrar);
    if (!mostrar) limpiarCampos(nodo); // lo que queda oculto no se envía
}

function actualizarCondicionales() {
    // El motivo aparece si CUALQUIERA de P2, P4 o P5 es regular o malo
    const hayDisconformidad = ['p2', 'p4', 'p5'].some(n => ['regular', 'malo'].includes(valorRadio(n)));
    alternar('bloqueMotivo', hayDisconformidad);
    alternar('bloqueOperativo', valorRadio('p6') === 'si');
    sincronizarOtros();
}

// ----- Validación -----
function limpiarErrores() {
    form.querySelectorAll('.pregunta.error').forEach(p => p.classList.remove('error'));
}

function marcarError(nodo, mensaje) {
    const pregunta = nodo.closest('.pregunta');
    pregunta.classList.add('error');
    let aviso = pregunta.querySelector(':scope > .mensaje-campo');
    if (!aviso) {
        aviso = el('p', 'mensaje-campo');
        pregunta.appendChild(aviso);
    }
    aviso.textContent = mensaje;
    return pregunta;
}

function mostrarEstado(texto) {
    const caja = $('mensajeEstado');
    caja.textContent = texto;
    caja.classList.toggle('hidden', !texto);
}

function validar() {
    limpiarErrores();
    const errores = [];
    const falta = (nodo, mensaje) => errores.push(marcarError(nodo, mensaje || 'Pregunta obligatoria'));

    const obligatorias = ['sexo', 'edad', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p10', 'p11', 'p13'];
    if (valorRadio('p6') === 'si') obligatorias.push('p8');
    obligatorias.forEach(nombre => {
        const primero = form.querySelector('input[name="' + nombre + '"]');
        if (primero && !valorRadio(nombre)) falta(primero);
    });

    if (valorRadio('p6') === 'si' && !form.querySelector('input[name="p7"]:checked')) {
        falta(form.querySelector('input[name="p7"]'), 'Marque al menos un servicio');
    }

    const motivo = form.querySelector('textarea[name="motivo_disconformidad"]');
    if (!motivo.closest('.hidden') && !motivo.value.trim()) falta(motivo, 'Registre el motivo');

    const selects = Array.from(form.querySelectorAll('select[name^="p9_"]'));
    selects.forEach(s => { if (!s.value) falta(s); });
    const elegidos = selects.map(s => s.value).filter(Boolean);
    if (new Set(elegidos).size !== elegidos.length) falta(selects[0], 'No repita el mismo problema');

    form.querySelectorAll('input[type="text"][name$="_otro"]').forEach(texto => {
        const control = controlDeOtro(texto);
        if (control && control.checked && !texto.value.trim()) falta(texto, 'Especifique la opción "Otro"');
    });

    const unicos = Array.from(new Set(errores));
    unicos.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

    if (unicos.length) {
        mostrarEstado('Faltan completar ' + unicos.length + (unicos.length === 1 ? ' pregunta obligatoria.' : ' preguntas obligatorias.'));
        unicos[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
    mostrarEstado('');
    return true;
}

// ----- Recolección: se guardan los textos legibles, no códigos internos -----
function textoDe(input) {
    if (input.value === 'otro') return 'Otro';
    const etiqueta = input.closest('label');
    if (!etiqueta) return input.value;
    return Array.from(etiqueta.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/:$/, '');
}

function respuestaRadio(nombre) {
    const marcado = form.querySelector('input[name="' + nombre + '"]:checked');
    return marcado ? textoDe(marcado) : '';
}

function respuestaSelect(nombre) {
    const select = form.querySelector('select[name="' + nombre + '"]');
    if (!select || !select.value) return '';
    return select.value === 'otro' ? 'Otro' : select.selectedOptions[0].textContent;
}

function respuestaTexto(nombre) {
    const campo = form.querySelector('[name="' + nombre + '"]');
    return campo ? campo.value.trim() : '';
}

function respuestaMultiple(nombre, nombreOtro) {
    return Array.from(form.querySelectorAll('input[name="' + nombre + '"]:checked'))
        .map(c => c.value === 'otro' ? 'Otro: ' + (respuestaTexto(nombreOtro) || '(sin especificar)') : textoDe(c))
        .join('; ');
}

function recolectarDatos() {
    return {
        idEncuesta: sessionStorage.getItem('idEncuesta'),
        fechaCliente: new Date().toISOString(),
        encuestador: sessionStorage.getItem('encuestador') || '',
        distrito: sessionStorage.getItem('distritoNombre') || '',
        subzona: sessionStorage.getItem('subzonaNombre') || '',
        subzonaId: sessionStorage.getItem('subzonaId') || '',
        zona: sessionStorage.getItem('subzonaZona') || '',
        sexo: respuestaRadio('sexo'),
        edad: respuestaRadio('edad'),
        p1: respuestaRadio('p1'),
        p2: respuestaRadio('p2'),
        p3: respuestaRadio('p3'),
        p4: respuestaRadio('p4'),
        p5: respuestaRadio('p5'),
        motivo_disconformidad: respuestaTexto('motivo_disconformidad'),
        p6: respuestaRadio('p6'),
        p7: respuestaMultiple('p7', 'p7_otro'), // una sola columna: "Salud; Documentación"
        p8: respuestaRadio('p8'),
        p9_1: respuestaSelect('p9_1'),
        p9_2: respuestaSelect('p9_2'),
        p9_3: respuestaSelect('p9_3'),
        p10: respuestaRadio('p10'),
        p10_otro: respuestaTexto('p10_otro'),
        p11: respuestaRadio('p11'),
        p11_otro: respuestaTexto('p11_otro'),
        p12: respuestaTexto('p12'),
        p13: respuestaRadio('p13'),
        p13_otro: respuestaTexto('p13_otro'),
        p14: respuestaTexto('p14'),
        p15: respuestaTexto('p15')
    };
}

// ----- Guardado -----
let guardando = false;

async function guardarDesdeFormulario() {
    if (guardando || !validar()) return;
    guardando = true;
    const boton = $('btnGuardar');
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Guardando...';

    try {
        const datos = recolectarDatos();
        const resultado = await guardarEncuesta(datos);
        sessionStorage.setItem('resultadoEncuesta', JSON.stringify({
            estado: resultado.estado,
            numero: resultado.numero || '',
            distrito: datos.distrito,
            subzona: datos.subzona
        }));
        sessionStorage.removeItem('idEncuesta'); // impide reenviar la misma encuesta al volver atrás
        window.location.href = 'gracias.html';
    } catch (error) {
        console.error(error);
        mostrarEstado('No se pudo guardar la encuesta en este dispositivo. No cierre la página e intente nuevamente.');
        boton.disabled = false;
        boton.textContent = textoOriginal;
        guardando = false;
    }
}

// ===== PÁGINA 4: GRACIAS =====
function initGracias() {
    iniciarSincronizacion();

    let resultado = null;
    try { resultado = JSON.parse(sessionStorage.getItem('resultadoEncuesta')); } catch (e) { resultado = null; }

    if (resultado) {
        $('encuestaDistrito').textContent = resultado.distrito || '-';
        $('encuestaSubzona').textContent = resultado.subzona || '-';
        if (resultado.estado === 'enviada') {
            $('estadoEnvio').textContent = 'Sus respuestas han sido registradas correctamente.';
            $('encuestaNumero').textContent = '#' + String(resultado.numero).padStart(3, '0');
        } else {
            $('estadoEnvio').textContent = 'No hay conexión en este momento. La encuesta quedó guardada en este dispositivo y se enviará automáticamente cuando vuelva la señal. No borre los datos del navegador.';
            $('encuestaNumero').textContent = 'Pendiente de envío';
        }
    }

    const clave = sessionStorage.getItem('distritoClave');
    if (distritoPorClave(clave)) {
        $('btnNueva').href = 'subzonas.html?d=' + encodeURIComponent(clave);
    }
}

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', () => {
    const paginas = { index: initIndex, subzonas: initSubzonas, encuesta: initEncuesta, gracias: initGracias };
    const inicio = paginas[document.body.dataset.pagina];
    if (inicio) inicio();
});
