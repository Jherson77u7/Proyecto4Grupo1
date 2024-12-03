#ifndef SONIDO_MANAGER_H
#define SONIDO_MANAGER_H

#include <SPI.h>
#include <SD.h>

class SonidoManager {
private:
    int soundPin = 25; 
    int sdChipSelectPin = 5;  

public:
    SonidoManager() {}
// verifica la tarjeta 
    void init() {
       
        if (!SD.begin(sdChipSelectPin)) {
            Serial.println("Error al inicializar la tarjeta SD");
            while (true);
        }
        pinMode(soundPin, OUTPUT);  
    }

    
    void playTone(int frequency, int duration) {
        tone(soundPin, frequency, duration);  
    }

    
    void stopTone() {
        noTone(soundPin);  
    }

   
    void playWavFile(const char *fileName) {

        Serial.print("Reproduciendo archivo: ");
        Serial.println(fileName);
        
    }
};

#endif  // SONIDO_MANAGER_H