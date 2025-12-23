#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP32Servo.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <IRremote.hpp>
#include <RtcDS1302.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

#define GMT_OFFSET_SEC  2 * 3600 
#define DAYLIGHT_OFFSET_SEC 0


const char* ssid = "Internet";
const char* password = "0950854548";
const char* serverUrl = "https://aquacore.onrender.com/measurements/sensor";
const char* apiKey = "aq_dev_12345";

const int RELAY_LIGHT = 26; 
const int RELAY_HEATER = 25; 
const int RELAY_AUX = 33;    

#define RTC_CLK_PIN 16
#define RTC_DAT_PIN 17  
#define RTC_RST_PIN 18 
#define IR_RECEIVE_PIN 15
#define DHT_PIN 23
#define DHT_TYPE DHT11
#define ONE_WIRE_BUS 4
#define FLOAT_SWITCH_PIN 13
#define TDS_PIN 35
#define TURBIDITY_PIN 32
#define PH_PIN 34
#define SERVO_PIN 12
#define BUZZER_PIN 19

LiquidCrystal_I2C lcd(0x27, 16, 2);
ThreeWire myWire(RTC_DAT_PIN, RTC_CLK_PIN, RTC_RST_PIN);
RtcDS1302<ThreeWire> Rtc(myWire);
DHT dht(DHT_PIN, DHT_TYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
Servo myServo;

byte iconThermometer[8] = {B00100, B01010, B01010, B01110, B01110, B11111, B11111, B01110};
byte iconDrop[8]        = {B00100, B00100, B01010, B01010, B10001, B10001, B10001, B01110};
byte iconWifi[8]        = {B00000, B01110, B10001, B00100, B01010, B00000, B00100, B00000};
byte iconWarning[8]     = {B00100, B01110, B01110, B11111, B11011, B11011, B11111, B00000};
byte iconPause[8]       = {B11011, B11011, B11011, B11011, B11011, B11011, B11011, B00000};

#define VREF 3.3
#define SCOUNT 30
int analogBuffer[SCOUNT];
int analogBufferIndex = 0;

unsigned long lastSensorRead = 0;
unsigned long lastScreenUpdate = 0;
unsigned long lastTelemetrySend = 0;
const unsigned long SENSOR_INTERVAL = 1000; 
const unsigned long SEND_INTERVAL = 60000;

int currentScreen = 0;              
const int MAX_SCREENS = 4; 

bool fedToday = false; 
bool manualLight = false;
bool autoScreen = true;

float AIR_TEMP_OFFSET = 2.5;

float currentWaterTemp = 0.0; 
float currentAirTemp = 0.0;
float currentRoomHum = 0.0;
float currentTDS = 0.0;
float currentPH = 0.0;
float currentTurbidityV = 0.0;
int waterLevel = 1; 

int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++) bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    for (i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0) bTemp = bTab[(iFilterLen - 1) / 2];
  else bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  return bTemp;
}

bool syncTimeFromNTP() {
    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC,
               "pool.ntp.org", "time.nist.gov");

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo, 10000)) {
        Serial.println("NTP FAILED");
        return false;
    }

    Serial.println("NTP OK → RTC UPDATED");

    RtcDateTime ntpTime(
        timeinfo.tm_year + 1900,
        timeinfo.tm_mon + 1,
        timeinfo.tm_mday,
        timeinfo.tm_hour,
        timeinfo.tm_min,
        timeinfo.tm_sec
    );

    Rtc.SetDateTime(ntpTime);
    Rtc.SetIsRunning(true);
    return true;
}

void setup() {
  Serial.begin(115200);
  Serial.println(">>> START AQUACORE<<<");

  pinMode(RELAY_LIGHT, OUTPUT);
  pinMode(RELAY_HEATER, OUTPUT);
  pinMode(RELAY_AUX, OUTPUT);
  
  digitalWrite(RELAY_LIGHT, HIGH); 
  digitalWrite(RELAY_HEATER, HIGH);
  digitalWrite(RELAY_AUX, LOW); 

  WiFi.begin(ssid, password);
  
  Wire.begin(21, 22); 
  lcd.init();         
  lcd.backlight();
  
  lcd.createChar(0, iconThermometer);
  lcd.createChar(1, iconDrop);
  lcd.createChar(2, iconWifi);
  lcd.createChar(3, iconWarning);
  lcd.createChar(4, iconPause);

  lcd.setCursor(0, 0); lcd.print("AquaCore System");
  lcd.setCursor(0, 1); lcd.print("Connecting...");

  int wifi_timeout = 0;
  while(WiFi.status() != WL_CONNECTED && wifi_timeout < 10) {
    delay(500);
    wifi_timeout++;
  }

  sensors.begin();
  dht.begin();
  
  pinMode(FLOAT_SWITCH_PIN, INPUT_PULLUP);
  pinMode(TDS_PIN, INPUT);
  pinMode(TURBIDITY_PIN, INPUT);
  pinMode(PH_PIN, INPUT);
  
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  myServo.attach(SERVO_PIN, 500, 2400);
  myServo.write(0); 

  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
  
  Rtc.Begin();

bool timeOk = false;

if (WiFi.status() == WL_CONNECTED) {
    timeOk = syncTimeFromNTP();
}

if (!timeOk) {
    Serial.println("USING RTC TIME");
    if (!Rtc.GetIsRunning()) {
        Serial.println(" RTC WAS STOPPED");
        Rtc.SetIsRunning(true);
    }
}

RtcDateTime now = Rtc.GetDateTime();
Serial.printf("TIME: %02u:%02u:%02u %02u-%02u-%04u\n",
    now.Hour(), now.Minute(), now.Second(),
    now.Day(), now.Month(), now.Year());

  delay(500);
  lcd.clear(); 
}

void sendTelemetry() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); 

  HTTPClient http;
  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<300> doc;
  doc["api_key"] = apiKey;

  JsonObject measurements = doc.createNestedObject("measurements");
  measurements["temperature"] = currentWaterTemp;
  measurements["ph"] = currentPH;
  measurements["tds"] = currentTDS;
  measurements["turbidity"] = currentTurbidityV;
  measurements["water_level"] = waterLevel;
  measurements["room_temperature"] = currentAirTemp;
  measurements["room_humidity"] = currentRoomHum;

  String jsonString;
  serializeJson(doc, jsonString);

  int httpCode = http.POST(jsonString);

  Serial.print("HTTP POST → ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    Serial.println(http.getString());
  }

  http.end();
}

String getTurbidityStatus(float voltage) {
  if (voltage > 3.9) return "Crystal"; 
  if (voltage > 3.0) return "Ok";      
  return "Dirty!";                     
}

String getTdsStatus(float tds) {
  if (tds < 50) return "Low";      
  if (tds > 400) return "Hard";    
  return "Good";
}

void updateDisplay() {
    RtcDateTime now = Rtc.GetDateTime();
    
    switch (currentScreen) {
        case 0: 
            lcd.setCursor(0, 0); 
            lcd.write(0); lcd.print(currentWaterTemp, 1); 
            lcd.print((char)223); lcd.print("C  ");
            
            lcd.write(1); lcd.print(currentPH, 1); lcd.print("pH ");

            lcd.setCursor(0, 1); 
            if(now.Hour() < 10) lcd.print("0");
            lcd.print(now.Hour()); lcd.print(":");
            if(now.Minute() < 10) lcd.print("0");
            lcd.print(now.Minute());
            
            lcd.print(" ");
            if(manualLight) lcd.print("M"); else lcd.print(" ");
            if(!autoScreen) lcd.write(4); else lcd.print(" ");
            break;

        case 1:
            lcd.setCursor(0, 0); 
            lcd.print("TDS:"); lcd.print((int)currentTDS); 
            lcd.print(" "); lcd.print(getTdsStatus(currentTDS)); lcd.print("   ");
            
            lcd.setCursor(0, 1);
            lcd.print("Water: "); 
            lcd.print(getTurbidityStatus(currentTurbidityV)); 
            lcd.print("      "); 
            
            if(!autoScreen) { lcd.setCursor(15,1); lcd.write(4); }
            break;

        case 2: 
            lcd.setCursor(0, 0); 
            lcd.print("Air: "); lcd.print(currentAirTemp, 1); 
            lcd.print((char)223); lcd.print("C    ");
            
            lcd.setCursor(0, 1);
            lcd.print("Hum: "); lcd.print(currentRoomHum, 0); lcd.print("%      ");
            if(!autoScreen) { lcd.setCursor(15,1); lcd.write(4); }
            break;

        case 3: 
            lcd.setCursor(0, 0);
            lcd.write(2); 
            if(WiFi.status() == WL_CONNECTED) {
                 lcd.print(" "); lcd.print(WiFi.localIP().toString().substring(10)); 
            } else {
                 lcd.print(" No Signal   ");
            }

            lcd.setCursor(0, 1);
            lcd.print("H:"); lcd.print(digitalRead(RELAY_HEATER) == LOW ? "ON" : "off");
            lcd.print(" A:"); lcd.print(digitalRead(RELAY_AUX) == LOW ? "ON" : "off");
            break;
    }
}

void loop() {
  unsigned long currentMillis = millis();

  if (IrReceiver.decode()) {
    uint32_t code = IrReceiver.decodedIRData.decodedRawData;

    if (code != 0) {
        Serial.print("IR: "); Serial.println(code, HEX);
        
        switch (code) {
            case 0xBA45FF00:
                manualLight = true;
                digitalWrite(RELAY_LIGHT, !digitalRead(RELAY_LIGHT));
                break;
            
            case 0xE916FF00: 
                Serial.println("Auto Mode ON");
                manualLight = false;
                autoScreen = true;
                break;

            case 0xB946FF00:
                digitalWrite(RELAY_AUX, !digitalRead(RELAY_AUX));
                break;
            case 0xBC43FF00:
                myServo.write(90); delay(1000); myServo.write(0);
                break;

            case 0xF30CFF00:
                currentScreen = 0; autoScreen = false; lcd.clear(); updateDisplay();
                break;
            case 0xE718FF00:
                currentScreen = 1; autoScreen = false; lcd.clear(); updateDisplay();
                break;
            case 0xA15EFF00: 
                currentScreen = 2; autoScreen = false; lcd.clear(); updateDisplay();
                break;
            case 0xF708FF00: 
                currentScreen = 3; autoScreen = false; lcd.clear(); updateDisplay();
                break;
            case 0xBF40FF00: 
                currentScreen++; if(currentScreen >= MAX_SCREENS) currentScreen = 0;
                autoScreen = false; lcd.clear(); updateDisplay();
                break;
            case 0xBB44FF00: 
                currentScreen--; if(currentScreen < 0) currentScreen = MAX_SCREENS - 1;
                autoScreen = false; lcd.clear(); updateDisplay();
                break;

            case 0xF609FF00: 
                digitalWrite(BUZZER_PIN, LOW);
                break;
        }
    }
    IrReceiver.resume(); 
  }

  if (currentMillis - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = currentMillis;

    sensors.requestTemperatures();
    float tRead = sensors.getTempCByIndex(0);
    if(tRead > -50 && tRead < 100) currentWaterTemp = tRead;

    waterLevel = digitalRead(FLOAT_SWITCH_PIN); 
    if(waterLevel == LOW) digitalWrite(BUZZER_PIN, HIGH);
    else digitalWrite(BUZZER_PIN, LOW);

    float h = dht.readHumidity();
    float t = dht.readTemperature();
    if (!isnan(h) && !isnan(t)) {
      currentRoomHum = h; currentAirTemp = t - AIR_TEMP_OFFSET;
    }

    analogBuffer[analogBufferIndex] = analogRead(TDS_PIN);
    analogBufferIndex++; if(analogBufferIndex >= SCOUNT) analogBufferIndex = 0;
    int analogTds = getMedianNum(analogBuffer, SCOUNT);
    float voltTds = analogTds * VREF / 4095.0;
    currentTDS = (133.42 * voltTds * voltTds * voltTds - 255.86 * voltTds * voltTds + 857.39 * voltTds) * 0.5;

    int phRaw = analogRead(PH_PIN);
    currentPH = (-5.70 * (phRaw * VREF / 4095.0)) + 21.34;
    currentTurbidityV = analogRead(TURBIDITY_PIN) * (VREF / 4095.0);
    
    updateDisplay(); 
  }

  if (autoScreen && (currentMillis - lastScreenUpdate >= 3000)) {
      lastScreenUpdate = currentMillis;
      currentScreen++;
      if (currentScreen >= MAX_SCREENS) currentScreen = 0;
      lcd.clear();
      updateDisplay();
  }

  RtcDateTime now = Rtc.GetDateTime();

  if (!manualLight) {
      if (now.Hour() >= 8 && now.Hour() < 23) digitalWrite(RELAY_LIGHT, LOW);
      else digitalWrite(RELAY_LIGHT, HIGH);
  }

  if (now.Hour() == 9 && now.Minute() == 0) {
    if (!fedToday) {
      myServo.write(90); delay(1000); myServo.write(0);
      fedToday = true;
    }
  } else fedToday = false;

  if (currentWaterTemp < 24.8) {          
      digitalWrite(RELAY_HEATER, LOW);
    } 
    else if (currentWaterTemp > 25.2) {   
      digitalWrite(RELAY_HEATER, HIGH); 
    }

  if (currentMillis - lastTelemetrySend >= SEND_INTERVAL) {
    lastTelemetrySend = currentMillis;
    sendTelemetry();
  }
}