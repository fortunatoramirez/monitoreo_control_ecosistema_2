from socketIO_client import SocketIO
import serial
import time
import threading

IP_SERVER = 'localhost' #ip.del.ser.vidor
print("Comenzando...")
socketIO = SocketIO(IP_SERVER, 5001)
socketIO.emit("soy_arduino","_")
print("Conectado al servidor.")

print("Conectando al Arduino...")
arduino=serial.Serial('COM6',9600, timeout = 3.0)
arduino.isOpen()
print("Conectado al Arduino.")

def rutina(*args):
    data = args[0]
    print(data)
    if data=="P":
        arduino.write("P".encode())
    elif data=="A":
        arduino.write("A".encode())
def rx_listening(socketIO):
    socketIO.on('comando', rutina)
    socketIO.wait()
t = threading.Thread(target=rx_listening, args=(socketIO,))
t.start()

while True:
    arduino.write("r".encode())
    sig = arduino.readline().strip()
    if not sig:
        continue
    #sig = int(sig)
    sig = float(sig)
    #print(sig)
    socketIO.emit("desde_arduino",sig)
    time.sleep(0.15)
arduino.close()


