#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP32Servo.h> 

#define ONE_WIRE_BUS 4       
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

#define FLOAT_SWITCH_PIN 13  
#define TDS_PIN 35           
#define TURBIDITY_PIN 32    
#define PH_PIN 34            

#define SERVO_PIN 12 
Servo myServo;      

#define VREF 3.3 
#define SCOUNT 30 
int analogBuffer[SCOUNT]; 
int analogBufferIndex = 0;

int loopCounter = 0;

int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];
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
  if ((iFilterLen & 1) > 0)
    bTemp = bTab[(iFilterLen - 1) / 2];
  else
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  return bTemp;
}


void setup() {
  Serial.begin(115200);
  Serial.println("Тест: Температура, Поплавок, Серво, TDS, Каламутність та pH...");

  sensors.begin();
  
  pinMode(FLOAT_SWITCH_PIN, INPUT_PULLUP);

  myServo.attach(SERVO_PIN); 
  myServo.write(1000); 
  Serial.println("Сервопривід встановлено в 0 градусів.");

  pinMode(TDS_PIN, INPUT); 
  pinMode(TURBIDITY_PIN, INPUT);
  pinMode(PH_PIN, INPUT); 
}

void loop() {
  loopCounter++; 
  float tempC = 25.0;
  
  sensors.requestTemperatures(); 
  float tempReading = sensors.getTempCByIndex(0);

  if(tempReading != DEVICE_DISCONNECTED_C && tempReading > -100) {
    tempC = tempReading; 
    Serial.print("Температура: ");
    Serial.print(tempC);
    Serial.println(" C");
  } else {
    Serial.println("ПОМИЛКА: Датчик температури не знайдено!");
  }

  int waterLevel = digitalRead(FLOAT_SWITCH_PIN);
  if(waterLevel == HIGH) {
    Serial.println("РІВЕНЬ ВОДИ: НЕБЕЗПЕКА! (Поплавок впав)");
  } else {
    Serial.println("РІВЕНЬ ВОДИ: Норма (Поплавок сплив)");
  }

  if (loopCounter >= 3) {
    Serial.println("Серво: Рух -> 90 градусів (годування)");
    myServo.write(360); 
    delay(100); 
    Serial.println("Серво: Рух -> 0 градусів (закрито)");
    myServo.write(0); 
    loopCounter = 0; 
  } else {
    Serial.println("Серво: (чекаємо)");
  }

  static unsigned long analogSampleTimepoint = millis();
  if (millis() - analogSampleTimepoint > 40U) { 
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TDS_PIN); 
    analogBufferIndex++;
    if (analogBufferIndex == SCOUNT) {
      analogBufferIndex = 0;
    }
  }

  int analogValue = getMedianNum(analogBuffer, SCOUNT); 
  float averageVoltage = analogValue * VREF / 4095.0; 
  float compensationCoefficient = 1.0 + 0.02 * (tempC - 25.0); 
  float compensationVoltage = averageVoltage / compensationCoefficient; 
  
  float tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage 
             - 255.86 * compensationVoltage * compensationVoltage 
             + 857.39 * compensationVoltage) * 0.5; 

  Serial.print("TDS: ");
  Serial.print(tdsValue, 0); 
  Serial.println(" ppm");
  
  
  int turbidityRaw = analogRead(TURBIDITY_PIN);
  float turbidityVoltage = turbidityRaw * (VREF / 4095.0);
  
  Serial.print("Каламутність (Raw): ");
  Serial.print(turbidityRaw);
  Serial.print(", (Voltage): ");
  Serial.print(turbidityVoltage);
  Serial.println(" V");

  int phRaw = analogRead(PH_PIN);
  
  float phVoltage = phRaw * (VREF / 4095.0);
  
  float phValue = (-5.70 * phVoltage) + 21.34;
  
  Serial.print("pH (Voltage): ");
  Serial.print(phVoltage, 2); 
  Serial.print(", pH (Розрахунковий): ");
  Serial.println(phValue, 2); 


  Serial.println("---------------------------------");
  delay(2000); 
}


