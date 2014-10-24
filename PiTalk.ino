char* commandGmail = {"Gmail"};
char* commandMIT = {"MIT"};
char* replyOK = {"OK\n"};
char* replyWrongCMD = {"Wrong CMD\n"};
int MAX_COMMAND_LENGTH = 255;

char stopByte = '#';
char resetByte = '!';
int incomingByte = 0;
int charCount = 0;
char command[256];// leave space for \0
char* doneCommand = {"Done"}; 
bool locked = false;

int sensorVal=0;
int sensorValPrev = 0;
int sensorPin=0;
int red= 5;
int green= 6;
int blue= 3;

int openPin = 9;

int distChgCnt = 0;

void lightLED(int r, int g, int b){
  analogWrite(red,r);
  analogWrite(green,g);
  analogWrite(blue,b);
}


void setup() {
  Serial.begin(9600);
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);
  pinMode(openPin, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    incomingByte = Serial.read();
    
    if ((char)incomingByte == resetByte) {
      locked = false;
      charCount = 0;
      Serial.println("@RESETED");
      return;        
    }
    
    if (locked) {
      Serial.println("@LOCKED");
      return;
    }
    
    if ((char)incomingByte != stopByte) {
      if (charCount > MAX_COMMAND_LENGTH - 1) {
        Serial.println("@OVERFLOWED");
        locked = true;
        return;
      }
      else {
        command[charCount] = (char)incomingByte;
        charCount++;
      }
    }
    else {
      command[charCount] = '\0';
      charCount = 0;
      if (strcmp(commandGmail, command) == 0) {
        digitalWrite(openPin, HIGH);
        delay(500);
        digitalWrite(openPin, LOW); 
        Serial.println("GmailComing");
        lightLED(1000,0,0);
        delay(5000);
        lightLED(0,0,0);
        
        
      }
      else if (strcmp(commandMIT, command) == 0) {
        digitalWrite(openPin, HIGH);
        delay(500);
        digitalWrite(openPin, LOW); 
        Serial.println("MITMailComing");
        lightLED(0,0,1000);
        delay(5000);
        lightLED(0,0,0);
      }
      else {
        Serial.println(replyWrongCMD);
        Serial.println(command);
      }
    }  
  }

  
  if (strcmp(commandGmail, command) == 0 || strcmp(commandMIT, command) == 0) {
    sensorValPrev = sensorVal;
    sensorVal = analogRead(sensorPin);
    Serial.println("Sensor: ");
    Serial.println(sensorVal);

    if (sensorVal < 360 && sensorValPrev < 360 ){
      
      distChgCnt += 1;
      //Serial.println("Count: ");
    //Serial.println(distChgCnt);
      if (distChgCnt == 1){
        //Serial.println("Please read the mail for him/her!!");
        Serial.println("PLAY A SONG FOR ME!!!!");
        distChgCnt = 0;
        for (int i = 0; i < 4; i++){
          command[i] = doneCommand[i];
        }
      
      }
      
    }
    else {
      distChgCnt = 0;
    }    
  }
  
  delay(500);
}
