/**
 * ENCUESTA DE PERCEPCIÓN VECINAL - SANTA ROSA
 * Recibe cada encuesta y la guarda como UNA fila en la hoja "Respuestas".
 *
 * Instalación:
 * 1. En la planilla: Extensiones > Apps Script. Reemplazar todo el código por este.
 * 2. Cambiar CLAVE por una palabra propia (la misma que va en js/encuesta.js).
 * 3. Ejecutar una vez la función "inicializar" y aceptar los permisos.
 * 4. Implementar > Administrar implementaciones > editar (lápiz) > Versión: Nueva versión.
 *    Así la URL /exec NO cambia. Ejecutar como: yo. Acceso: cualquier usuario.
 */

const CLAVE = 'CAMBIAR_POR_UNA_CLAVE_PROPIA';
const NOMBRE_HOJA = 'Respuestas';
const ZONA_HORARIA = 'America/Argentina/Mendoza';
const ID_PLANILLA = ''; // Dejar vacío si el script se creó desde la propia planilla

// [clave que envía la web, título de la columna]. El orden define el orden de las columnas.
const COLUMNAS = [
  ['numero', 'N°'],
  ['fecha', 'Fecha'],
  ['hora', 'Hora'],
  ['recibida', 'Recibida en el servidor'],
  ['idEncuesta', 'ID'],
  ['encuestador', 'Encuestador'],
  ['distrito', 'Distrito'],
  ['subzona', 'Subzona'],
  ['subzonaId', 'N° subzona'],
  ['zona', 'Zona'],
  ['sexo', 'Sexo'],
  ['edad', 'Rango etario'],
  ['p1', 'P1 Conoce horarios de recolección'],
  ['p2', 'P2 Recolección domiciliaria'],
  ['p3', 'P3 Separa residuos secos'],
  ['p4', 'P4 Limpieza del barrio'],
  ['p5', 'P5 Luminaria'],
  ['motivo_disconformidad', 'Motivo de disconformidad'],
  ['p6', 'P6 Participó de operativo'],
  ['p7', 'P7 Servicios utilizados'],
  ['p8', 'P8 Atención recibida'],
  ['p9_1', 'P9 Problema 1'],
  ['p9_2', 'P9 Problema 2'],
  ['p9_3', 'P9 Problema 3'],
  ['p10', 'P10 Principal problema del barrio'],
  ['p10_otro', 'P10 Otro (especifica)'],
  ['p11', 'P11 Obra más relevante'],
  ['p11_otro', 'P11 Otra (especifica)'],
  ['p12', 'P12 Por qué'],
  ['p13', 'P13 Obra del distrito'],
  ['p13_otro', 'P13 Otra (especifica)'],
  ['p14', 'P14 Por qué'],
  ['p15', 'P15 Prioridad para el barrio']
];

function clavePosicion(clave) {
  return COLUMNAS.findIndex(function (c) { return c[0] === clave; }) + 1;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000); // evita que dos encuestadores escriban a la vez
    const datos = JSON.parse(e.postData.contents);

    if (datos.clave !== CLAVE) return responder({ ok: false, error: 'No autorizado' });
    if (!datos.idEncuesta || !datos.distrito || !datos.subzona) {
      return responder({ ok: false, error: 'Faltan datos obligatorios' });
    }

    const hoja = obtenerHoja();

    // Si la encuesta ya se había guardado (reintento), no se duplica
    const filaExistente = buscarId(hoja, datos.idEncuesta);
    if (filaExistente) {
      return responder({ ok: true, duplicada: true, numero: hoja.getRange(filaExistente, 1).getValue() });
    }

    const props = PropertiesService.getScriptProperties();
    const numero = Number(props.getProperty('contador') || 0) + 1;

    hoja.appendRow(construirFila(datos, numero));
    props.setProperty('contador', String(numero));

    return responder({ ok: true, numero: numero });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return responder({ ok: true, mensaje: 'Servicio activo' });
}

function construirFila(datos, numero) {
  const momento = datos.fechaCliente ? new Date(datos.fechaCliente) : new Date();
  const valida = !isNaN(momento.getTime()) ? momento : new Date();

  const calculados = {
    numero: numero,
    fecha: Utilities.formatDate(valida, ZONA_HORARIA, 'dd/MM/yyyy'),
    hora: Utilities.formatDate(valida, ZONA_HORARIA, 'HH:mm'),
    recibida: Utilities.formatDate(new Date(), ZONA_HORARIA, 'dd/MM/yyyy HH:mm')
  };

  return COLUMNAS.map(function (c) {
    const clave = c[0];
    return limpiar(clave in calculados ? calculados[clave] : datos[clave]);
  });
}

// Evita que un texto que empieza con = + - @ se interprete como fórmula
function limpiar(valor) {
  if (valor === undefined || valor === null) return '';
  if (typeof valor !== 'string') return valor;
  const texto = valor.trim().slice(0, 2000);
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function buscarId(hoja, id) {
  const ultima = hoja.getLastRow();
  if (ultima < 2) return 0;
  const rango = hoja.getRange(2, clavePosicion('idEncuesta'), ultima - 1, 1);
  const celda = rango.createTextFinder(String(id)).matchEntireCell(true).findNext();
  return celda ? celda.getRow() : 0;
}

function obtenerHoja() {
  const planilla = ID_PLANILLA ? SpreadsheetApp.openById(ID_PLANILLA) : SpreadsheetApp.getActiveSpreadsheet();
  let hoja = planilla.getSheetByName(NOMBRE_HOJA);
  if (!hoja) hoja = planilla.insertSheet(NOMBRE_HOJA);

  if (hoja.getLastRow() === 0) {
    const titulos = COLUMNAS.map(function (c) { return c[1]; });
    hoja.getRange(1, 1, 1, titulos.length).setValues([titulos]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}

// Ejecutar una sola vez a mano: crea la hoja con sus encabezados y pide los permisos
function inicializar() {
  obtenerHoja();
}
