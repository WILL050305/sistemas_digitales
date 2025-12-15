/************************************************************
 *  ESP32 - SENSOR TDS + FIREBASE REALTIME DATABASE
 *  Historial SOLO si TDS > 1000 ppm
 *  Librería: FirebaseClient (mobizt)
 ************************************************************/

#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include <time.h>

// ================= WIFI =================
#define WIFI_SSID "Motog31"
#define WIFI_PASSWORD "antoniocardenas2005"

// ================= FIREBASE =================
#define Web_API_KEY "AIzaSyDHFOfUVFcdyU8CtKfToil_54IV4Oi3Ks4"
#define DATABASE_URL "https://sistemas-390c1-default-rtdb.firebaseio.com"
#define USER_EMAIL "gabrielcardenassanchez80@gmail.com"
#define USER_PASS "gabriel0503"

// ================= TDS =================
#define TDS_PIN 32
#define VREF 3.3
#define ADC_RESOLUTION 4095.0
float temperature = 25.0;

// ================= FIREBASE OBJETOS =================
UserAuth user_auth(Web_API_KEY, USER_EMAIL, USER_PASS);
WiFiClientSecure ssl_client;
FirebaseApp app;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);
RealtimeDatabase Database;

bool firebaseReady = false;

// ================= CLASIFICACIÓN TDS =================
String clasificarTDS(float tds) {
  if (tds <= 50)   return "Agua muy pura (RO/destilada)";
  if (tds <= 150)  return "EXCELENTE (51-150 ppm)";
  if (tds <= 300)  return "BUENA / ACEPTABLE";
  if (tds <= 500)  return "MODERADA / APTA (OMS)";
  if (tds <= 1000) return "DEFICIENTE - Evitar consumo";
  if (tds <= 2000) return "MUY DEFICIENTE - No apta";
  return "CRÍTICA - Posible agua contaminada";
}

// ================= WIFI =================
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true);
  delay(1000);

  Serial.print("📶 Conectando a WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    Serial.print(".");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi conectado");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ ERROR: No se pudo conectar al WiFi");
  }
}

// ================= SUBIR A FIREBASE =================
void subirTDSFirebase(float tds, float voltage) {
  if (!firebaseReady || WiFi.status() != WL_CONNECTED) return;

  time_t now = time(nullptr);
  struct tm *t = localtime(&now);
  String estado = clasificarTDS(tds);

  // ---------- ultima_lectura (SIEMPRE) ----------
  String base = "/ultima_lectura";

  Database.set<String>(aClient, base + "/accion", "Monitoreo en tiempo real");
  Database.set<String>(aClient, base + "/estado", estado);
  Database.set<float>(aClient, base + "/tds", tds);
  Database.set<float>(aClient, base + "/voltaje", voltage);

  Database.set<int>(aClient, base + "/fecha/anio", t->tm_year + 1900);
  Database.set<int>(aClient, base + "/fecha/mes", t->tm_mon + 1);
  Database.set<int>(aClient, base + "/fecha/dia", t->tm_mday);

  Database.set<int>(aClient, base + "/hora/hora", t->tm_hour);
  Database.set<int>(aClient, base + "/hora/minuto", t->tm_min);
  Database.set<int>(aClient, base + "/hora/segundo", t->tm_sec);

  // ---------- historial SOLO si TDS > 1000 ----------
  if (tds > 1000) {
    String ts = String(now);
    String hist = "/historial/" + ts;

    Database.set<String>(aClient, hist + "/accion", "ALERTA TDS ALTO");
    Database.set<String>(aClient, hist + "/estado", estado);
    Database.set<float>(aClient, hist + "/tds", tds);
    Database.set<float>(aClient, hist + "/voltaje", voltage);
    Database.set<int>(aClient, hist + "/timestamp", now);

    Serial.printf("🚨 HISTORIAL GUARDADO | %.1f ppm | %s\n",
                  tds, estado.c_str());
  } else {
    Serial.printf("ℹ️ TDS: %.1f ppm (sin historial)\n", tds);
  }
}

// ================= LECTURA TDS =================
void leerTDS() {
  int raw = analogRead(TDS_PIN);
  float voltage = raw * (VREF / ADC_RESOLUTION);

  float compensation = 1.0 + 0.02 * (temperature - 25.0);
  float compVoltage = voltage / compensation;

  float tds = (133.42 * pow(compVoltage, 3)
              - 255.86 * pow(compVoltage, 2)
              + 857.39 * compVoltage) * 0.5;

  subirTDSFirebase(tds, voltage);
}

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n══════════════════════════════════");
  Serial.println("  ESP32 TDS + Firebase Realtime");
  Serial.println("  Historial solo > 1000 ppm");
  Serial.println("══════════════════════════════════");

  analogReadResolution(12);

  initWiFi();

  // -------- NTP --------
  configTime(-5 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("🕐 Sincronizando hora");
  while (time(nullptr) < 100000) {
    Serial.print(".");
    delay(500);
  }
  Serial.println(" ✅");

  // -------- SSL --------
  ssl_client.setInsecure();
  ssl_client.setConnectionTimeout(1000);
  ssl_client.setHandshakeTimeout(5);

  // -------- FIREBASE --------
  Serial.println("🔥 Inicializando Firebase");
  initializeApp(aClient, app, getAuth(user_auth), nullptr, "authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);

  Serial.print("🔐 Autenticando");
  while (!app.ready()) {
    app.loop();
    Serial.print(".");
    delay(100);
  }
  Serial.println(" ✅");

  firebaseReady = true;
  Serial.println("🚀 Sistema listo\n");
}

// ================= LOOP =================
void loop() {
  app.loop();
  Database.loop();

  static unsigned long lastRead = 0;

  if (millis() - lastRead >= 2000) {   // cambia a 1000 si quieres 1s
    leerTDS();
    lastRead = millis();
  }
}
