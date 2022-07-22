from ast import arg
from socketIO_client import SocketIO
alarma = False

IP_SERVER = 'localhost'
# Conectando al socket del Servidor
print("Conectando al Servidor...")
socketIO = SocketIO(IP_SERVER,5001)
print("Conectado al Servidor.")

def rutina(*args):
    print(args[0])
    # global alarma
    # muestra = int(args[0])
    # if muestra > 511 and alarma == False:
    #     socketIO.emit("comando","P")
    #     alarma = True
    # elif muestra < 512 and alarma == True:
    #     socketIO.emit("comando","A")
    #     alarma = False


socketIO.on('arduino', rutina)
socketIO.wait()