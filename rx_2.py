import datetime as dt
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from socketIO_client import SocketIO
import threading

IP_SERVER = 'localhost'
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1)
xs = []
ys = []
muestra = None

def rutina(*args):
    global xs
    global ys
    muestra = args[0]
    muestra = float(muestra)
    ys.append(muestra)
    xs.append(dt.datetime.now().strftime('%H:%M:%S.%f'))


def wsthread(xs,ys):
    # Conectando al socket del Servidor
    print("Conectando al Servidor...")
    socketIO = SocketIO(IP_SERVER,5001)
    print("Conectado al Servidor.")
    socketIO.on('arduino', rutina)
    socketIO.wait()

t = threading.Thread(target=wsthread, args=(xs,ys,))
t.start()

def animate(i):
    global xs
    global ys

    xs = xs[-20:]
    ys = ys[-20:]

    ax.clear()
    ax.plot(xs, ys)

    plt.xticks(rotation=45)
    plt.subplots_adjust(bottom=0.30)
    plt.title('Leyendo puerto serial')
    plt.ylabel('Amplitud')

ani = animation.FuncAnimation(fig, animate, interval=50)
plt.show()