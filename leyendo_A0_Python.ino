int pinA0 = A0;
int val = 0;
float val_real;
char car;


void setup() {
 Serial.begin(9600);
 pinMode(LED_BUILTIN,OUTPUT);
 pinMode(5,OUTPUT);
}

void loop() {

  if(Serial.available())
  {
    car = Serial.read();
    if(car == 'r')
    {
      val = analogRead(pinA0);
      //val = val >> 5;
      //Serial.println(val);
      //val_real = 5*((float)val/1023);
      Serial.println(val);
    }
    else if(car == 'P')
    {
      digitalWrite(LED_BUILTIN,HIGH);
      digitalWrite(5,HIGH);
    }
    else if(car == 'A')
    {
      digitalWrite(LED_BUILTIN,LOW);
      digitalWrite(5,LOW);
    }
  }
  //delay(1000);
}
