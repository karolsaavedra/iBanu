import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

const preguntas = [
  { icono: '📚', texto: '¿Qué materias podría cursar el próximo semestre?' },
  { icono: '🗓️', texto: '¿Cuál es mi horario de clases?' },
  { icono: '📖', texto: '¿Qué materias estoy cursando actualmente?' },
  { icono: '📊', texto: '¿Cómo va mi historial académico?' },
  { icono: '📝', texto: '¿Qué materias tengo pendientes?' },
  { icono: '👨‍🏫', texto: '¿Qué profesores dictan mis asignaturas?' },
  { icono: '⏰', texto: '¿Cuáles son los turnos de inscripción disponibles?' },
];

type Mensaje = {
  id: number;
  texto: string;
  usuario: boolean;
};

export default function App() {
  const [codigo, setCodigo] = useState('');
  const [sesion, setSesion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = () => {
    if (!/^U\d{8}$/.test(codigo.trim())) {
      alert('Ingresa un código válido. Ejemplo: U00112048');
      return;
    }
    setCodigo(codigo.trim().toUpperCase());
    setSesion(true);
  };

  const enviarMensaje = async (texto: string) => {
    const consulta = texto.trim();
    if (!consulta || cargando) return;

    setMensajes((prev) => [
      ...prev,
      { id: Date.now(), texto: consulta, usuario: true },
    ]);
    setMensaje('');
    setCargando(true);

    try {
      if (!API_URL) {
        throw new Error('La dirección del backend todavía no está configurada.');
      }

      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_estudiante: codigo,
          mensaje: consulta,
          historial: mensajes.slice(-8).map((m) => ({
            rol: m.usuario ? 'estudiante' : 'asistente',
            contenido: m.texto,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'No fue posible procesar la consulta.');
      }

      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          texto: data.respuesta || 'No recibí una respuesta del asistente.',
          usuario: false,
        },
      ]);
    } catch (error) {
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          texto: error instanceof Error
            ? error.message
            : 'Ocurrió un error de conexión.',
          usuario: false,
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  if (!sesion) {
    return (
      <SafeAreaView style={styles.fondo}>
        <StatusBar style="light" />
        <View style={styles.loginContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoTexto}>iB</Text>
          </View>
          <Text style={styles.nombre}>iBanú</Text>
          <Text style={styles.subtitulo}>Tu orientación académica, más cerca.</Text>

          <View style={styles.loginCard}>
            <Text style={styles.tituloLogin}>¡Hola!</Text>
            <Text style={styles.descripcion}>
              Ingresa tu código de estudiante para comenzar.
            </Text>
            <Text style={styles.label}>Código de estudiante</Text>
            <TextInput
              style={styles.inputCodigo}
              placeholder="Ej. U00112048"
              placeholderTextColor="#8795A5"
              value={codigo}
              onChangeText={setCodigo}
              autoCapitalize="characters"
              maxLength={9}
            />
            <TouchableOpacity style={styles.botonPrincipal} onPress={iniciarSesion}>
              <Text style={styles.textoBoton}>Continuar</Text>
              <Text style={styles.flecha}>→</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pieLogin}>Asistente académico · Ingeniería de Sistemas</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.fondoClaro}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerMarca}>
          <View style={styles.logoPequeno}>
            <Text style={styles.logoPequenoTexto}>iB</Text>
          </View>
          <View>
            <Text style={styles.headerNombre}>iBanú</Text>
            <Text style={styles.estado}>● Asistente académico</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {
          setSesion(false);
          setMensajes([]);
          setCodigo('');
        }}>
          <Text style={styles.cerrarSesion}>Salir</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.contenido}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContenido}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.bienvenida}>
            <Text style={styles.saludo}>Hola, estudiante 👋</Text>
            <Text style={styles.bienvenidaTexto}>
              Soy iBanú. Estoy aquí para ayudarte con tu vida académica.
            </Text>
            <Text style={styles.codigoActivo}>Código: {codigo}</Text>
          </View>

          {mensajes.length === 0 && (
            <View style={styles.frecuentes}>
              <Text style={styles.seccionTitulo}>¿Qué te gustaría consultar?</Text>
              <Text style={styles.seccionDescripcion}>
                Puedes elegir una pregunta o escribir la tuya.
              </Text>
              {preguntas.map((pregunta, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pregunta}
                  onPress={() => enviarMensaje(pregunta.texto)}
                  disabled={cargando}
                >
                  <Text style={styles.preguntaIcono}>{pregunta.icono}</Text>
                  <Text style={styles.preguntaTexto}>{pregunta.texto}</Text>
                  <Text style={styles.preguntaFlecha}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {mensajes.map((item) => (
            <View
              key={item.id}
              style={[
                styles.filaMensaje,
                item.usuario ? styles.filaUsuario : styles.filaBot,
              ]}
            >
              {!item.usuario && (
                <View style={styles.avatarBot}>
                  <Text style={styles.avatarTexto}>iB</Text>
                </View>
              )}
              <View style={[
                styles.burbuja,
                item.usuario ? styles.burbujaUsuario : styles.burbujaBot,
              ]}>
                <Text style={[
                  styles.textoMensaje,
                  item.usuario ? styles.textoUsuario : styles.textoBot,
                ]}>{item.texto}</Text>
              </View>
            </View>
          ))}

          {cargando && (
            <View style={styles.cargando}>
              <ActivityIndicator color="#168C83" />
              <Text style={styles.textoCargando}>iBanú está preparando tu respuesta...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.compositor}>
          <TextInput
            style={styles.inputMensaje}
            placeholder="Escribe tu pregunta..."
            placeholderTextColor="#8795A5"
            value={mensaje}
            onChangeText={setMensaje}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.botonEnviar, (!mensaje.trim() || cargando) && styles.botonDesactivado]}
            onPress={() => enviarMensaje(mensaje)}
            disabled={!mensaje.trim() || cargando}
          >
            <Text style={styles.enviarIcono}>↑</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.notaDatos}>Información académica de demostración · Datos sintéticos</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#102A43' },
  fondoClaro: { flex: 1, backgroundColor: '#F4F7FA' },
  loginContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: {
    width: 76, height: 76, borderRadius: 24, backgroundColor: '#20A69A',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    marginBottom: 14,
  },
  logoTexto: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  nombre: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', textAlign: 'center' },
  subtitulo: { color: '#C4D4E3', fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 38 },
  loginCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24 },
  tituloLogin: { color: '#102A43', fontSize: 25, fontWeight: '800', marginBottom: 8 },
  descripcion: { color: '#627D98', fontSize: 14, lineHeight: 21, marginBottom: 25 },
  label: { color: '#334E68', fontSize: 13, fontWeight: '700', marginBottom: 9 },
  inputCodigo: {
    height: 52, borderWidth: 1, borderColor: '#D9E2EC', borderRadius: 12,
    paddingHorizontal: 15, color: '#102A43', fontSize: 16, marginBottom: 18,
  },
  botonPrincipal: {
    height: 52, backgroundColor: '#168C83', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
  },
  textoBoton: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  flecha: { color: '#FFFFFF', fontSize: 21, marginLeft: 10 },
  pieLogin: { color: '#A9BDCE', textAlign: 'center', fontSize: 11, marginTop: 28 },
  header: {
    backgroundColor: '#102A43', paddingHorizontal: 20, paddingVertical: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerMarca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoPequeno: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#20A69A',
    alignItems: 'center', justifyContent: 'center',
  },
  logoPequenoTexto: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  headerNombre: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  estado: { color: '#9DD9D2', fontSize: 11, marginTop: 2 },
  cerrarSesion: { color: '#C4D4E3', fontSize: 13, padding: 8 },
  contenido: { flex: 1 },
  scroll: { flex: 1 },
  scrollContenido: { padding: 18, paddingBottom: 25 },
  bienvenida: {
    backgroundColor: '#E2F3F1', borderRadius: 18, padding: 18, marginBottom: 23,
  },
  saludo: { color: '#102A43', fontSize: 21, fontWeight: '800', marginBottom: 7 },
  bienvenidaTexto: { color: '#486581', fontSize: 13, lineHeight: 20 },
  codigoActivo: { color: '#168C83', fontSize: 11, fontWeight: '700', marginTop: 12 },
  frecuentes: { marginBottom: 15 },
  seccionTitulo: { color: '#102A43', fontSize: 17, fontWeight: '800' },
  seccionDescripcion: { color: '#627D98', fontSize: 12, marginTop: 5, marginBottom: 14 },
  pregunta: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 14, borderRadius: 13, marginBottom: 9, borderWidth: 1, borderColor: '#E5EBF0',
  },
  preguntaIcono: { fontSize: 19, marginRight: 12 },
  preguntaTexto: { flex: 1, color: '#334E68', fontSize: 13, fontWeight: '600', lineHeight: 19 },
  preguntaFlecha: { color: '#168C83', fontSize: 23, marginLeft: 8 },
  filaMensaje: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  filaUsuario: { justifyContent: 'flex-end' },
  filaBot: { justifyContent: 'flex-start' },
  avatarBot: {
    width: 30, height: 30, borderRadius: 11, backgroundColor: '#168C83',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  avatarTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  burbuja: { maxWidth: '83%', padding: 13, borderRadius: 16 },
  burbujaUsuario: { backgroundColor: '#168C83', borderBottomRightRadius: 4 },
  burbujaBot: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  textoMensaje: { fontSize: 14, lineHeight: 21 },
  textoUsuario: { color: '#FFFFFF' },
  textoBot: { color: '#334E68' },
  cargando: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10 },
  textoCargando: { color: '#627D98', fontSize: 12 },
  compositor: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    marginHorizontal: 14, marginTop: 8, padding: 8, borderRadius: 17,
    borderWidth: 1, borderColor: '#D9E2EC',
  },
  inputMensaje: { flex: 1, color: '#102A43', fontSize: 14, paddingHorizontal: 10, maxHeight: 100 },
  botonEnviar: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: '#168C83',
    alignItems: 'center', justifyContent: 'center',
  },
  botonDesactivado: { opacity: 0.4 },
  enviarIcono: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  notaDatos: { color: '#829AB1', fontSize: 10, textAlign: 'center', paddingVertical: 8 },
});
