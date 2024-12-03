// OledySensoryBuzzerManager.h
// Codigo del oled y buzzer
#ifndef OLEDY_SENSORY_BUZZER_MANAGER_H
#define OLEDY_SENSORY_BUZZER_MANAGER_H

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <SD.h>

class OledySensoryBuzzerManager {
private:
    Adafruit_SSD1306 display;
    int redPin = 21;  // Pin analógico para lectura de red
    int irPin = 22;   // Pin analógico para lectura de infrarrojos
    int buzzerPin = 12; // Pin para el buzzer

public:
    OledySensoryBuzzerManager() : display(128, 64, &Wire, -1) {}

    void init() {
        // Inicializar la pantalla OLED
        if (!display.begin(0x3C)) {

            Serial.println(F("No se pudo inicializar la pantalla OLED"));
            while (true);
        }
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
    }

    // Método para actualizar la pantalla OLED con el valor del BPM
    void updateBpmDisplay(float bpm) {
        display.clearDisplay();
        display.setCursor(0, 0);
        display.print("BPM: ");
        display.println(bpm);
        display.display();
    }

    // Método para activar el buzzer (sonido)
    void activateBuzzer(int frequency, int duration) {
        tone(buzzerPin, frequency, duration);  // Enviar señal al buzzer
    }

    // Obtener el valor de la señal roja del sensor (valor analógico)
    int getRedValue() {
        return analogRead(redPin);
    }

    // Obtener el valor de la señal infrarroja del sensor (valor analógico)
    int getIRValue() {
        return analogRead(irPin);
    }
};

#endif  // OLEDY_SENSORY_BUZZER_MANAGER_H