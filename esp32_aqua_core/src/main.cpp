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
#include <FastLED.h>


#define LED_PIN 27        
#define NUM_LEDS 20       
CRGB leds[NUM_LEDS];

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define RTC_DAT_PIN 17
#define RTC_CLK_PIN 16
#define RTC_RST_PIN 5  
ThreeWire myWire(RTC_DAT_PIN, RTC_CLK_PIN, RTC_RST_PIN);
RtcDS1302<ThreeWire> Rtc(myWire);

#define IR_RECEIVE_PIN 15

#define DHT_PIN 23
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

#define FLOAT_SWITCH_PIN 13
#define TDS_PIN 35
#define TURBIDITY_PIN 32
#define PH_PIN 34
#define SERVO_PIN 12
#define BUZZER_PIN 19

Servo myServo;

#define VREF 3.3
#define SCOUNT 30
int analogBuffer[SCOUNT];
int analogBufferIndex = 0;

int loopCounter = 0;
unsigned long lastScreenUpdate = 0; 
int currentScreen = 0;              

float currentWaterTemp = 25.0; 
float currentAirTemp = 0.0;
float currentRoomHum = 0.0;
float currentTDS = 0.0;
float currentPH = 0.0;
float currentTurbidityV = 0.0;
int currentTurbidityRaw = 0;

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

void setup() {
  Serial.begin(115200);
  Serial.println(">>> СТАРТ СИСТЕМИ (LCD + SERIAL) <<<");

  Wire.begin(21, 22); 
  lcd.init();         
  lcd.backlight();    
  lcd.setCursor(0, 0); lcd.print("System Start...");

  sensors.begin();
  dht.begin();
  
  pinMode(FLOAT_SWITCH_PIN, INPUT_PULLUP);
  pinMode(TDS_PIN, INPUT);
  pinMode(TURBIDITY_PIN, INPUT);
  pinMode(PH_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  myServo.attach(SERVO_PIN);
  myServo.write(0);

  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
  
  Rtc.Begin();
  Rtc.SetIsWriteProtected(false);
  Rtc.SetIsRunning(true);

  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(40); 

  delay(1000);
  lcd.clear();
}

void loop() {
  loopCounter++;
  
  
  if (IrReceiver.decode()) {
    Serial.print("IR Code: ");
    Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX);
    IrReceiver.resume();
  }

  sensors.requestTemperatures();
  float tempReading = sensors.getTempCByIndex(0);
  if(tempReading != DEVICE_DISCONNECTED_C && tempReading > -100) {
    currentWaterTemp = tempReading;
  }

  int waterLevel = digitalRead(FLOAT_SWITCH_PIN);
  if(waterLevel == HIGH) {
    digitalWrite(BUZZER_PIN, HIGH);
    lcd.setCursor(0, 0); lcd.print("!! WARNING !!   ");
    lcd.setCursor(0, 1); lcd.print("WATER LEVEL LOW ");
    Serial.println("!!! ALARM: LOW WATER LEVEL !!!"); 
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }

  if (loopCounter >= 100) { 
    Serial.println(">>> FEEDING TIME <<<");
    myServo.write(90);
    delay(1000);
    myServo.write(0);
    loopCounter = 0;
  }

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (!isnan(h) && !isnan(t)) {
    currentRoomHum = h;
    currentAirTemp = t;
  }

  static unsigned long analogSampleTimepoint = millis();
  if (millis() - analogSampleTimepoint > 40U) {
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TDS_PIN);
    analogBufferIndex++;
    if (analogBufferIndex == SCOUNT) analogBufferIndex = 0;
  }
  int analogValue = getMedianNum(analogBuffer, SCOUNT);
  float averageVoltage = analogValue * VREF / 4095.0;
  float compensationCoefficient = 1.0 + 0.02 * (currentWaterTemp - 25.0);
  float compensationVoltage = averageVoltage / compensationCoefficient;
  currentTDS = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage
             - 255.86 * compensationVoltage * compensationVoltage
             + 857.39 * compensationVoltage) * 0.5;

  currentTurbidityRaw = analogRead(TURBIDITY_PIN);
  currentTurbidityV = currentTurbidityRaw * (VREF / 4095.0);

  int phRaw = analogRead(PH_PIN);
  float phVoltage = phRaw * (VREF / 4095.0);
  currentPH = (-5.70 * phVoltage) + 21.34;

  RtcDateTime now = Rtc.GetDateTime();

  Serial.print("Час: ");
  Serial.print(now.Hour()); Serial.print(":");
  Serial.print(now.Minute()); Serial.print(":");
  Serial.println(now.Second());

  Serial.print("Вода Temp: "); Serial.print(currentWaterTemp); Serial.println(" C");
  
  if (waterLevel == HIGH) Serial.println("Рівень води: НЕБЕЗПЕКА!");
  else Serial.println("Рівень води: ОК");

  Serial.print("Кімната Temp: "); Serial.print(currentAirTemp); Serial.println(" C");
  Serial.print("Кімната Hum:  "); Serial.print(currentRoomHum); Serial.println(" %");

  Serial.print("TDS: "); Serial.print(currentTDS, 0); Serial.println(" ppm");
  
  Serial.print("Turbidity: "); Serial.print(currentTurbidityRaw); 
  Serial.print(" ("); Serial.print(currentTurbidityV); Serial.println(" V)");

  Serial.print("pH: "); Serial.print(currentPH, 2); 
  Serial.print(" (Calc)");
  Serial.println();
  Serial.println("---------------------------------");

  if (waterLevel == LOW && millis() - lastScreenUpdate > 3000) {
    lastScreenUpdate = millis();
    lcd.clear();
    
    if (currentScreen == 0) {
      lcd.setCursor(0, 0); lcd.print("W:"); lcd.print(currentWaterTemp, 1); lcd.print("C ");
      lcd.print("A:"); lcd.print(currentAirTemp, 0); lcd.print("C");
      lcd.setCursor(0, 1); lcd.print("Hum: "); lcd.print(currentRoomHum, 0); lcd.print("%");
      currentScreen = 1;
    } 
    else if (currentScreen == 1) {
      lcd.setCursor(0, 0); lcd.print("TDS:"); lcd.print(currentTDS, 0); 
      lcd.print(" pH:"); lcd.print(currentPH, 1);
      lcd.setCursor(0, 1); lcd.print("Turb:"); lcd.print(currentTurbidityV, 1); lcd.print("V");
      currentScreen = 2;
    }
    else if (currentScreen == 2) {
      lcd.setCursor(0, 0);
      lcd.print("Time: ");
      if (now.Hour() < 10) lcd.print("0"); lcd.print(now.Hour()); lcd.print(":");
      if (now.Minute() < 10) lcd.print("0"); lcd.print(now.Minute()); lcd.print(":");
      if (now.Second() < 10) lcd.print("0"); lcd.print(now.Second());
      lcd.setCursor(0, 1);
      lcd.print("System OK");
      currentScreen = 0;
    }
  }

    for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB(0, 0, 0);
}
leds[0] = CRGB::Blue;
leds[1] = CRGB::Red;
leds[2] = CRGB::Green;
FastLED.show();

  delay(200);
}