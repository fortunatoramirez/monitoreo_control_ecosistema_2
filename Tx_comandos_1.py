from socketIO_client import SocketIO

IP_SERVER = 'localhost' #ip.del.ser.vidor
print("Comenzando...")
socketIO = SocketIO(IP_SERVER, 5001)
print("Conectado al servidor.")

while True:
    comando = input('Introduzca el comando: ')
    socketIO.emit("comando",comando.strip())